/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.mp3' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const content: any;
  export default content;
}
