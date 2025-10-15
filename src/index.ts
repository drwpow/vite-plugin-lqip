import mime from 'mime';
import path from 'node:path';
import sharp from 'sharp';
import type { Plugin } from 'vite';

export interface LQIPPluginOptions {
	sharp?: {
		/**
		 * (optional) Provide options to sharp.resize
		 * @default { width: 32, height: 32, fit: 'inside', kernel: sharp.kernel.cubic }
		 */
		resize?: sharp.ResizeOptions;
		/** (optional) provide options to sharp.webp */
		webp?: sharp.WebpOptions;
		/**
		 * (optional) provide blur factor
		 * @default 1.5
		 */
		blur?: number;
	};
	/**
	 * Controls the output mode of the LQIP plugin.
	 *
	 * - `"data"` (default):
	 *   Returns a simple object containing the low-quality placeholder (`lqip`),
	 *   the original image URL (`src`), and metadata (width, height).
	 *   ```ts
	 *   import img from './example.jpg?lqip';
	 *   console.log(img); // { lqip, src, width, height }
	 *   ```
	 *
	 * - `"vue"`:
	 *   Returns a ready-to-use Vue component that displays a blurred placeholder
	 *   and smoothly transitions to the full image when it loads.
	 *   ```vue
	 *   <script setup lang="ts">
	 *   import LQIP from './example.jpg?lqip';
	 *   </script>
	 *
	 *   <template>
	 *     <LQIP />
	 *   </template>
	 *   ```
	 *
	 * - `"react"`:
	 *   Returns a React functional component that provides the same effect:
	 *   a blurred low-quality placeholder that fades into the original image.
	 *   ```tsx
	 *   import LQIP from './example.jpg?lqip';
	 *
	 *   export default function App() {
	 *     return <LQIP />;
	 *   }
	 *   ```
	 *
	 * **Priority rule:**
	 * If the import path explicitly includes `?vue` or `?react`,
	 * that mode takes precedence over the global `mode` option.
	 *
	 * @default "data"
	 */
	mode?: 'data' | 'vue' | 'react';
}

export default function vitePluginLqip(options?: LQIPPluginOptions): Plugin {
	return {
		name: 'vite-plugin-lqip',
		enforce: 'pre',
		async load(id) {
			const [base, search] = id.split('?');
			if (!search) {
				return null;
			}
			const s = new URLSearchParams(search);
			if (!s.has('lqip')) {
				return null;
			}

			const img = sharp(base);
			const metadata = await img.metadata();
			const output = await img
				.toFormat('webp', {
					smartSubsample: true,
					...options?.sharp?.webp,
				})
				.blur(1.25)
				.resize({
					width: 32,
					height: 32,
					fit: 'inside',
					kernel: sharp.kernel.cubic,
					...options?.sharp?.resize,
				})
				.toBuffer();
			const lqip = `data:${mime.getType(path.extname(base!))};base64,${output.toString('base64')}`;

			const vueCode = `
import { h } from 'vue';
import src from '${base}?url';

export default {
  name: 'LQIPImage',
  setup() {
    return () =>
      h('img', {
        src,
        width: ${metadata.width ?? -1},
        height: ${metadata.height ?? -1},
        style: {
					backgroundImage: 'url("${lqip}")',
					backgroundSize: 'cover'
        },
      });
  },
};
				`;
			const reactCode = `
import React from 'react';
import src from '${base}?url';

export default function LQIPImage() {
  return React.createElement('img', {
    src,
    width: ${metadata.width ?? -1},
    height: ${metadata.height ?? -1},
    style: {
      backgroundImage: \`url("${lqip}")\`,
      backgroundSize: 'cover'
    },
  });
}`;

			if (s.has('vue')) {
				return vueCode;
			} else if (s.has('react')) {
				return reactCode;
			} else if (options?.mode === 'vue') {
				return vueCode;
			} else if (options?.mode === 'react') {
				return reactCode;
			}

			return `import src from '${base}?url';

export default {
  lqip: \`${lqip}\`,
  src,
  width: ${metadata.width ?? -1},
  height: ${metadata.height ?? -1},
};
			`;
		},
	};
}
