import { N9Log } from '@neo9/n9-node-log';
import * as express from 'express';
import * as mongodb from 'mongodb';
import * as newRelic from 'newrelic';

import * as N9NodeRouting from './models/routing/index.js';

export function initAPM(options: N9NodeRouting.APMOptions, log: N9Log): void {
	if (options.type === 'newRelic') {
		log.info(`Enable NewRelic for app ${options.newRelicOptions.appName}`);
		// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
		newRelic.instrumentLoadedModule('express', express);
		try {
			newRelic.instrumentLoadedModule('mongodb', mongodb);
		} catch (e) {
			log.debug(`MongoDB module is not instrumented`);
		}
	}
}
