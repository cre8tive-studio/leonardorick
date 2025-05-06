// ensure that keys sent to omit exists on the T model
// https://github.com/pelotom/type-zoo/blob/eab30a98ab77612ae0a0e51b91456dcbf4b12257/types/index.d.ts#L33
export type OmitStrict<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;
