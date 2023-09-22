import { N9JSONStreamResponse } from '@neo9/n9-node-utils';
import ava, { Assertions } from 'ava';
import { join } from 'path';
import * as path from 'path';
import * as stdMock from 'std-mocks';
import { fileURLToPath } from 'url';

// tslint:disable-next-line:import-name
import N9NodeRouting from '../src/index.js';
import commons, { defaultNodeRoutingConfOptions } from './fixtures/commons.js';
import { end } from './fixtures/helper.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename);
const microFoo = join(__dirname, 'fixtures/micro-stream/');

ava('Basic stream', async (t: Assertions) => {
	stdMock.use({ print: commons.print });
	const { server, prometheusServer } = await N9NodeRouting({
		path: microFoo,
		http: { port: 6001 },
		conf: defaultNodeRoutingConfOptions,
	});

	const res = await commons.jsonHttpClient.get<N9JSONStreamResponse<{ _id: string }>>(
		'http://localhost:6001/users',
	);
	t.is(res.items.length, 4, 'check length');
	t.is(typeof res.metaData, 'object', 'metadata is object');

	// Close server
	await end(server, prometheusServer);
});
