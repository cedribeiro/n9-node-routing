import { Conf } from './index.models.js';

const conf: Partial<Conf> = {
	foo: 'string',
	bar: 'string' as any,
	baz: {
		qux: 1 as any,
	},
	secret: 'secretPassword',
};

export default conf;
