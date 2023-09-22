import { N9Log } from '@neo9/n9-node-log';
import glob from 'glob-promise';
import { join } from 'path';

export default async (
	path: string,
	log: N9Log,
	firstSequentialInitFileNames?: string[],
): Promise<any> => {
	const initFiles: string[] = await glob('**/*.init.+(ts|js)', { cwd: path });

	if (firstSequentialInitFileNames) {
		for (const firstSequentialInitFileName of firstSequentialInitFileNames) {
			const matchingInitFileIndex = initFiles.findIndex((initFile) =>
				initFile.includes(firstSequentialInitFileName),
			);
			if (matchingInitFileIndex !== -1) {
				let module = await import(join(path, initFiles[matchingInitFileIndex]));
				module = module.default ? module.default : module;
				await module(log);
				initFiles.splice(matchingInitFileIndex, 1);
			}
		}
	}

	const modules: any[] = await Promise.all(
		initFiles.map(async (file) => {
			const moduleName = file.split('/').slice(-2)[0];
			log.info(`Init module ${moduleName}`);

			return import(join(path, file));
		}),
	);

	modules.map((module) => {
		const moduleReturned = module.default ? module.default : module;
		return moduleReturned(log);
	});
};
