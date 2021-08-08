import type { PadStart, Repeat, StringLength } from "../../src/types/string";
import { typeEqual } from "../../src/utils/typed-function";

describe("string types", () => {
  it("should repeate the string", () => {
    expect(typeEqual<Repeat<"a", 20>, "aaaaaaaaaaaaaaaaaaaa">(true)).toBe(true);
    expect(typeEqual<StringLength<Repeat<"a", 20>>, 20>(true)).toBe(true);
    expect(typeEqual<Repeat<"abc", 7>, "abcabcabcabcabcabcabc">(true)).toBe(
      true
    );
  });
  it("should pad start", () => {
    expect(typeEqual<PadStart<"xx", 10>, "        xx">(true)).toBe(true);
    expect(
      typeEqual<PadStart<"xx", 24, "a">, "aaaaaaaaaaaaaaaaaaaaaaxx">(true)
    ).toBe(true);
  });
});
