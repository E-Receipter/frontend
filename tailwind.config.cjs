module.exports = {
	mode: "aot",
	purge: [
		"./src/**/*.{html,js,svelte,ts}",
	],
	theme: {
		extend: {
			colors:{
				prim:'#5D38E0',
				pureWhite:'#ffffff',
			}
		},
	},
	plugins: [],
};
