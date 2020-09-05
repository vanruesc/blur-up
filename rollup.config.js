import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const pkg = require("./package.json");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const production = (process.env.NODE_ENV === "production");
const external = Object.keys(pkg.dependencies).concat(["path"]);

const lib = {
	input: pkg.module,
	external,
	plugins: [resolve()].concat(!production ? [] : [terser(), babel({
		babelHelpers: "bundled"
	})]),
	output: {
		file: "build/" + pkg.name + ".js",
		format: "cjs",
		exports: "default",
		name: pkg.name.replace(/-/g, "").toUpperCase(),
		banner: banner
	}
};

const bin = {
	input: "src/bin/cli.js",
	external,
	plugins: [resolve()].concat(!production ? [] : [terser(), babel({
		babelHelpers: "bundled"
	})]),
	output: {
		file: "bin/cli.js",
		format: "cjs"
	}
};

export default [lib, bin];
