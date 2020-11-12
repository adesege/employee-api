import { BaseTransformerInterface } from "./base-transformer.interface";

export class BaseTransformer<T> implements BaseTransformerInterface<T> {
  private isArray?: boolean = false;
  private entities: T[];

  constructor(entities: T | T[]) {
    this.isArray = Array.isArray(entities);
    this.entities = (this.isArray ? entities : [entities]) as T[];
  }

  transform(entity: T): Partial<T> {
    return { ...entity };
  }

  toJSON(): Partial<T> | Partial<T>[] {
    const entities = this.entities.map((entity) => this.transform(entity))

    if (this.isArray) {
      return entities;
    }
    return entities[0];
  }

}
