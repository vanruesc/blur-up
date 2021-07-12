import fs from "fs-extra";
import test from "ava";
import blurUp from "../dist/svg-blur-up.js";

test.before(t => {

	return fs.remove("test/generated");

});

test("can generate an SVG", t => {

	return blurUp("test/images/img.jpg", "test/generated/a").then(() => {

		const actual = fs.readFileSync("test/generated/a/img.svg", "utf8");
		const expected = fs.readFileSync("test/expected/a/img.svg", "utf8");

		t.is(actual, expected);

	});

});

test("honors options", t => {

	return blurUp("test/images/img.jpg", "test/generated/b", {
		stdDeviationX: 30,
		width: 20
	}).then(() => {

		const actual = fs.readFileSync("test/generated/b/img.svg", "utf8");
		const expected = fs.readFileSync("test/expected/b/img.svg", "utf8");

		t.is(actual, expected);

	});

});

test("falls back to the input file name", t => {

	return blurUp("test/images/img.jpg", "test/generated", {
		stdDeviationX: 30,
		width: 20
	}).then(() => {

		return fs.access("test/generated/img.svg", fs.F_OK).then((error) => {

			t.is(error, undefined);

		});

	});

});
