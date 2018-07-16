# Blur Up

[![Build status](https://travis-ci.org/vanruesc/blur-up.svg?branch=master)](https://travis-ci.org/vanruesc/blur-up)
[![npm version](https://badge.fury.io/js/blur-up.svg)](https://badge.fury.io/js/blur-up)
[![Dependencies](https://david-dm.org/vanruesc/blur-up.svg?branch=master)](https://david-dm.org/vanruesc/blur-up)

A tool that creates a small, optimized version of an input image and embeds it in an SVG file. The generated SVG
file scales the integrated image up to its original dimensions and applies a blur filter to create a high quality
preview of the original image. Such preview SVGs can be used as temporary substitutes for images that take longer
to load.

| Preview SVG | Original Image   |
|-------------|------------------|
| 1062 Bytes  | 402.15 Kilobytes |
| <img src="https://vanruesc.github.io/blur-up/test/expected/img.svg" width="250"> | <img src="https://vanruesc.github.io/blur-up/test/images/img.jpg" width="250"> |


## Installation

```sh
npm install blur-up
``` 


## Usage

### Command Line Interface (CLI)

The command line tool can be invoked using the `blur-up` command:

```sh
blur-up -i images/* -o previews -c configs/blur-up.json
```

You may provide a configuration via `package.json` or as a standalone file. If there is no configuration
in `package.json`, the tool will look for a configuration file with the default name `.blur-up.json` in
the current working directory. Please refer to the [Options](#options) section for more information.

| Option         | Shorthand | Description                                |
|----------------|-----------|--------------------------------------------|
| --config       | -c        | Specifies an alternative config path       |
| --input        | -i        | Specifies the input path or glob pattern   |
| --output       | -o        | Specifies the output directory             |


### JavaScript API

The `generate` function returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).

```javascript
import BlurUp from "blur-up";

// The input path must describe a single file.
BlurUp.generate("images/bg.jpg", "output/dir", options).catch(console.error);
```

### Output

Each individual image will be wrapped in an SVG construct of the following form:

```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	width="IMG_WIDTH" height="IMG_HEIGHT" viewBox="0 0 IMG_WIDTH IMG_HEIGHT">
	<filter id="blur" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
		<feGaussianBlur stdDeviation="STD_DEVIATION_X STD_DEVIATION_Y" edgeMode="duplicate" />
		<feComponentTransfer><feFuncA type="discrete" tableValues="1 1" /></feComponentTransfer>
	</filter>
	<image filter="url(#blur)" x="0" y="0" height="100%" width="100%" xlink:href="IMG_DATA_URI" />
</svg>
```

Note: The generated SVG file will be minified.


## Options

| Option        | Default  | Description                                |
|---------------|----------|--------------------------------------------|
| input         | -        | Can be a single path or an array of paths  |
| output        | -        | Must be a path that describes a directory  |
| stdDeviationX | 20       | The blur strength along the X-axis         |
| stdDeviationX | 20       | The blur strength along the Y-axis         |
| width         | auto, 40 | The width of the preview image             |
| height        | auto     | The height of the preview image            |

The command line options `--input` and `--output` overwrite the respective fields in the configuration.

If only `width` or `height` is specified, the counter part will be calculated automatically to
preserve the original aspect ratio. If both of these fields are undefined, `width` will be set to 40
and `height` will be adjusted accordingly.

#### .blur-up.json

```javascript
{
	"input": "images/*.{bmp,jpg,png}",
	"output": "images/previews",
	"stdDeviationX": 10,
	"stdDeviationY": 10,
	"width": 30
}

```

#### package.json

```javascript
{
	"blurUp": {
		"input": ["path/to/img/*.jpg", "other/path/*.png"],
		"output": "output/dir"
	}
}
```

#### blur-up.js

```javascript
BlurUp.generate(inputPath, outputPath, {
	"stdDeviationX": 5,
	"stdDeviationY": 5
}).catch(console.error);
```


## Contributing

Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
