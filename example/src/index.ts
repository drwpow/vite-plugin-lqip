import magpie from './natasha-miller-DFCnzrSYqpQ-unsplash.jpg?lqip';
import anemonie from './eva-tillmann-INyRx2zfZJw-unsplash.jpg?lqip';
import coral from './qui-nguyen-0G01UI1MQhg-unsplash.jpg?lqip';
import street from './denys-nevozhai--F3wMFrZ7z0-unsplash.jpg?lqip';
import torii from './d-j-x-8JcrlWmhM-unsplash.jpg?lqip';
import mountains from './luke-richardson-dI7vfR1Bqcg-unsplash.jpg?lqip';

const IMAGES = [
	{
		img: magpie,
		alt: 'Magpie',
		attr: 'Photo by <a href="https://unsplash.com/@tashography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Natasha Miller</a> on <a href="https://unsplash.com/photos/DFCnzrSYqpQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
		size: 4345455,
	},
	{
		img: anemonie,
		alt: 'Anemonie',
		attr: 'Photo by <a href="https://unsplash.com/@screeny?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Eva Tillmann</a> on <a href="https://unsplash.com/photos/INyRx2zfZJw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
		size: 1162871,
	},
	{
		img: coral,
		alt: 'Coral',
		attr: 'Photo by <a href="https://unsplash.com/@quinguyen?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">QUI NGUYEN</a> on <a href="https://unsplash.com/photos/0G01UI1MQhg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
		size: 4305793,
	},
	{
		img: street,
		alt: 'Street at night',
		attr: 'Photo by <a href="https://unsplash.com/@dnevozhai?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Denys Nevozhai</a> on <a href="https://unsplash.com/photos/-F3wMFrZ7z0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
		size: 3655247,
	},
	{
		img: torii,
		alt: 'Torii',
		attr: 'Photo by <a href="https://unsplash.com/@trulysoutheastasia?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">D J</a> on <a href="https://unsplash.com/photos/x-8JcrlWmhM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
		size: 1923166,
	},
	{
		img: mountains,
		alt: 'Mountains',
		attr: 'Photo by <a href="https://unsplash.com/@lukealrich?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Luke Richardson</a> on <a href="https://unsplash.com/photos/dI7vfR1Bqcg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>',
		size: 7011891,
	},
];

const nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 });

// 1. Basic LQIP example

let newHTML = `<h2>vite-plugin-lqip Demo</h2>
<p><i>Tip: try <a href="https://developer.chrome.com/docs/devtools/settings/throttling/" target="_blank" rel="noopener noreferrer">throttling your browser</a> to see the loading effect in slow motion.</i></p>
`;

for (const { img, alt, attr, size } of IMAGES) {
	const originalSize = size / 1000;
	const lqipSize = new Blob([img.lqip]).size / 1000;

	newHTML += `
<div class="example">
  <div class="example-comparison">
		<div class="example-img">
			<figure>
				<img src="${img.lqip}" width="${img.width}" height="${img.height}" alt="${alt}" />
				<figcaption>${attr}</figcaption>
			</figure>
		</div>
		<div class="example-img">
			<figure>
				<img src="${img.src}" width="${img.width}" height="${img.height}" alt="${alt}" style="background-image: url(&quot;${img.lqip}&quot;)" />
				<figcaption>${attr}</figcaption>
			</figure>
		</div>
	</div>
	<dl class="example-meta">
	  <dt>Original</dt>
		<dd>${nf.format(originalSize)} kB</dd>
		<dt>LQIP</dt>
		<dd>${nf.format(lqipSize)} kB</dd>
	</dl>
</div>
`;
}

// TODO: Optimization

document.getElementById('app')!.innerHTML = newHTML;
