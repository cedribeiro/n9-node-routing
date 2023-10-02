import { configure } from '@neo9/n9-node-conf';
import { N9Log } from '@neo9/n9-node-log';
import ava, { Assertions } from 'ava';
import path, { join } from 'path';
import * as stdMock from 'std-mocks';
import { fileURLToPath } from 'url';

import * as packageJsonFile from '../package.json' assert { type: 'json' };
import N9NodeRouting from '../src/index.js';
import { defaultNodeRoutingConfOptions } from './fixtures/commons.js';
import { end } from './fixtures/helper.js';
import { testAB, UserAB } from './fixtures/micro-users2/users-test.models.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename);
const packageJson = (packageJsonFile as any).default;

const microConfValidation = join(__dirname, 'fixtures/common-conf-validation/');

ava('check simple esm AB', async (t: Assertions) => {
	const resultAB: number = testAB(5, 6);
	const userAB: UserAB = {
		name: 'Jean',
		age: 18,
	};

	// eslint-disable-next-line @typescript-eslint/no-invalid-this
	t.true(this === undefined);
	t.truthy(packageJson);
	t.truthy(__filename);
	t.truthy(__dirname);

	t.is(resultAB, 11);
	t.is(userAB.name, 'Jean');
	t.is(userAB.age, 18);

	// Logger
	const logger = new N9Log('test', {});
	t.truthy(logger);

	// Conf
	const conf: any = configure({
		path: `${microConfValidation}/configuration-valid/conf`,
	});
	t.truthy(conf);

	// Routing
	stdMock.use({ print: false });
	const { server, prometheusServer } = await N9NodeRouting({
		path: join(__dirname, 'fixtures/micro-cargo/'),
		http: {
			port: 6001,
		},
		conf: defaultNodeRoutingConfOptions,
	});
	t.truthy(server);
	t.truthy(prometheusServer);
	await end(server, prometheusServer);
});
