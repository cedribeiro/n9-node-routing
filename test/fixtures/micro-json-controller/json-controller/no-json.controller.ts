import { Acl, JsonController, Post, Service } from '../../../../src/index.js';

@Service()
@JsonController()
export class ValidateController {
	@Acl([{ action: 'createFoo', user: '@' }])
	@Post('/no-controller')
	public createFoo(): void {
		return;
	}
}
