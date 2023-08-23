import { LowerCasePipe, TitleCasePipe } from "@angular/common";

export type CamelToSnake<S extends string=""> = S extends `${infer First}${infer Rest}`
  ? `${First extends Uppercase<First> ? '_' : ''}${Lowercase<First>}${CamelToSnake<Rest>}`
  : '';

export  type RecursiveSnakeCaseType<T> = T extends Record<string, any>
  ? {
      [K in keyof T as K extends string
        ? CamelToSnake<K>
        : never]: T[K] extends Record<string, any>
        ? ( T[K] extends Array<any> ?  Array<RecursiveSnakeCaseType<T[K][number]>> : RecursiveSnakeCaseType<T[K]>)
        : T[K];
    }
  : T;




export type SnakeToCamel<S extends string=""> = S extends `${infer First}_${infer Rest}`
  ? `${Capitalize<First>}${SnakeToCamel<Rest>}`
  : S;

export type RecursiveCamelCaseType<T> = T extends Record<string, any>
? {
    [K in keyof T as K extends string
      ? SnakeToCamel<K>
      : never]: T[K] extends Record<string, any>
      ? ( T[K] extends Array<any> ?  Array<RecursiveCamelCaseType<T[K][number]>> : RecursiveCamelCaseType<T[K]>)
      : T[K];
  }
: T;

export let makeLowerCase = new LowerCasePipe().transform
export let makeTitleCase = new TitleCasePipe().transform


export let transformFromCamelCaseToSnakeCase = (str) =>
  str[0].toLowerCase() +
  str
    .slice(1, str.length)
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export let transformFromSnakeCaseToCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('_', ''));
};
