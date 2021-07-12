import * as fs from "fs-extra";
import * as path from "path";
import glob from "glob";
import yargs from "yargs";
import { blurUp } from "./blurUp";
import { BlurUpConfig } from "./BlurUpConfig";

/**
 * The parsed arguments.
 */

const argv = yargs(process.argv.slice(2)).options({
	config: { type: "string", default: null, alias: "c" },
	input: { type: "string", default: null, alias: "i" },
	output: { type: "string", default: null, alias: "o" }
}).parseSync();

/**
 * Generates the image previews.
 *
 * @param config - A configuration.
 * @return A promise that returns an info message.
 */

function generate(config: BlurUpConfig): Promise<string> {

	const input = config.input as string[];

	return Promise.all(input.map((f) => {

		return BlurUp.generate(f, config.output, config)
			.catch((error) => console.warn(error));

	})).then(() => {

		const n = input.length;
		return `Generated ${n} SVG ${(n === 1) ? "file" : "files"}`;

	});

}

/**
 * Resolves glob patterns and gathers input files.
 *
 * @param config - A configuration.
 * @return A promise that returns the configuration with updated input paths.
 */

function resolveGlobPatterns(config: BlurUpConfig): Promise<BlurUpConfig> {

	const input = config.input as string[];
	let files: string[] = [];

	return Promise.all(input.map((f) => {

		return new Promise<void>((resolve, reject) => {

			glob(f, (error, result) => {

				if(error !== null) {

					reject(error);

				} else {

					files = files.concat(result);
					resolve();

				}

			});

		});

	})).then(() => {

		config.input = files;
		return config;

	});

}

/**
 * Validates a given configuration.
 *
 * @param config - A configuration.
 * @return A promise that returns the validated configuration.
 */

function validateConfig(config: BlurUpConfig): Promise<BlurUpConfig> {

	if(config === null) {

		config = {};

	}

	return new Promise((resolve, reject) => {

		if(argv.input !== null) {

			config.input = argv.input as string;

		}

		if(argv.output !== null) {

			config.output = argv.output as string;

		}

		if(config.input === undefined) {

			reject("No input path specified");

		} else if(config.output === undefined) {

			reject("No output path specified");

		} else if(path.extname(config.output) !== "") {

			reject("The output path must describe a directory");

		} else {

			if(!Array.isArray(config.input)) {

				config.input = [config.input];

			}

			resolve(config);

		}

	});

}

/**
 * Loads the configuration.
 *
 * @return A promise that returns the configuration.
 */

function readConfig(): Promise<BlurUpConfig> {

	// Checks if the package file contains a configuration.
	const pkgConfigPromise = new Promise<BlurUpConfig>((resolve, reject) => {

		fs.readFile(path.join(process.cwd(), "package.json")).then((data) => {

			const pkg = JSON.parse(data.toString()) as { blurUp: BlurUpConfig };
			resolve(pkg.blurUp);

		}).catch((error) => {

			// Invalid or missing package.json, ignore.
			resolve(null);

		});

	});

	// Looks for a configuration file.
	const configFilePromise = new Promise<BlurUpConfig>((resolve, reject) => {

		// Check if the user specified an alternative configuration path.
		const configPath = path.join(process.cwd(), (argv.config === null) ?
			".blur-up.json" : argv.config);

		fs.readFile(configPath).then((data) => {

			resolve(JSON.parse(data.toString()) as BlurUpConfig);

		}).catch((error: NodeJS.ErrnoException) => {

			if(argv.config === null) {

				// There's no configuration at the default location.
				resolve(null);

			} else {

				if(error.code === "ENOENT") {

					reject(`Could not find the configuration file (${configPath})`);

				} else {

					reject(`Failed to read the configuration file (${error.toString()})`);

				}

			}

		});

	});

	return pkgConfigPromise.then((config) => {

		return (config !== undefined) ?
			Promise.resolve(config) : configFilePromise;

	});

}

// Program entry point.
readConfig()
	.then(validateConfig)
	.then(resolveGlobPatterns)
	.then(generate)
	.then((result) => console.log(result))
	.catch((error) => console.error(error));
