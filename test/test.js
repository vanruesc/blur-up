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

	return blurUp("test/images/img.jpg", "test/generated/a").then(async() => {

		const actual = await readFile("test/generated/a/img.svg", "utf8");
		const expected = await readFile("test/expected/a/img.svg", "utf8");

		t.is(actual, expected);

	});

});

test("honors options", async(t) => {

	return blurUp("test/images/img.jpg", "test/generated/b", {
		stdDeviationX: 30,
		width: 20
	}).then(async() => {

		const actual = await readFile("test/generated/b/img.svg", "utf8");
		const expected = await readFile("test/expected/b/img.svg", "utf8");

		t.is(actual, expected);

	});

});

test("falls back to the input file name", async(t) => {

	return blurUp("test/images/img.jpg", "test/generated", {
		stdDeviationX: 30,
		width: 20
	}).then(async() => access("test/generated/img.svg", constants.F_OK).then((error) => {

		t.is(error, undefined);

	}));

});
