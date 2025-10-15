declare module '*?lqip' {
	const lqip: {
		lqip: string;
		width: number;
		height: number;
		src: string;
	};
	export default lqip;
}

// Vue mode
declare module '*?lqip&vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// React mode
declare module '*?lqip&react' {
  import type { FC, ImgHTMLAttributes } from 'react';
  const component: FC<ImgHTMLAttributes<HTMLImageElement>>;
  export default component;
}
