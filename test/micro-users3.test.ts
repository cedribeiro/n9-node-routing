import { N9Log } from '@neo9/n9-node-log';
import path from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore - Package JSON isn't 100% matching
import * as packageJson from '../package.json' assert { type: 'json' };
import { testAB, UserAB } from './fixtures/micro-users2/users-test.models.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename);

describe('Test ESM ABC', () => {
	it('Check if esm environment', () => {
		// eslint-disable-next-line @typescript-eslint/no-invalid-this
		expect(this === undefined).toBeTruthy();
	});

	it('Check simple esm json import', () => {
		expect(packageJson).toBeDefined();
		const logger = new N9Log('test', {});
		logger.info('test');
	});

	it('Check simple esm __dirname and __filename', () => {
		expect(__filename).toBeDefined();
		expect(__dirname).toBeDefined();
	});

	it('Check simple esm json import and tests', () => {
		const resultAB: number = testAB(5, 6);
		const userAB: UserAB = {
			name: 'Jean',
			age: 18,
		};

		expect(resultAB).toBe(11);
		expect(userAB.name).toBe('Jean');
		expect(userAB.age).toBe(18);
	});
});
