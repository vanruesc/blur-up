import { createRequire } from "module";
import esbuild from "esbuild";

const require = createRequire(import.meta.url);
const pkg = require("./package");
const date = (new Date()).toDateString();
const external = Object.keys(pkg.dependencies).concat(["path"]);

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const shebang = "#!/usr/bin/env node";

const common = {
	platform: "node",
	logLevel: "info",
	bundle: true,
	minify: true,
	external
};

await esbuild.build(Object.assign({
	entryPoints: ["src/index.ts"],
	outfile: `dist/${pkg.name}.js`,
	banner: { js: banner },
	format: "esm"
}, common)).catch(() => process.exit(1));

await esbuild.build(Object.assign({
	entryPoints: ["src/index.ts"],
	outfile: `dist/${pkg.name}.cjs`,
	banner: { js: banner },
	format: "cjs"
}, common)).catch(() => process.exit(1));

await esbuild.build(Object.assign({
	entryPoints: ["src/cli.ts"],
	outfile: `dist/cli.cjs`,
	banner: { js: shebang },
	format: "cjs"
}, common)).catch(() => process.exit(1));
