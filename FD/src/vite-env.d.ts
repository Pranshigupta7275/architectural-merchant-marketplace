/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare module '*.css' {
  const content: string;
  export default content;
}
