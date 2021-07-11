import { BlurUpOptions } from "./BlurUpOptions";

/**
 * The Blur Up config.
 */

export interface BlurUpConfig extends BlurUpOptions {

	/**
	 * The input file(s).
	 */

	input?: string | string[];

	/**
	 * The output directory.
	 */

	output?: string;

}
