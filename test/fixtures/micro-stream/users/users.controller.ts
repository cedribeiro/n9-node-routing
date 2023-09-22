import { N9JSONStream } from '@neo9/n9-node-utils';
import { Readable } from 'stream';

import { Get, JsonController, Service } from '../../../../src/index.js';

@Service()
@JsonController()
export class UsersController {
	@Get('/users')
	public stream(): any {
		const items = [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }, { _id: 'd' }];
		const readable = new Readable({ objectMode: true });
		items.forEach((item) => readable.push(item));
		readable.push(null);

		return readable.pipe(
			new N9JSONStream<{ _id: string }, { lastUpdate: Date }>({
				total: 5,
				metaData: {
					lastUpdate: new Date(),
				},
			}),
		);
	}
}
