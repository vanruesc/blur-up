/**
 * svg-blur-up v1.1.1 build Tue Jul 17 2018
 * https://github.com/vanruesc/blur-up
 * Copyright 2018 Raoul van Rüschen, Zlib
 */
'use strict';function _interopDefault(a){return a&&'object'==typeof a&&'default'in a?a['default']:a}var fs=_interopDefault(require('fs-extra')),path=_interopDefault(require('path')),sharp=_interopDefault(require('sharp')),classCallCheck=function(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')},createClass=function(){function a(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,'value'in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),Settings=function a(b,c){var d=Math.max,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:20,f=3<arguments.length&&void 0!==arguments[3]?arguments[3]:20,g=arguments[4],h=arguments[5];classCallCheck(this,a),this.input=b,this.output=c,this.stdDeviationX=d(e,0),this.stdDeviationY=d(f,0),this.width=g===void 0&&h===void 0?40:g,this.height=h,this.aspect=g!==void 0&&h!==void 0?g/d(h,1):0,this.format=null,this.originalWidth=0,this.originalHeight=0};function resize(a){var b=sharp(a.input);return b.metadata().then(function(c){return a.format=c.format,a.originalWidth=c.width,a.originalHeight=c.height,b.resize(a.width,a.height).toBuffer()})}function embed(a,b){var c='data:image/'+b.format+';base64,'+a.toString('base64'),d=b.originalWidth,e=0<b.aspect?Math.round(b.originalWidth/b.aspect):b.originalHeight,f=b.stdDeviationX,g=b.stdDeviationY;return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+d+'" height="'+e+'" viewBox="0 0 '+d+' '+e+'"><filter id="blur" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="'+f+' '+g+'" edgeMode="duplicate"/><feComponentTransfer><feFuncA type="discrete" tableValues="1 1" /></feComponentTransfer></filter><image filter="url(#blur)" x="0" y="0" height="100%" width="100%" xlink:href="'+c+'"/></svg>')}function writeFile(a,b){var c=b.output;return''===path.extname(c)&&(c=path.join(c,path.basename(b.input,path.extname(b.input)))+'.svg'),fs.outputFile(c,a)}var BlurUp=function(){function a(){classCallCheck(this,a)}return createClass(a,null,[{key:'generate',value:function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},d=new Settings(a,b,c.stdDeviationX,c.stdDeviationY,c.width,c.height);return resize(d).then(function(a){return embed(a,d)}).then(function(a){return writeFile(a,d)})}}]),a}();module.exports=BlurUp;
