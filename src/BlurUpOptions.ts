/**
 * Blur Up base options.
 *
 * Note: The client uses {@link BlurUpConfig}.
 */

export interface BlurUpOptions {

	/**
	 * The Gaussian standard deviation along the X-axis.
	 */

	stdDeviationX?: number;

	/**
	 * The Gaussian standard deviation along the Y-axis.
	 */

	stdDeviationY?: number;

	/**
	 * The target image width.
	 */

	width?: number;

	/**
	 * The target image height.
	 */

	height?: number;

}
