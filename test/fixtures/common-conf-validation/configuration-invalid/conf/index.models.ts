import { Transform, Type } from 'class-transformer';
import { Allow, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { N9NodeRouting, SecretTransformer } from '../../../../../src/index.js';

class Baz {
	@IsString()
	qux: string;
}

export class Conf extends N9NodeRouting.N9NodeRoutingBaseConf {
	@IsOptional()
	@IsString()
	foo?: string;

	@IsNumber()
	@IsIn([1, 2])
	bar?: number;

	@ValidateNested()
	@Type(() => Baz)
	baz?: Baz;

	@Allow()
	@Transform(SecretTransformer.GET_TRANSFORMER())
	secret?: string;
}
