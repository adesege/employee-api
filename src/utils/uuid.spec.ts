import { uuid } from "./uuid";

describe('UUID', () => {
  jest.mock('./uuid');

  it('should be return a valid UUID', () => {
    const id = uuid();
    expect(id).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
  });
});
