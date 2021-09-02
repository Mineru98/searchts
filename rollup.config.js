import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

export default {
	input: "./src/searchts.ts",
	output: [
		{
			sourcemap: true,
			file: pkg.main,
			format: "cjs",
			banner: `/* @license searchts | (c) Searchts Team and other contributors | https://github.com/Mineru98/searchts */`,
		},
		{
			sourcemap: true,
			file: pkg.module,
			format: "esm",
			banner: `/* @license searchts | (c) Searchts Team and other contributors | https://github.com/Mineru98/searchts */`,
		},
	],
	plugins: [
		typescript({
			lib: ["es5", "es6", "dom"],
			target: "es5",
			module: "ESNext",
			sourceMap: process.env.NODE_ENV === "prod" ? false : true,
			outputToFilesystem: true,
		}),
	],
};
