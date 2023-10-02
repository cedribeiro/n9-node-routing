import 'reflect-metadata';
import './utils/error-to-json.js';

import { configure } from '@neo9/n9-node-conf';
import { classToPlain } from 'class-transformer';
import * as PrometheusClient from 'prom-client';
import { Container } from 'typedi';

// @ts-ignore - Package JSON isn't 100% matching
import * as packageJsonFile from '../package.json' assert { type: 'json' };
import * as ExpressApp from './express-app.js';
import { initAPM } from './init-apm.js';
import { validateConf } from './init-conf.js';
import initialiseModules from './initialise-modules.js';
import * as N9NodeRouting from './models/routing/index.js';
import {
	applyDefaultValuesOnOptions,
	getLoadingConfOptions,
	mergeOptionsAndConf,
} from './options.js';
import { registerShutdown } from './register-system-signals.js';
import { requestIdFilter } from './requestid.js';
import * as Routes from './routes.js';
import { initExposedConf } from './routes.js';
import startModules from './start-modules.js';
import { getEnvironment } from './utils.js';
import { N9HttpClient } from './utils/http-client-base.js';

/* istanbul ignore next */
function handleThrow(err: Error): void {
	throw err;
}

export { Inject, Service, Container } from 'typedi';

export { getFromContainer, useContainer } from 'class-validator';
export type { UseContainerOptions } from 'class-validator';
export * from 'class-validator';
export { Type, Transform, Exclude, Expose, classToPlain, plainToClass } from 'class-transformer';
export { getMetadataArgsStorage } from '@benjd90/routing-controllers';
export * from 'routing-controllers-openapi';
export * from '@neo9/n9-node-utils'; // allow users to use n9-node-utils without importing it specifically
export { N9Log } from '@neo9/n9-node-log';

export * from './decorators/acl.decorator.js';
export * from './validators/index.js';
export * from './transformer/index.js';
export * from './models/routes.models.js';
export * from './utils/http-client-base.js';
export * from './utils/http-cargo-builder.js';
export * from './utils/cargo.js';

export * as N9NodeRouting from './models/routing/index.js';

export { PrometheusClient };

// tslint:disable-next-line:cyclomatic-complexity
export default async <
	ConfType extends N9NodeRouting.N9NodeRoutingBaseConf = N9NodeRouting.N9NodeRoutingBaseConf,
>(
	optionsParam: N9NodeRouting.Options<ConfType> = {},
): Promise<N9NodeRouting.ReturnObject<ConfType>> => {
	// Provides a stack trace for unhandled rejections instead of the default message string.
	process.on('unhandledRejection', handleThrow);
	// Options default
	const environment = getEnvironment();

	// Load project conf and logger & set as global
	let conf: ConfType = await configure(getLoadingConfOptions(optionsParam));
	const options: N9NodeRouting.Options<ConfType> = mergeOptionsAndConf(
		optionsParam,
		conf.n9NodeRoutingOptions,
	);
	// @ts-ignore - Package JSON isn't 100% matching
	const packageJson = (packageJsonFile as any).default;
	applyDefaultValuesOnOptions(options, environment, packageJson.name);
	const logger = options.log;
	(global as any).log = options.log;

	// print app infos
	const initialInfos = `${conf.name} version : ${conf.version} env: ${conf.env} node: ${process.version}`;
	logger.info('-'.repeat(initialInfos.length));
	logger.info(initialInfos);
	logger.info('-'.repeat(initialInfos.length));

	// Profile startup boot time
	logger.profile('startup');

	if (options.enableRequestId) {
		options.log.addFilter(requestIdFilter);
	}

	const confInstance: ConfType = await validateConf(conf, options.conf.validation, logger);
	conf = confInstance || conf;
	(global as any).conf = conf;
	initExposedConf(classToPlain(conf));

	Container.set('logger', logger);
	Container.set('conf', conf);
	Container.set('N9HttpClient', new N9HttpClient(logger, options.httpClient));
	Container.set('N9NodeRoutingOptions', options);

	if (options.apm) {
		initAPM(options.apm, logger);
	}

	// Execute all *.init.ts files in modules before app started listening on the HTTP Port
	await initialiseModules(options.path, logger, options.firstSequentialInitFileNames);
	const returnObject = await ExpressApp.init<ConfType>(options, packageJson, logger, conf);
	Routes.init(returnObject.app, options, packageJson, environment);

	// Manage SIGTERM & SIGINT
	if (options.shutdown.enableGracefulShutdown) {
		registerShutdown(logger, options.shutdown, returnObject.server);
	}

	// Execute all *.started.ts files in modules after app started listening on the HTTP Port
	await startModules(options.path, logger, options.firstSequentialStartFileNames);

	logger.profile('startup');
	return returnObject;
};
