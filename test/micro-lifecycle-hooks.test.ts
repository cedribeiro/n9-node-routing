import ava, { Assertions } from 'ava';
import { Express } from 'express';
import { Server } from 'http';
import { join } from 'path';
import * as path from 'path';
import * as stdMock from 'std-mocks';
import { fileURLToPath } from 'url';

// tslint:disable-next-line:import-name
import n9NodeRouting, { N9NodeRouting } from '../src/index.js';
import commons, { defaultNodeRoutingConfOptions } from './fixtures/commons.js';
import { end } from './fixtures/helper.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename);

async function init(
	options?: Partial<N9NodeRouting.Options>,
): Promise<{ app: Express; server: Server; prometheusServer: Server }> {
	stdMock.use({ print: commons.print });
	const microLifecycleHooks = join(__dirname, 'fixtures/micro-lifecycle-hooks/');
	return await n9NodeRouting({
		path: microLifecycleHooks,
		conf: defaultNodeRoutingConfOptions,
		...options,
	});
}

ava('[Lifecycle Hooks] init and started hooks called', async (t: Assertions) => {
	const { server, prometheusServer } = await init();

	stdMock.restore();
	const output = stdMock.flush().stdout.filter(commons.excludeSomeLogs);

	// Logs on stdout
	t.true(output[4].includes('Init module feature'), 'Init module feature');
	t.true(output[5].includes('feature init'), 'feature init');
	t.true(output[6].includes('Listening on port 5000'), 'Listening on port 5000');
	t.true(output[7].includes('Start module feature'), 'Start module feature');
	t.true(output[8].includes('feature started'), 'feature started');

	// Close server
	await end(server, prometheusServer);
});

ava('[Lifecycle Hooks] init in order', async (t: Assertions) => {
	const { server, prometheusServer } = await init({
		path: join(__dirname, 'fixtures/micro-lifecycle-hooks-order/'),
		firstSequentialInitFileNames: ['test-1', 'test-2'],
		firstSequentialStartFileNames: ['test-1', 'test-2'],
	});

	stdMock.restore();
	const output = stdMock.flush().stdout.filter(commons.excludeSomeLogs);
	// Logs on stdout
	t.true(output[4].includes('feature init 1'), 'feature init 1');
	t.true(output[5].includes('feature init after a long wait'), 'feature init after a long wait');
	t.true(output[6].includes('feature init 2'), 'feature init 2');
	t.true(output[7].includes('Listening on port 5000'), 'Listening on port 5000');
	t.true(output[8].includes('feature started 1'), 'feature started 1');
	t.true(output[9].includes('feature started after a long wait'), 'feature started');
	t.true(output[10].includes('feature started 2'), 'feature started 2');

	// Close server
	await end(server, prometheusServer);
});
