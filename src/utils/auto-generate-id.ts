import { uuid } from "./uuid";

export function autoGenerateId(): void {
  if (!!this.id) return;
  this.id = uuid()
}
