import { lstat, readFile } from "fs/promises";
import * as path from "path";
import yargs from "yargs";
import { glob } from "glob";
import { blurUp } from "./blurUp.js";
import { BlurUpConfig } from "./BlurUpConfig.js";

/**
 * The parsed arguments.
 */

const argv = yargs(process.argv.slice(2)).options({
	config: { type: "string", default: null, alias: "c" },
	input: { type: "string", default: null, alias: "i" },
	output: { type: "string", default: null, alias: "o" }
}).parseSync();

/**
 * A collection that maps input paths to output paths.
 */

const io = new Map<string, string>();

/**
 * Generates the image previews.
 *
 * @param config - A configuration.
 * @return A promise that returns an info message.
 */

function generate(config: BlurUpConfig): Promise<string> {

	const promises: Promise<void>[] = [];

	for(const entry of io.entries()) {

		promises.push(
			blurUp(entry[0], entry[1], config)
				.catch((error) => console.warn(entry, error))
		);

	}

	return Promise.all(promises).then(() => {

		return `Generated ${io.size} SVG ${(io.size === 1) ? "file" : "files"}`;

	});

}

/**
 * Deletes directory input paths.
 *
 * @param config - A configuration.
 * @return A promise.
 */

function removeDirectories(): Promise<void[]> {

	const promises: Promise<void>[] = [];

	for(const entry of io.entries()) {

		promises.push(new Promise<void>((resolve, reject) => {

			lstat(entry[0]).then((stats) => {

				if(!stats.isFile()) {

					io.delete(entry[0]);

				}

				resolve();

			}).catch(reject);

		}));

	}

	return Promise.all(promises);

}

/**
 * Resolves glob patterns and prepares IO paths.
 *
 * @param config - A configuration.
 * @return A promise that returns the configuration with IO paths.
 */

function resolveGlobPatterns(config: BlurUpConfig): Promise<BlurUpConfig> {

	const patterns = config.input as string[];

	return Promise.all(patterns.map((p) => {

		const base = p.split("/*")[0];

		return new Promise<void>((resolve, reject) => {

			glob(p).then((paths) => {

				for(const input of paths) {

					let output = path.join(config.output!, input.replace(base, ""));
					output = output.replace(path.extname(output), ".svg");
					io.set(input, output);

				}

				resolve();

			}).catch((e: Error) => reject(e));

		});

	})).then(removeDirectories).then(() => config);

}

/**
 * Validates a given configuration.
 *
 * @param config - A configuration.
 * @return A promise that returns the validated configuration.
 */

function validateConfig(config: BlurUpConfig | null): Promise<BlurUpConfig> {

	const result = config ?? {};

	return new Promise((resolve, reject) => {

		if(argv.input !== null) {

			result.input = argv.input;

		}

		if(argv.output !== null) {

			result.output = argv.output;

		}

		if(result.input === undefined) {

			reject(new Error("No input path specified"));

		} else if(result.output === undefined) {

			reject(new Error("No output path specified"));

		} else {

			if(!Array.isArray(result.input)) {

				result.input = [result.input];

			}

			resolve(result);

		}

	});

}

/**
 * Loads the configuration.
 *
 * @return A promise that returns the configuration.
 */

function readConfig(): Promise<BlurUpConfig | null> {

	// Checks if the package file contains a configuration.
	const pkgConfigPromise = new Promise<BlurUpConfig | null>((resolve, reject) => {

		readFile(path.join(process.cwd(), "package.json")).then((data) => {

			const pkg = JSON.parse(data.toString()) as { blurUp: BlurUpConfig };
			resolve(pkg.blurUp);

		}).catch(() => {

			// Invalid or missing package.json, ignore.
			resolve(null);

		});

	});

	// Looks for a configuration file.
	const configFilePromise = new Promise<BlurUpConfig | null>((resolve, reject) => {

		// Check if the user specified an alternative configuration path.
		const configPath = path.join(process.cwd(), argv.config ?? ".blur-up.json");

		readFile(configPath).then((data) => {

			resolve(JSON.parse(data.toString()) as BlurUpConfig);

		}).catch((error: NodeJS.ErrnoException) => {

			if(argv.config === null) {

				// There's no configuration at the default location.
				resolve(null);

			} else {

				if(error.code === "ENOENT") {

					reject(new Error(`Could not find the configuration file (${configPath})`));

				} else {

					reject(new Error(`Failed to read the configuration file (${error.message})`));

				}

			}

		});

	});

	return pkgConfigPromise.then((config) => {

		return config !== null ? Promise.resolve(config) : configFilePromise;

	});

}

// Program entry point.
readConfig()
	.then(validateConfig)
	.then(resolveGlobPatterns)
	.then(generate)
	.then((result) => console.log(result))
	.catch((error) => console.error(error));
