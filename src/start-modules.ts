import { N9Log } from '@neo9/n9-node-log';
import glob from 'glob-promise';
import { join } from 'path';

export default async (
	path: string,
	log: N9Log,
	firstSequentialStartFileNames?: string[],
): Promise<any> => {
	const initFiles: string[] = await glob('**/*.started.+(ts|js)', { cwd: path });

	if (firstSequentialStartFileNames) {
		for (const firstSequentialStartFileName of firstSequentialStartFileNames) {
			const matchingStartFileIndex = initFiles.findIndex((initFile) =>
				initFile.includes(firstSequentialStartFileName),
			);
			if (matchingStartFileIndex !== -1) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
				let module = await import(join(path, initFiles[matchingStartFileIndex]));
				module = module.default ? module.default : module;
				await module(log);
				initFiles.splice(matchingStartFileIndex, 1);
			}
		}
	}

	const modules: any[] = await Promise.all(
		initFiles.map(async (file) => {
			const moduleName = file.split('/').slice(-2)[0];
			log.info(`Start module ${moduleName}`);
			return import(join(path, file));
		}),
	);

	modules.map((module) => {
		const returnedModule = module.default ? module.default : module;
		return returnedModule(log);
	});
};
