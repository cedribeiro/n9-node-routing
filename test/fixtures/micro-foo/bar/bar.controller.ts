import { N9Error } from '@neo9/n9-node-utils';
import { Service } from 'typedi';

import { Body, Get, JsonController, Param, Post, QueryParam } from '../../../../src/index.js';
import { BodyBar } from './body-bar.models.js';

@Service()
@JsonController()
export class ValidateController {
	@Post('/:version/bar')
	public bar(
		@Param('version') version: string,
		@QueryParam('error') queryError: boolean,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Body() body: BodyBar,
	): any {
		if (queryError) {
			if (version === 'v1') {
				throw new N9Error('bar-error');
			}
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
