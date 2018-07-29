import fs from "fs-extra";
import test from "ava";
import BlurUp from "../build/svg-blur-up.js";

test.before(t => {

	return fs.remove("test/generated");

});

test("can generate an SVG", t => {

	return BlurUp.generate("test/images/img.jpg", "test/generated/a.svg").then(() => {

		const actual = fs.readFileSync("test/generated/a.svg", "utf8");
		const expected = fs.readFileSync("test/expected/a.svg", "utf8");

		t.is(actual, expected);

	});

});

test("honors options", t => {

	return BlurUp.generate("test/images/img.jpg", "test/generated/b.svg", {

		stdDeviationX: 30,
		width: 20

	}).then(() => {

		const actual = fs.readFileSync("test/generated/b.svg", "utf8");
		const expected = fs.readFileSync("test/expected/b.svg", "utf8");

		t.is(actual, expected);

	});

});

test("falls back to the input file name", t => {

	return BlurUp.generate("test/images/img.jpg", "test/generated", {

		stdDeviationX: 30,
		width: 20

	}).then(() => {

		return fs.access("test/generated/img.svg", fs.F_OK).then((error) => {

			t.is(error, undefined);

		});

	});

});
