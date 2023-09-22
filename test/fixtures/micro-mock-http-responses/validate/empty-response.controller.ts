import { Get, JsonController, Service } from '../../../../src/index.js';

@Service()
@JsonController()
export class ErrorsController {
	@Get('/empty-response')
	public emptyResponse(): any {
		return;
	}
}
