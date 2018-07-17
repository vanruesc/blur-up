import fs from "fs-extra";
import glob from "glob";
import path from "path";
import yargs from "yargs-parser";
import { BlurUp } from "../core/BlurUp.js";

/**
 * The parsed arguments.
 *
 * @type {Object}
 * @private
 */

const argv = Object.assign({

	config: null,
	input: null,
	output: null

}, yargs(process.argv.slice(2), {

	alias: {
		config: ["c"],
		input: ["i"],
		output: ["o"]
	}

}));

/**
 * Generates the image previews.
 *
 * @param {Object} config - A configuration.
 * @param {String[]} files - The files.
 * @return {Promise<String>} A promise that returns an info message.
 */

function generate(config, files) {

	return new Promise((resolve, reject) => {

		const l = files.length;
		let i = 0, c = l;

		(function proceed() {

			if(i === l) {

				resolve("Generated " + c + " SVG " + ((c === 1) ? "file" : "files"));

			} else {

				const file = files[i++];

				BlurUp.generate(file, config.output, config).then(proceed).catch((error) => {

					--c;
					console.warn(error.message, "(" + file + ")");
					proceed();

				});

			}

		}());

	});

}

/**
 * Gathers input files.
 *
 * @type {Object} config - A configuration.
 * @return {Promise<Array>} A promise that returns an array containing the given configuration and the identified files.
 */

function getFiles(config) {

	return new Promise((resolve, reject) => {

		const input = config.input;
		let files = [];
		let i = 0;

		(function proceed(error, moreFiles) {

			if(error !== null) {

				reject(error);

			} else {

				files = files.concat(moreFiles);

				if(i === input.length) {

					if(files.length === 0) {

						reject("No input files found");

					} else {

						resolve([config, files]);

					}

				} else {

					glob(input[i++], proceed);

				}

			}

		}(null, []));

	});

}

/**
 * Validates a given configuration.
 *
 * @param {Object} [config] - A configuration.
 * @return {Promise<Object>} A promise that returns the given configuration.
 */

function validateConfig(config = {}) {

	return new Promise((resolve, reject) => {

		if(argv.input !== null) {

			config.input = argv.input;

		}

		if(argv.output !== null) {

			config.output = argv.output;

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
 * @return {Promise<Object>} A promise that returns the configuration.
 */

function readConfig() {

	// Checks if the package file contains a configuration.
	const pkgConfigPromise = new Promise((resolve, reject) => {

		fs.readFile(path.join(process.cwd(), "package.json")).then((data) => {

			try {

				resolve(JSON.parse(data).blurUp);

			} catch(error) {

				reject(error);

			}

		}).catch((error) => {

			// There's no configuration in package.json.
			resolve();

		});

	});

	// Looks for a configuration file.
	const configFilePromise = new Promise((resolve, reject) => {

		// Check if the user specified an alternative configuration path.
		const configPath = path.join(process.cwd(), (argv.config === null) ? ".blur-up.json" : argv.config);

		fs.readFile(configPath).then((data) => {

			try {

				resolve(JSON.parse(data));

			} catch(error) {

				reject(error);

			}

		}).catch((error) => {

			if(argv.config === null) {

				// There's no configuration at the default location.
				resolve();

			} else {

				if(error.code === "ENOENT") {

					reject("Could not find the configuration file (" + configPath + ")");

				} else {

					reject("Failed to read the configuration file (" + error.code + ")");

				}

			}

		});

	});

	return new Promise((resolve, reject) => {

		pkgConfigPromise.then((config) => {

			return (config !== undefined) ? Promise.resolve(config) : configFilePromise;

		}).then(resolve).catch(reject);

	});

}

// Program entry point.
readConfig()
	.then(validateConfig)
	.then(getFiles)
	.then(result => generate(...result))
	.then(console.log)
	.catch(console.error);
