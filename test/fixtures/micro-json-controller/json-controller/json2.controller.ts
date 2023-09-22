import { Acl, JsonController, Post, Service } from '../../../../src/index.js';

@Service()
@JsonController('/tata')
export class ValidateController {
	@Acl([{ action: 'createBar', user: '@' }])
	@Post()
	public createBar(): void {
		return;
	}
}
