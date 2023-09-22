import { IsISO8601, IsString } from 'class-validator';

import { DateParser } from '../../../../../src/index.js';

export class Message {
	@IsISO8601()
	@DateParser()
	public date: Date;

	@IsString()
	public body: string;
}
