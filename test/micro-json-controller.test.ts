import ava from 'ava';
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
const microFoo = join(__dirname, 'fixtures/micro-json-controller/');
const print = commons.print;

ava('Acl usage with JSON Controller, check /routes', async (t) => {
	stdMock.use({ print });
	const { server, prometheusServer } = await N9NodeRouting({
		path: microFoo,
		http: { port: 5575 },
		conf: defaultNodeRoutingConfOptions,
	});

	// Check acl on routes
	await commons.jsonHttpClient.get('http://localhost:5575/routes');
	const res = await commons.jsonHttpClient.get<any[]>('http://localhost:5575/routes');

	t.is(res.length, 3);

	const routesToCall = [];
	const route1 = res[0];
	t.is(route1.description, undefined);
	t.is(route1.method, 'post');
	t.is(route1.path, '/toto/foo');
	t.is(route1.acl.perms[0].action, 'createFoo');
	routesToCall.push(route1.path);

	const route2 = res[1];
	t.is(route2.description, undefined);
	t.is(route2.method, 'post');
	t.is(route2.path, '/tata');
	t.is(route2.acl.perms[0].action, 'createBar');
	routesToCall.push(route2.path);

	const route3 = res[2];
	t.is(route3.description, undefined);
	t.is(route3.method, 'post');
	t.is(route3.path, '/no-controller');
	t.is(route3.acl.perms[0].action, 'createFoo');
	routesToCall.push(route3.path);

	for (const routeToCall of routesToCall) {
		await t.notThrowsAsync(
			async () => await commons.jsonHttpClient.post(`http://localhost:5575${routeToCall}`),
			`call ${routeToCall}`,
		);
	}

	// Close server
	await end(server, prometheusServer);
});
