/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next-images" />

declare module '*.mp3' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const content: any;
  export default content;
}
