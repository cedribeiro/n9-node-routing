import { N9Log } from '@neo9/n9-node-log';
import { Type } from 'class-transformer';
import { Allow, IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';

import { N9NodeRoutingBaseConf } from './base-conf.js';
import { N9LogOptions } from './implementations/n9-node-log.implementation.js';
import { APMOptions } from './options-apm.js';
import { ConfOptions } from './options-conf.js';
import { HttpOptions } from './options-http.js';
import { HttpClientOptions } from './options-http-client.js';
import { PrometheusOptions } from './options-prometheus.js';
import { SentryOptions } from './options-sentry.js';
import { ShutdownOptions } from './options-shutdown.js';
import { SwaggerOptions } from './options-swagger.js';

export class Options<ConfType extends N9NodeRoutingBaseConf = N9NodeRoutingBaseConf> {
	@IsOptional()
	@IsBoolean()
	hasProxy?: boolean;

	@IsOptional()
	@IsBoolean()
	enableRequestId?: boolean;

	@IsOptional()
	@IsBoolean()
	enableLogFormatJSON?: boolean;

	@IsOptional()
	@IsString()
	path?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => ConfOptions)
	conf?: ConfOptions<ConfType>;

	@IsOptional()
	@Allow()
	log?: N9Log;

	@IsOptional()
	@ValidateNested()
	@Type(() => N9LogOptions)
	logOptions?: N9LogOptions;

	@IsOptional()
	@ValidateNested()
	@Type(() => HttpOptions)
	http?: HttpOptions<ConfType>;

	@IsOptional()
	@ValidateNested()
	@Type(() => HttpClientOptions)
	httpClient?: HttpClientOptions;

	@IsOptional()
	@ValidateNested()
	@Type(() => SwaggerOptions)
	openapi?: SwaggerOptions;

	@IsOptional()
	@ValidateNested()
	@Type(() => ShutdownOptions)
	shutdown?: ShutdownOptions;

	@IsOptional()
	@ValidateNested()
	@Type(() => PrometheusOptions)
	prometheus?: PrometheusOptions;

	@IsOptional()
	@ValidateNested()
	@Type(() => SentryOptions)
	sentry?: SentryOptions;

	@IsOptional()
	@ValidateNested()
	@Type(() => APMOptions)
	apm?: APMOptions;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	firstSequentialInitFileNames?: string[];

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	firstSequentialStartFileNames?: string[];
}
