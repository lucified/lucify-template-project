declare module '*.scss' {
  const value: any;
  export = value;
}

declare module '*.svg' {
  const content: string;
  export = content;
}

declare module '*.png' {
  const content: string;
  export = content;
}

declare module '*.hbs' {
  const content: (context: any) => string;
  export = content;
}
