export type PartialWithRequired<T, K extends Array<keyof T>> = Partial<T> & {
  [P in K[number]]: T[P];
};
