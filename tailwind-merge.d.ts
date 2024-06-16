// tailwind-merge.d.ts
declare module 'tailwind-merge' {
  export function twMerge(...classes: (string | undefined)[]): string;
}
