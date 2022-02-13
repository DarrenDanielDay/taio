import {
  hasNone,
  hasSome,
  match,
  none,
  some,
} from "../../../../../src/libs/custom/data-structure/common/option";
import { identity } from "../../../../../src/libs/custom/functions/identity";

describe("option logic", () => {
  it("should match some", () => {
    const fail = jest.fn<number, []>(() => -1);
    const success = jest.fn<number, [number]>(identity);
    const option = some(1);
    expect(hasSome(option)).toBe(true);
    expect(match(option, success, fail)).toBe(1);
    expect(success).toBeCalledTimes(1);
    expect(fail).not.toBeCalled();
  });
  it("should match none", () => {
    const fail = jest.fn<number, []>(() => -1);
    const success = jest.fn<number, [number]>(identity);
    const option = none();
    expect(hasNone(option)).toBe(true);
    expect(match(option, success, fail)).toBe(-1);
    expect(success).not.toBeCalled();
    expect(fail).toBeCalledTimes(1);
  });
});
