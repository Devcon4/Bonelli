import { rollup } from 'rollup';
import { minify } from 'terser';

const prefix = 'iife-str:';

export default function ({ minify: shouldMinify = false } = {}) {
	return {
		name: 'iife-str',
		async resolveId(id, importer) {
			if (!id.startsWith(prefix)) return;
			const resolved = await this.resolve(id.slice(prefix.length), importer);
			if (!resolved) throw Error(`Couldn't resolve ${id} from ${importer}`);
			return prefix + resolved.id;
		},
		async load(id) {
			if (!id.startsWith(prefix)) return;
			const path = id.slice(prefix.length);
			const build = await rollup({
				input: path,
				plugins: [],
			});

			const { output } = await build.generate({ format: 'iife' });
			const chunk = output[0];
			
			// Apply minification if requested
			let code = chunk.code;
			if (this.meta.watchMode === false && shouldMinify) {
				const result = await minify(code);
				code = result.code || code;
			}

			return `export default ${JSON.stringify(code)}`;
		},
	};
}
