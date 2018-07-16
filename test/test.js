import fs from "fs-extra";
import test from "ava";
import BlurUp from "../build/blur-up.js";

const options = {
	width: 20,
	stdDeviationX: 30
};

const EOL = /(?:\\r\\n|\\r|\\n)/g;

test.before(t => {

	return fs.remove("test/generated");

});

test("can generate an SVG", t => {

	return BlurUp.generate("test/images/img.jpg", "test/generated/a.svg").then(() => {

		const actual = fs.readFileSync("test/generated/a.svg", "utf8").replace(EOL, "");
		const expected = fs.readFileSync("test/expected/a.svg", "utf8");

		t.is(actual, expected);

	});

});

test("honors options", t => {

	return BlurUp.generate("test/images/img.jpg", "test/generated/b.svg", options).then(() => {

		const actual = fs.readFileSync("test/generated/b.svg", "utf8").replace(EOL, "");
		const expected = fs.readFileSync("test/expected/b.svg", "utf8");

		t.is(actual, expected);

	});

});

test("falls back to the input file name", t => {

	return BlurUp.generate("test/images/img.jpg", "test/generated", options).then(() => {

		return fs.access("test/generated/img.svg", fs.F_OK).then((error) => {

			t.is(error, undefined);

		});

	});

});
