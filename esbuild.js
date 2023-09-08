import pkg from "./package.json" assert { type: "json" };
import esbuild from "esbuild";

const date = new Date();
const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date.toDateString()}
 * ${pkg.homepage}
 * Copyright 2018 ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const shebang = "#!/usr/bin/env node";
const external = Object.keys(pkg.dependencies).concat(["path"]);

await esbuild.build({
	entryPoints: ["src/index.ts"],
	outfile: "dist/index.js",
	banner: { js: banner },
	platform: "node",
	logLevel: "info",
	format: "esm",
	bundle: true,
	minify: true,
	external
});

await esbuild.build({
	entryPoints: ["src/cli.ts"],
	outfile: "dist/cli.js",
	banner: { js: shebang },
	platform: "node",
	logLevel: "info",
	format: "esm",
	bundle: true,
	minify: true,
	external
});
