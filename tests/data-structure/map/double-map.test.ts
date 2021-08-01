import { DoubleMap } from "../../../src/libs/custom/data-structure/map/double-map";

describe("double map", () => {
  let doubleMap: DoubleMap<number, number>;
  beforeEach(() => {
    doubleMap = new DoubleMap<number, number>();
    doubleMap.set(1, 2);
    doubleMap.set(3, 4);
    doubleMap.set(5, 6);
    doubleMap.set(7, 8);
  });
  it("should have double query logic", () => {
    expect(doubleMap.getKey(1)).toBeUndefined();
    expect(doubleMap.getKey(3)).toBeUndefined();
    expect(doubleMap.getKey(5)).toBeUndefined();
    expect(doubleMap.getKey(7)).toBeUndefined();
    expect(doubleMap.getKey(2)).toBe(1);
    expect(doubleMap.getKey(4)).toBe(3);
    expect(doubleMap.getKey(6)).toBe(5);
    expect(doubleMap.getKey(8)).toBe(7);

    expect(doubleMap.getValue(2)).toBeUndefined();
    expect(doubleMap.getValue(4)).toBeUndefined();
    expect(doubleMap.getValue(6)).toBeUndefined();
    expect(doubleMap.getValue(8)).toBeUndefined();
    expect(doubleMap.getValue(1)).toBe(2);
    expect(doubleMap.getValue(3)).toBe(4);
    expect(doubleMap.getValue(5)).toBe(6);
    expect(doubleMap.getValue(7)).toBe(8);
  });
  it("should have double delete logic", () => {
    expect(doubleMap.hasKey(1)).toBeTruthy();
    expect(doubleMap.hasValue(4)).toBeTruthy();
    doubleMap.deleteValue(2);
    doubleMap.deleteKey(3);
    expect(doubleMap.hasKey(1)).toBeFalsy();
    expect(doubleMap.hasValue(4)).toBeFalsy();
  });
  it("should clear when call clear()", () => {
    doubleMap.clear();
    expect(doubleMap.size).toBe(0);
  });
  it("should iterate all elements", () => {
    const iterateCallback = jest.fn();
    doubleMap.forEach(iterateCallback);
    expect(iterateCallback).toBeCalledTimes(4);
    expect(iterateCallback).toBeCalledWith({ key: 1, value: 2 }, doubleMap);
    expect(iterateCallback).toBeCalledWith({ key: 3, value: 4 }, doubleMap);
    expect(iterateCallback).toBeCalledWith({ key: 5, value: 6 }, doubleMap);
    expect(iterateCallback).toBeCalledWith({ key: 7, value: 8 }, doubleMap);
  });
  it("should iterate as the sequence", () => {
    const iterateCallback = jest.fn();
    for (const [key, value] of doubleMap) {
      iterateCallback({ key, value });
    }
    expect(iterateCallback).toBeCalledWith({ key: 1, value: 2 });
    expect(iterateCallback).toBeCalledWith({ key: 3, value: 4 });
    expect(iterateCallback).toBeCalledWith({ key: 5, value: 6 });
    expect(iterateCallback).toBeCalledWith({ key: 7, value: 8 });
  });
});
