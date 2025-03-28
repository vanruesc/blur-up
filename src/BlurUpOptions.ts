/**
 * Blur Up options.
 */

export interface BlurUpOptions {

	/**
	 * The Gaussian standard deviation along the X-axis.
	 *
	 * @defaultValue 20
	 */

	stdDeviationX?: number;

	/**
	 * The Gaussian standard deviation along the Y-axis.
	 *
	 * @defaultValue 20
	 */

	stdDeviationY?: number;

	/**
	 * The target image width.
	 *
	 * @defaultValue 40
	 */

	width?: number;

	/**
	 * The target image height.
	 */

	height?: number;

	/**
	 * If enabled, the alpha channel of transparent PNG images will be affected by the blur.
	 *
	 * Set this to `false` to prevent undesired blurring around the edges of opaque PNG images.
	 *
	 * @defaultValue true
	 */

	alpha?: boolean;

}
