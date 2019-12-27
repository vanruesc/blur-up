import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import minify from "rollup-plugin-babel-minify";

const pkg = require("./package.json");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}, ${pkg.license}
 */`;

const production = (process.env.NODE_ENV === "production");
const external = Object.keys(pkg.dependencies).concat(["path"]);

const lib = {

	input: pkg.module,
	external,
	plugins: [resolve()].concat(!production ? [] : [
		babel(),
		minify({
			bannerNewLine: true,
			comments: false
		})
	]),
	output: {
		file: "build/" + pkg.name + ".js",
		format: "cjs",
		name: pkg.name.replace(/-/g, "").toUpperCase(),
		banner: banner
	}

};

const bin = {

	input: "src/bin/cli.js",
	external,
	plugins: [resolve()].concat(!production ? [] : [
		babel(),
		minify({
			comments: false
		})
	]),
	output: {
		file: "bin/cli.js",
		format: "cjs"
	}

};

export default [lib, bin];
