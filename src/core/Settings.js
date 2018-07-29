/**
 * A collection of settings.
 */

export class Settings {

	/**
	 * Constructs new settings.
	 *
	 * @param {String} input - The path to the input image file.
	 * @param {String} output - The output path.
	 * @param {String} [stdDeviationX=20] - The Gaussian standard deviation along the X-axis. Must not be negative.
	 * @param {String} [stdDeviationY=20] - The Gaussian standard deviation along the Y-axis. Must not be negative.
	 * @param {Object} [width] - The preview image width.
	 * @param {Object} [height] - The preview image height. If none is specified, the aspect ratio will be preserved.
	 */

	constructor(input, output, stdDeviationX = 20, stdDeviationY = 20, width, height) {

		/**
		 * The path to the input image file.
		 *
		 * @type {String}
		 */

		this.input = input;

		/**
		 * The output path.
		 *
		 * @type {String}
		 */

		this.output = output;

		/**
		 * The Gaussian standard deviation along the X-axis.
		 *
		 * @type {Number}
		 */

		this.stdDeviationX = Math.max(stdDeviationX, 0);

		/**
		 * The Gaussian standard deviation along the Y-axis.
		 *
		 * @type {Number}
		 */

		this.stdDeviationY = Math.max(stdDeviationY, 0);

		/**
		 * The target image width.
		 *
		 * @type {Number}
		 */

		this.width = (width === undefined && height === undefined) ? 40 : width;

		/**
		 * The target image height.
		 *
		 * @type {Number}
		 */

		this.height = height;

		/**
		 * The format of the input image.
		 *
		 * @type {String}
		 */

		this.format = null;

		/**
		 * The width of the input image.
		 *
		 * @type {Number}
		 */

		this.originalWidth = 0;

		/**
		 * The height of the input image.
		 *
		 * @type {Number}
		 */

		this.originalHeight = 0;

	}

}
