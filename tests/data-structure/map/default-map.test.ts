import { DefaultMap } from "../../../src/libs/custom/data-structure/map/default-map";

describe("default map", () => {
  it("should invoke default creator", () => {
    const defaultNumber = Math.random();
    const defaultCreator = jest.fn(() => defaultNumber);
    const defaultMap = new DefaultMap<string, number>(defaultCreator, []);
    defaultMap.set("foo", 1);
    defaultMap.set("bar", 2);
    expect(defaultMap.get("foo")).toBe(1);
    expect(defaultMap.get("bar")).toBe(2);
    expect(defaultMap.get("baz")).toBe(defaultNumber);
    expect(defaultCreator).toBeCalledTimes(1);
    expect(defaultCreator).toBeCalledWith("baz");
  });
});
