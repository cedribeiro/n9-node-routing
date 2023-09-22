import { Acl, JsonController, Post, Service } from '../../../../src/index.js';

@Service()
@JsonController('/toto')
export class ValidateController {
	@Acl([{ action: 'createFoo', user: '@' }])
	@Post('/foo')
	public createFoo(): void {
		return;
	}
}
