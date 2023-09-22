import { Body, JsonController, Post, Service } from '../../../../src/index.js';

@Service()
@JsonController()
export class BarController {
	@Post('/bar')
	public bar(@Body() body: any): any {
		return body;
	}
}
