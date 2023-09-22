import ava, { Assertions } from 'ava';
import _ from 'lodash-es';
import { join } from 'path';
import * as path from 'path';
import * as stdMock from 'std-mocks';
import { fileURLToPath } from 'url';

import { N9NodeRouting } from '../src/index.js';
import { applyDefaultValuesOnOptions } from '../src/options.js';
import { getEnvironment } from '../src/utils.js';
import commons from './fixtures/commons.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename);
const microValidate = join(__dirname, 'fixtures/micro-validate/');

ava('Read documentation', (t: Assertions) => {
	stdMock.use({ print: commons.print });
	const environment = getEnvironment();

	const initOptions: N9NodeRouting.Options = {
		path: microValidate,
	};

	const optionsWithDefault: N9NodeRouting.Options = _.cloneDeep(initOptions);
	applyDefaultValuesOnOptions(optionsWithDefault, environment, 'fake-app-name');
	const optionsWithDefault2: N9NodeRouting.Options = _.cloneDeep(optionsWithDefault);
	applyDefaultValuesOnOptions(optionsWithDefault2, environment, 'fake-app-name');

	// Check logs
	stdMock.restore();
	stdMock.flush();
	t.notDeepEqual(initOptions, optionsWithDefault, 'Default options are filled');
	t.true(optionsWithDefault.openapi.isEnabled, 'OpenApi enabled by default'); // test only one default value, the goal is not to test default values assigment

	// logs has Pino circular references
	delete optionsWithDefault2.log;
	delete optionsWithDefault.log;
	t.deepEqual(optionsWithDefault2, optionsWithDefault, 'Apply twice is the same than once');
});
