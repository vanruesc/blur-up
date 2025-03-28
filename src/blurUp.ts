import { mkdir, writeFile } from "fs/promises";
import * as path from "path";
import { default as sharp, Metadata, OutputInfo } from "sharp";
import { BlurUpOptions } from "./BlurUpOptions.js";

declare type IHDRType = "G" | "RGB" | "Indexed" | "GA" | "RGBA" | "";
const ihdrTypes: IHDRType[] = ["G", "", "RGB", "Indexed", "GA", "", "RGBA"];

// eslint-disable-next-line @typescript-eslint/naming-convention
interface IHDRData {

	depth: number;
	type: IHDRType;
	buffer: ArrayBufferLike;
	alpha: boolean;

}

/**
 * Check if the given image data contains transparent pixels.
 *
 * @see https://stackoverflow.com/questions/41287823/check-image-transparency
 */

function getIHDRData(data: Buffer<ArrayBufferLike>): IHDRData | null {

	const view = new DataView(data.buffer);

	if(view.getUint32(0) !== 0x89504E47 || view.getUint32(4) !== 0x0D0A1A0A) {

		// Not a PNG file.
		return null;

	}

	// Extract the IHDR info which exists at offset 8 +8 bytes (size, name) +8 (depth) and +9 (type).
	const depth = view.getUint8(8 + 8 + 8);
	const type = view.getUint8(8 + 8 + 9);

	return {
		depth: depth,
		type: ihdrTypes[type],
		buffer: view.buffer,
		alpha: type === 4 || type === 6 // grayscale + alpha or RGB + alpha
	};

}

/**
 * Embeds the given image data in an SVG file.
 *
 * @param data - The data to write.
 * @param outputInfo - Additional output info.
 * @param meta - The image meta data.
 * @param options - The options.
 * @return The SVG data.
 */

function embed(data: Buffer, outputInfo: OutputInfo, meta: Metadata, options: BlurUpOptions): Buffer {

	meta.height = meta.height ?? 0;
	meta.width = meta.width ?? 0;

	const uri = `data:image/${meta.format};base64,${data.toString("base64")}`;
	const s = (options.width === undefined && options.height !== undefined) ?
		Math.round(meta.height / outputInfo.height) :
		Math.round(meta.width / outputInfo.width);

	const vw = s * outputInfo.width;
	const vh = s * outputInfo.height;

	const w = meta.width;
	const h = meta.height;

	const x = options.stdDeviationX;
	const y = options.stdDeviationY;

	// Prevent blurring around the edges of opaque images.
	const alpha = options.alpha! && (getIHDRData(data)?.alpha ?? false);
	const feComponentTransfer = !alpha ?
		"<feComponentTransfer><feFuncA type=\"discrete\" tableValues=\"1 1\"/></feComponentTransfer>" :
		"";

	return Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\"" +
		` xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}"` +
		` viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="none">` +
		"<filter id=\"a\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\">" +
		`<feGaussianBlur stdDeviation="${x} ${y}" edgeMode="duplicate"/>${feComponentTransfer}` +
		"</filter>" +
		`<image filter="url(#a)" x="0" y="0" height="100%" width="100%" xlink:href="${uri}"/></svg>`
	);

}

/**
 * Saves data as an SVG file.
 *
 * @param input - The input path.
 * @param output - The output path.
 * @param data - The data to write.
 * @return A promise.
 */

async function saveFile(input: string, output: string, data: Buffer): Promise<void> {

	// Check if the output path looks like a directory.
	if(path.extname(output).length === 0) {

		// Use the name of the input file.
		const basename = path.basename(input, path.extname(input));
		output = path.join(output, basename) + ".svg";

	}

	await mkdir(path.dirname(output), { recursive: true });
	return await writeFile(output, data);

}

/**
 * Resizes an image file and embeds it in an SVG together with a blur filter.
 *
 * @param input - The input path.
 * @param output - The output path.
 * @param options - The options.
 * @return A promise that resolves when the image has been generated.
 */

export async function blurUp(input: string, output: string, options: BlurUpOptions): Promise<void> {

	// Define default values.
	options = Object.assign({
		stdDeviationX: 20,
		stdDeviationY: 20,
		alpha: true
	}, options);

	if(options.width === undefined && options.height === undefined) {

		options.width = 40;

	}

	const image = sharp(input);

	const meta = await image.metadata();
	const { data, info } = await image
		.resize(options.width, options.height)
		.toBuffer({ resolveWithObject: true });

	return await saveFile(input, output, embed(data, info, meta, options));

}
