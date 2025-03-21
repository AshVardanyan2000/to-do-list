declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  import { FC, SVGProps } from 'react';

  export const ReactComponent: FC<SVGProps<
  SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}
