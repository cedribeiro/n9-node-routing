import { IsNumber, IsOptional, IsString } from 'class-validator';

import { N9NodeRouting } from '../../../../../src/index.js';

export class Conf extends N9NodeRouting.N9NodeRoutingBaseConf {
	@IsOptional()
	@IsString()
	foo?: string;

	@IsNumber()
	bar?: number;
}
