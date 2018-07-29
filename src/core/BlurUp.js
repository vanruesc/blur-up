import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import { Settings } from "./Settings.js";

/**
 * Reads and resizes the given image file.
 *
 * @private
 * @param {Settings} settings - The settings.
 * @return {Promise<Buffer>} A promise.
 */

function resize(settings) {

	const image = sharp(settings.input);

	return image.metadata().then((metadata) => {

		settings.format = metadata.format;
		settings.originalWidth = metadata.width;
		settings.originalHeight = metadata.height;

		return image.resize(settings.width, settings.height).toBuffer({ resolveWithObject: true });

	});

}

/**
 * Embeds the given image data in an SVG file.
 *
 * @private
 * @param {Buffer} data - The data to write.
 * @param {Object} info - Additional buffer info.
 * @param {Settings} settings - The settings.
 * @return {Promise<Buffer>} A promise.
 */

function embed(data, info, settings) {

	const dataURI = "data:image/" + settings.format + ";base64," + data.toString("base64");

	const s = (settings.width === undefined && settings.height !== undefined) ?
		Math.round(settings.originalHeight / info.height) :
		Math.round(settings.originalWidth / info.width);

	const vw = s * info.width;
	const vh = s * info.height;

	const w = settings.originalWidth;
	const h = settings.originalHeight;

	const x = settings.stdDeviationX;
	const y = settings.stdDeviationY;

	return Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" " +
		"width=\"" + w + "\" height=\"" + h + "\" viewBox=\"0 0 " + vw + " " + vh + "\" preserveAspectRatio=\"none\">" +
		"<filter id=\"blur\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\">" +
		"<feGaussianBlur stdDeviation=\"" + x + " " + y + "\" edgeMode=\"duplicate\"/>" +
		"<feComponentTransfer><feFuncA type=\"discrete\" tableValues=\"1 1\" /></feComponentTransfer>" +
		"</filter>" +
		"<image filter=\"url(#blur)\" x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" xlink:href=\"" + dataURI + "\"/>" +
		"</svg>");

}

/**
 * Saves data as an SVG file.
 *
 * @private
 * @param {Buffer} data - The data to write.
 * @param {Settings} settings - The settings.
 * @return {Promise} A promise.
 */

function writeFile(data, settings) {

	let output = settings.output;

	if(path.extname(output) === "") {

		// Use the name of the input file.
		output = path.join(output, path.basename(settings.input, path.extname(settings.input))) + ".svg";

	}

	return fs.outputFile(output, data);

}

/**
 * Generates image previews.
 */

export class BlurUp {

	/**
	 * Resizes an image file and embeds it in an SVG together with a blur filter.
	 *
	 * @param {String} input - The path to the input image file.
	 * @param {String} output - The output path.
	 * @param {Object} options - The options.
	 * @return {Promise} A promise.
	 */

	static generate(input, output, options = {}) {

		const settings = new Settings(
			input,
			output,
			options.stdDeviationX,
			options.stdDeviationY,
			options.width,
			options.height
		);

		return resize(settings)
			.then(({ data, info }) => embed(data, info, settings))
			.then(result => writeFile(result, settings));

	}

}
