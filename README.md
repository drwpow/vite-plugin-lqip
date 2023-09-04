# ⚡ vite-plugin-lqip

Vite plugin to generate low quality image placeholders (LQIP) in any Vite app. Works in React/Preact/Svelte/Vue (Vite app), SvelteKit, Astro, or basically any Vite-powered setup.

- ✅ Inlines images for instant loading
- ✅ Reduce layout shift by having the placeholders rendered on first paint and sized proportionally
- ✅ Uses a technique similar to [lqip-modern](https://github.com/transitive-bullshit/lqip-modern) using WebP compression
- ✅ Compatible with [vite-imagetools](https://github.com/JonasKruckenberg/imagetools)

![](./.github/example-06.png)

**[View Demo](https://vite-plugin-lqip.pages.dev)**

## Setup

First install the package:

```
npm i -D vite-plugin-lqip
```

Then add to your `vite.config.js`:

```js
import lqip from 'vite-plugin-lqip';

export default {
  plugins: [lqip()],
};
```

### TypeScript

If using TypeScript, place the following in your `globals.d.ts` file:

```ts
declare module '*?lqip' {
  const lqip: {
    lqip: string;
    width: number;
    height: number;
    src: string;
  };
  export default lqip;
}
```

## Usage

### Basic

Use this by adding `?lqip` to the end of any URL. It will then return an object with:

```ts
{
  /** base-64-encoded image to be inlined (< 1kB, more performant than an extra network request) */
  lqip: string;
  /** your original, UNTOUCHED image URL (handled by Vite, respects all your settings) */
  src: string;
  /** width, in pixels, of full-size image */
  width: number;
  /** height, in pixels, of full-size image */
  height: number;
}
```

You can then use this in nearly any Vite-powered app:

```tsx
import lqip from './path/to/image.jpg?lqip';

<img
  src={lqip.src}
  width={lqip.width}
  height={lqip.height}
  style={{ backgroundImage: `url("${lqip.lqip}")`, backgroundSize: 'cover' }}
/>;
```

> 💡 Tip: set `width` and `height` on images [to prevent layout shifts](https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/)

### Optimizing with vite-imagetools

By default, this plugin will **NOT** touch your source images, and it will preserve them exactly as they are. If you want to optimize your images, you can add [vite-imagetools](https://github.com/JonasKruckenberg/imagetools). Just use it as you would normally, using vite-plugin-lqip for the inlined placeholder:

```tsx
import lqip from './path/to/image.jpg?lqip';
import srcSet from './path/to/image.jpg?w=500;700;900;1200&format=webp&as=srcset';

<picture>
  <source srcset={srcset} type="image/webp" />
  <img src={lqip} width={lqip.width} height={lqip.height} />
</picture>;
```

_Note: you can’t reuse the same import for both, so `?lqip&w=500;…` won’t work._

> ⚠️ In `vite.config.js` be sure to place vite-plugin-lqip **BEFORE** vite-imagetools in your [Vite plugins array](https://vitejs.dev/plugins/). This is safe to do as vite-plugin-lqip will not touch images in any way, and it lets the LQIP be generated from the original source before vite-imagetools ”claims” it for output.

## Config

### Plugin Options

Plugin options can be configured in `vite.config.ts`. Here are all plugin options, along with their defaults:

```js
import lqip from 'vite-plugin-lqip';

export default {
  plugins: [
    lqip({
      sharp: {
        /** @see https://sharp.pixelplumbing.com/api-resize */
        resize: {
          width: 32,
          height: 32,
          fit: 'inside',
          kernel: sharp.kernel.cubic,
        },
        /** @see https://sharp.pixelplumbing.com/api-output#webp */
        webp: {
          smartSubsample: true,
        },
      },
    }),
  ],
};
```

## Other / Misc

### Comparisons

- [lqip-modern](https://github.com/transitive-bullshit/lqip-modern/) was originally going to power this plugin as [the results speak for itself](https://transitive-bullshit.github.io/lqip-modern/). However, in my testing, I did find better results with slightly-modified options, so I had to manage sharp myself. But is 99% the same technique, and all credit goes to lqip-modern. Major differences include:
  - Blurring is baked into the WebP, rather than [lqip-modern requiring CSS blur](https://github.com/transitive-bullshit/lqip-modern/pull/4). _Why do more work than you have to?_
  - This defaults to `32px` previews while lqip-modern defaults to `16px`. I found the higher size to be a dramatic improvement in color without adding significant bytes
  - The `32px` previews, when used as `src`, also are better at keeping the original ratios and reduce layout shift (since images can’t have half-pixel resolutions)
  - vite-plugin-lqip exposes more of sharp’s config than lqip-modern does which allows better customization (with “best as I can do” defaults, of course)
- [sqip](https://github.com/axe312ger/sqip) is an interesting alternative approach but much slower to build, and usually yields larger sizes
- [The “Blur Up” technique](https://css-tricks.com/the-blur-up-technique-for-loading-background-images/) was previously great, but [lqip-modern](https://github.com/transitive-bullshit/lqip-modern) seems to deliver identical quality in much smaller sizes
- [lqip](https://github.com/zouhir/lqip) was one of the first major inspirations for this approach, but newer techniques have come out

### Compression

This library only uses sharp’s WebP output and nothing else. Image nerds will be quick to point out that sharp is **NOT** an image compression library, so it would be possible to add a compression step after sharp (e.g. [Squoosh](https://squoosh.app/)). However, in my testing I found that at the small image sizes being produced, additional compression steps didn’t yield any additional savings, which is probably to be expected (not much to optimize). An additional compression step would also result in a noticeable drop in speed.

But that said, this library exists to shave off every possible byte from images, so if a better technique is found, this library will update ([contributions are also welcome here!](./CONTRIBUTING.md)).

However, this only applies to the LQIP images generated by this library. You absolutely should compress your fullsize images.
