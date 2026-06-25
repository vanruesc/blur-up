import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { access, readFile, rm, constants } from "fs/promises";
import { blurUp } from "svg-blur-up";

describe("EventTarget", () => {

	before(async() => rm("test/generated", {
		recursive: true,
		force: true
	}));

	it("can generate an SVG", async() => {

		return blurUp("test/images/img.jpg", "test/generated/a.svg").then(async() => {

			const actual = await readFile("test/generated/a.svg", "utf8");
			const expected = await readFile("test/expected/a.svg", "utf8");

			assert.equal(actual, expected);

		});

	});

	it("honors options", async() => {

		return blurUp("test/images/img.jpg", "test/generated/b.svg", {
			stdDeviationX: 30,
			width: 20
		}).then(async() => {

			const actual = await readFile("test/generated/b.svg", "utf8");
			const expected = await readFile("test/expected/b.svg", "utf8");

			assert.equal(actual, expected);

		});

	});

	it("can handle transparent images", async() => {

		return blurUp("test/images/transparent.png", "test/generated/c.svg", {
			stdDeviationX: 30,
			width: 20
		}).then(async() => {

			const actual = await readFile("test/generated/c.svg", "utf8");
			const expected = await readFile("test/expected/c.svg", "utf8");

			assert.equal(actual, expected);

		});

	});

	it("does not blur edges of opaque PNG images", async() => {

		return blurUp("test/images/opaque.png", "test/generated/d.svg", {
			stdDeviationX: 30,
			width: 20
		}).then(async() => {

			const actual = await readFile("test/generated/d.svg", "utf8");
			const expected = await readFile("test/expected/d.svg", "utf8");

			assert.equal(actual, expected);

		});

	});

	it("falls back to the input file name", async() => {

		return blurUp("test/images/img.jpg", "test/images", {
			stdDeviationX: 30,
			width: 20
		}).then(async() => access("test/images/img.svg", constants.F_OK).then((error) => {

			assert.equal(error, undefined);

		}));

	});

});
