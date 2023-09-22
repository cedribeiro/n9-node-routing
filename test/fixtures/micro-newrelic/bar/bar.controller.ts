import { N9Error } from '@neo9/n9-node-utils';

import { Get, JsonController, Param, Post, QueryParam, Service } from '../../../../src/index.js';

@Service()
@JsonController()
export class ValidateController {
	@Post('/:version/bar')
	public bar(@Param('version') version: string, @QueryParam('error') queryError: boolean): any {
		if (queryError) {
			throw new N9Error('bar-extendable-error', 505, {
				test: true,
				error: new Error('sample-error'),
			});
		}
		return { bar: 'foo' };
	}

	@Get('/bar-fail')
	public barFail(): any {
		throw new Error();
	}
}
