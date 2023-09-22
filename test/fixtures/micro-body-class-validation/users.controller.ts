import { Body, JsonController, Post, Service } from '../../../src/index.js';
import { User } from './models/users.models.js';

@Service()
@JsonController('/users')
export class UsersController {
	@Post()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public createUser(@Body() user: User<any>): void {
		return;
	}
}
