import path from 'node:path';
import mime from 'mime';
import sharp from 'sharp';
import type { Plugin, UserConfig } from 'vite';
import { lqip } from './lqip.js';

export interface LQIPPluginOptions {
	lqip?: {
		/**
		 * Height of LQIP
		 * @default 32
		 * ⚠️ the higher the number, the slower the page load!
		 */
		height?: number;
		/**
		 * Width of LQIP
		 * @default 32
		 * ⚠️ the higher the number, the slower the page load!
		 */
		width?: number;
	};
	/** Forward options to sharp */
	sharp?: {
		avif?: sharp.AvifOptions;
		gif?: sharp.GifOptions;
		heif?: sharp.HeifOptions;
		jp2?: sharp.Jp2Options;
		jpeg?: sharp.JpegOptions;
		jxl?: sharp.JxlOptions;
		png?: sharp.PngOptions;
		raw?: sharp.RawOptions;
		tif?: sharp.TiffOptions;
		tile?: sharp.TileOptions;
		webp?: sharp.WebpOptions;
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

			const img = sharp(new URL(base!, `file://${viteConfig.root}/`).pathname);
			const metadata = await img.metadata();
			const lqipImg = await img
				.resize({
					width: options?.lqip?.width ?? 32,
				})
				.toFormat('jpg', {})
				.toBuffer();

			return `import src from '${base}?url';

export default {
	lqip: \`${lqip({
		height: metadata.height ?? 100,
		mimetype: mime.getType(path.extname(base!))!,
		source: lqipImg,
		width: metadata.width ?? 100,
	})}\`,
	src,
	width: ${metadata.width ?? -1},
	height: ${metadata.height ?? -1},
};
			`;
		},
	};
}
