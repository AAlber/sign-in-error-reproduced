/**
 * make an optional property required
 */
type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

type OrNull<T> = T | null;

/**
 * check if type extends any
 * https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
 */
type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;

type Nullable<T> = T | null;

/**
 * Discriminated union lost when using Omit, workaround:
 * https://github.com/microsoft/TypeScript/issues/31501#issuecomment-1079728677
 */
type RemoveFrom<T, P> = {
  [Key in keyof T as Exclude<Key, P>]: T[Key];
};
