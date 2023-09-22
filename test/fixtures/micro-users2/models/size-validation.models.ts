import _ from 'lodash-es';

import { Exclude, Expose, IsInt, IsOptional, Max, Min, Transform } from '../../../../src/index.js';

@Exclude()
export class SizeValidation {
	@IsOptional()
	@Min(1)
	@Max(200)
	@IsInt()
	@Expose()
	@Transform(({ value }) => (_.isNil(value) ? value : Number.parseInt(value, 10)), {
		toClassOnly: true,
	})
	public size: number;
}
