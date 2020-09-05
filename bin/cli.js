#!/usr/bin/env node

"use strict";var t=require("fs-extra"),e=require("glob"),n=require("path"),i=require("yargs-parser"),r=require("sharp");function o(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var u=o(t),a=o(e),l=o(n),f=o(i),c=o(r);function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function h(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function d(t){return function(t){if(Array.isArray(t))return p(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return p(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return p(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}var g=function t(e,n){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:20,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:20,o=arguments.length>4?arguments[4]:void 0,u=arguments.length>5?arguments[5]:void 0;s(this,t),this.input=e,this.output=n,this.stdDeviationX=Math.max(i,0),this.stdDeviationY=Math.max(r,0),this.width=void 0===o&&void 0===u?40:o,this.height=u,this.format=null,this.originalWidth=0,this.originalHeight=0};function v(t){var e=c.default(t.input);return e.metadata().then((function(n){return t.format=n.format,t.originalWidth=n.width,t.originalHeight=n.height,e.resize(t.width,t.height).toBuffer({resolveWithObject:!0})}))}function m(t,e,n){var i="data:image/"+n.format+";base64,"+t.toString("base64"),r=void 0===n.width&&void 0!==n.height?Math.round(n.originalHeight/e.height):Math.round(n.originalWidth/e.width),o=r*e.width,u=r*e.height,a=n.originalWidth,l=n.originalHeight,f=n.stdDeviationX,c=n.stdDeviationY;return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+a+'" height="'+l+'" viewBox="0 0 '+o+" "+u+'" preserveAspectRatio="none"><filter id="blur" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="'+f+" "+c+'" edgeMode="duplicate"/><feComponentTransfer><feFuncA type="discrete" tableValues="1 1" /></feComponentTransfer></filter><image filter="url(#blur)" x="0" y="0" height="100%" width="100%" xlink:href="'+i+'"/></svg>')}function w(t,e){var n=e.output;return""===l.default.extname(n)&&(n=l.default.join(n,l.default.basename(e.input,l.default.extname(e.input)))+".svg"),u.default.outputFile(n,t)}var y,b,j=function(){function t(){s(this,t)}var e,n,i;return e=t,i=[{key:"generate",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=new g(t,e,n.stdDeviationX,n.stdDeviationY,n.width,n.height);return v(i).then((function(t){return m(t.data,t.info,i)})).then((function(t){return w(t,i)}))}}],(n=null)&&h(e.prototype,n),i&&h(e,i),t}(),x=Object.assign({config:null,input:null,output:null},f.default(process.argv.slice(2),{alias:{config:["c"],input:["i"],output:["o"]}}));function A(t,e){return new Promise((function(n,i){var r=e.length,o=0,u=r;!function i(){if(o===r)n("Generated "+u+" SVG "+(1===u?"file":"files"));else{var a=e[o++];j.generate(a,t.output,t).then(i).catch((function(t){--u,console.warn(t.message,"("+a+")"),i()}))}}()}))}(y=new Promise((function(t,e){u.default.readFile(l.default.join(process.cwd(),"package.json")).then((function(n){try{t(JSON.parse(n).blurUp)}catch(t){e(t)}})).catch((function(e){t()}))})),b=new Promise((function(t,e){var n=l.default.join(process.cwd(),null===x.config?".blur-up.json":x.config);u.default.readFile(n).then((function(n){try{t(JSON.parse(n))}catch(t){e(t)}})).catch((function(i){null===x.config?t():"ENOENT"===i.code?e("Could not find the configuration file ("+n+")"):e("Failed to read the configuration file ("+i+")")}))})),new Promise((function(t,e){y.then((function(t){return void 0!==t?Promise.resolve(t):b})).then(t).catch(e)}))).then((function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new Promise((function(e,n){null!==x.input&&(t.input=x.input),null!==x.output&&(t.output=x.output),void 0===t.input?n("No input path specified"):void 0===t.output?n("No output path specified"):""!==l.default.extname(t.output)?n("The output path must describe a directory"):(Array.isArray(t.input)||(t.input=[t.input]),e(t))}))})).then((function(t){return new Promise((function(e,n){var i=t.input,r=[],o=0;!function u(l,f){null!==l?n(l):(r=r.concat(f),o===i.length?0===r.length?n("No input files found"):e([t,r]):a.default(i[o++],u))}(null,[])}))})).then((function(t){return A.apply(void 0,d(t))})).then(console.log).catch(console.error);
