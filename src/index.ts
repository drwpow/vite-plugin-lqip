import mime from 'mime';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import type { Plugin, UserConfig } from 'vite';

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
}

export default function vitePluginLqip(options?: LQIPPluginOptions): Plugin {
	let viteConfig: UserConfig = {} as unknown as UserConfig;
	return {
		name: 'vite-plugin-lqip',
		enforce: 'pre',
		configResolved(cfg) {
			viteConfig = cfg as unknown as UserConfig;
		},
		async load(id) {
			const [base, search] = id.split('?');
			if (!search) {
				return null;
			}
			const s = new URLSearchParams(search);
			if (!s.has('lqip')) {
				return null;
			}

			const img = sharp(fileURLToPath(new URL(base!, `file://${viteConfig.root}/`)));
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
