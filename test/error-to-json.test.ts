import ava, { Assertions } from 'ava';
import * as stdMock from 'std-mocks';

// tslint:disable-next-line:import-name
import N9NodeRouting from '../src/index.js';
import commons, { nodeRoutingMinimalOptions } from './fixtures/commons.js';
import { end } from './fixtures/helper.js';

const print = commons.print;

ava('Error to json', async (t: Assertions) => {
	stdMock.use({ print });
	const { server, prometheusServer } = await N9NodeRouting(nodeRoutingMinimalOptions);

	const text = 'message-error-text';
	const e = Error(text);
	const eAsJSON = JSON.stringify(e);

	const expectedStart = JSON.stringify({
		name: 'Error',
		message: text,
		stack: 'Error: message-error-text',
	}).substring(0, -2);
	t.true(eAsJSON.startsWith(expectedStart), ` \n${eAsJSON} \n ${expectedStart}`);
	await end(server, prometheusServer);
});
