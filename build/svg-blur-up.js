/**
 * svg-blur-up v1.1.4 build Fri Dec 27 2019
 * https://github.com/vanruesc/blur-up
 * Copyright 2019 Raoul van Rüschen, Zlib
 */
'use strict';function _typeof(a){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _interopDefault(a){return a&&"object"===_typeof(a)&&"default"in a?a["default"]:a}var fs=_interopDefault(require("fs-extra")),path=_interopDefault(require("path")),sharp=_interopDefault(require("sharp"));function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var Settings=function a(b,c){var d=Math.max,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:20,f=3<arguments.length&&void 0!==arguments[3]?arguments[3]:20,g=4<arguments.length?arguments[4]:void 0,h=5<arguments.length?arguments[5]:void 0;_classCallCheck(this,a),this.input=b,this.output=c,this.stdDeviationX=d(e,0),this.stdDeviationY=d(f,0),this.width=g===void 0&&h===void 0?40:g,this.height=h,this.format=null,this.originalWidth=0,this.originalHeight=0};function resize(a){var b=sharp(a.input);return b.metadata().then(function(c){return a.format=c.format,a.originalWidth=c.width,a.originalHeight=c.height,b.resize(a.width,a.height).toBuffer({resolveWithObject:!0})})}function embed(a,b,c){var d=Math.round,e="data:image/"+c.format+";base64,"+a.toString("base64"),f=void 0===c.width&&void 0!==c.height?d(c.originalHeight/b.height):d(c.originalWidth/b.width),g=f*b.width,i=f*b.height,j=c.originalWidth,k=c.originalHeight,h=c.stdDeviationX,l=c.stdDeviationY;return Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\""+j+"\" height=\""+k+"\" viewBox=\"0 0 "+g+" "+i+"\" preserveAspectRatio=\"none\"><filter id=\"blur\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feGaussianBlur stdDeviation=\""+h+" "+l+"\" edgeMode=\"duplicate\"/><feComponentTransfer><feFuncA type=\"discrete\" tableValues=\"1 1\" /></feComponentTransfer></filter><image filter=\"url(#blur)\" x=\"0\" y=\"0\" height=\"100%\" width=\"100%\" xlink:href=\""+e+"\"/></svg>")}function writeFile(a,b){var c=b.output;return""===path.extname(c)&&(c=path.join(c,path.basename(b.input,path.extname(b.input)))+".svg"),fs.outputFile(c,a)}var BlurUp=function(){function a(){_classCallCheck(this,a)}return _createClass(a,null,[{key:"generate",value:function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},d=new Settings(a,b,c.stdDeviationX,c.stdDeviationY,c.width,c.height);return resize(d).then(function(a){var b=a.data,c=a.info;return embed(b,c,d)}).then(function(a){return writeFile(a,d)})}}]),a}();module.exports=BlurUp;
