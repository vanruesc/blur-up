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

	config: ".blur-up.json",
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

		let i = 0;

		(function proceed(error, files) {

			if(error !== undefined && error !== null) {

				reject(error);

			} else if(i === input.length) {

				resolve([config, files]);

			} else {

				glob(input[i++], proceed);

			}

		}());

	});

}

/**
 * Validates a given configuration.
 *
 * @param {Object} A configuration.
 * @return {Promise<Object>} A promise that returns the given configuration.
 */

function validateConfig(config) {

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

	return new Promise((resolve, reject) => {

		// Check if the package file contains a configuration.
		fs.readFile(path.join(process.cwd(), "package.json"), (error, data) => {

			let config;

			if(error === null) {

				try {

					config = JSON.parse(data).blurUp;

				} catch(error) {

					reject(error);

				}

			}

			if(config !== undefined) {

				resolve(config);

			} else {

				// Look for a configuration file.
				fs.readFile(path.join(process.cwd(), argv.config), (error, data) => {

					if(error !== null) {

						if(error.code === "ENOENT") {

							reject("No configuration found");

						} else {

							reject("Failed to read the configuration file (" + error.code + ")");

						}

					} else {

						try {

							resolve(JSON.parse(data));

						} catch(error) {

							reject(error);

						}

					}

				});

			}

		});

	});

}

// Program entry point.
readConfig()
	.then(validateConfig)
	.then(getFiles)
	.then(result => generate(...result))
	.then(console.log)
	.catch(console.error);
