import type { Buffer } from 'node:buffer';
import svgToMiniDataURI from 'mini-svg-data-uri';

const LB_RE = /\n/g;
const LEADING_WHITESPACE_RE = /^\s*/gm;
const TRAILING_B64_PADDING_RE = /=+$/;

// size and blur factor work together—the mroe you increase one, the more you must increase the other
// it’s a bit “magic number-y” of what looks best/smoothest.
const SIZE = 256;
const BLUR_FACTOR = 6;

export function dataURI(buffer: Buffer, mime: string) {
	return `data:${mime};base64,${buffer.toString('base64').replace(TRAILING_B64_PADDING_RE, '')}`;
}

export function lqip({ source, width, height, mimetype }: { source: Buffer; width: number; height: number; mimetype: string }) {
	const imgData = dataURI(source, mimetype);
	const ratio = height / width;

	return svgToMiniDataURI(
		`<svg viewBox="0 0 ${SIZE} ${SIZE * ratio}" xmlns="http://www.w3.org/2000/svg" xmlns:x="http://www.w3.org/1999/xlink">
	<filter id="lqip-blur">
		<feGaussianBlur stdDeviation="${BLUR_FACTOR}"/>
		<feComponentTransfer>
			<feFuncA type="linear" slope="2"/>
		</feComponentTransfer>
	</filter>
	<image x:href="${imgData}" filter="url(#lqip-blur)" preserveAspectRatio="xMidYMid slice" height="100%" width="100%"/>
</svg>`
			.replace(LEADING_WHITESPACE_RE, '')
			.replace(LB_RE, ''),
	);
}
