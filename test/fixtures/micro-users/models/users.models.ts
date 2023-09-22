import { Allow, IsEmail, IsString, MinLength } from '../../../../src/index.js';
import { BaseMongoObject } from './db.models.js';

export class User extends BaseMongoObject {
	public uid: string;

	@IsString()
	@MinLength(2)
	@Allow()
	public firstName: string;

	@IsString()
	@MinLength(2)
	@Allow()
	public lastName: string;

	@IsString()
	@IsEmail()
	@Allow()
	public email: string;

	@IsString()
	@MinLength(8)
	@Allow()
	public password: string;

	public createdAt: Date;
}
