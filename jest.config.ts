import type { Config } from 'jest';

const config: Config = {
	extensionsToTreatAsEsm: ['.ts'],
	moduleFileExtensions: ['js', 'json', 'ts'],
	roots: ['test'],
	testRegex: '^((?!e2e).)*.users(2|3).test.ts$',
	transform: {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'^.+\\.(t|j)s$': ['ts-jest', { useESM: true }],
	},
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['test'],
	collectCoverageFrom: ['**/*.{js,jsx,ts}', '!**/node_modules/**'],
};

export default config;
