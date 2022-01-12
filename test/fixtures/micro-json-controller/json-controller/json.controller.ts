import { Acl, JsonController, Post, Service } from '../../../../src';

@Service()
@JsonController('/toto')
export class ValidateController {
	@Acl([{ action: 'createFoo', user: '@' }])
	@Post('/foo')
	public createFoo(): void {
		return;
	}
}
