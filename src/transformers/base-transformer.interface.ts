
export interface BaseTransformerInterface<T> {

  transform: (entity: T) => Partial<T>;

  toJSON: () => Partial<T> | Partial<T>[];

}
