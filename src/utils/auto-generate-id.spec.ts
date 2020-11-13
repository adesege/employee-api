import { autoGenerateId } from "./auto-generate-id";
import { uuid } from "./uuid";

describe('AutoGenerateId', () => {
  jest.mock('./auto-generate-id');

  it('should be generate id', () => {
    const id = autoGenerateId();
    expect(id).toEqual(id);
  });

  it('should be not generate id if id is false', () => {
    const id = autoGenerateId.call({ id: uuid() });
    expect(id).not.toBeDefined();
  });
});
