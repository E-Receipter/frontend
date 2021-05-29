import preprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-netlify';
// import adapter from '@sveltejs/adapter-static';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true
		}),
	],
	kit: {
		files: {
			assets: 'src/static',
			hooks: 'src/hooks',
			lib: 'src/lib',
			routes: 'src/routes',
			serviceWorker: 'src/service-worker',
			template: 'src/app.html'
		},
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		// adapter: adapter({ //not working
		// 	pages:'build',
		// 	assets:'build',
		// 	fallback: '200.html',
		// }),
		adapter: adapter(), //netlify
	}
};

export default config;
