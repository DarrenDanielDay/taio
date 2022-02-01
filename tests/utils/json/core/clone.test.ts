import { cloneJSONDeep } from "../../../../src/utils/json/core/clone";

describe("clone json deep", () => {
  it("should have json behavior", () => {
    const value = { a: 1, b: { c: "2" } };
    expect(cloneJSONDeep(value)).toStrictEqual(value);
    expect(cloneJSONDeep(null)).toBe(null);
    expect(cloneJSONDeep({ a: null })).toStrictEqual({ a: null });
    expect(cloneJSONDeep({ a: undefined })).toStrictEqual({});
  });
});
