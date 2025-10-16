import test from "ava";
import { access, readFile, rm, constants } from "fs/promises";
import { blurUp } from "svg-blur-up";

test.before(async() => {

	return rm("test/generated", {
		recursive: true,
		force: true
	});

});

test("can generate an SVG", async(t) => {

	return blurUp("test/images/img.jpg", "test/generated/a.svg").then(async() => {

		const actual = await readFile("test/generated/a.svg", "utf8");
		const expected = await readFile("test/expected/a.svg", "utf8");

		t.is(actual, expected);

	});

});

test("honors options", async(t) => {

	return blurUp("test/images/img.jpg", "test/generated/b.svg", {
		stdDeviationX: 30,
		width: 20
	}).then(async() => {

		const actual = await readFile("test/generated/b.svg", "utf8");
		const expected = await readFile("test/expected/b.svg", "utf8");

		t.is(actual, expected);

	});

});

test("can handle transparent images", async(t) => {

	return blurUp("test/images/transparent.png", "test/generated/c.svg", {
		stdDeviationX: 30,
		width: 20
	}).then(async() => {

		const actual = await readFile("test/generated/c.svg", "utf8");
		const expected = await readFile("test/expected/c.svg", "utf8");

		t.is(actual, expected);

	});

});

test("does not blur edges of opaque PNG images", async(t) => {

	return blurUp("test/images/opaque.png", "test/generated/d.svg", {
		stdDeviationX: 30,
		width: 20
	}).then(async() => {

		const actual = await readFile("test/generated/d.svg", "utf8");
		const expected = await readFile("test/expected/d.svg", "utf8");

		t.is(actual, expected);

	});

});

test("falls back to the input file name", async(t) => {

	return blurUp("test/images/img.jpg", "test/images", {
		stdDeviationX: 30,
		width: 20
	}).then(async() => access("test/images/img.svg", constants.F_OK).then((error) => {

		t.is(error, undefined);

	}));

});
