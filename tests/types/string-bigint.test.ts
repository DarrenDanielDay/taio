import type { ListChar } from "../../src/types/string";
import type {
  BAnd,
  BinaryAnd,
  BinaryOr,
  BinaryXOr,
  BOr,
  BXOr,
  LengthedBinaryAnd,
  LengthedBinaryOr,
  LengthedBinaryXOr,
  MaxBinaryLength,
  ToBinary,
} from "../../src/types/string-bigint";
import { typeEqual } from "../../src/utils/typed-function";

describe("string bigint literal calculation types", () => {
  it("should have type", () => {
    expect(typeEqual<ToBinary<"">, "">(true)).toBe(true);
    expect(typeEqual<ToBinary<"10">, "1010">(true)).toBe(true);
    expect(typeEqual<ToBinary<"1023">, "1111111111">(true)).toBe(true);
    // Max binary currently is 2 ** 24 - 1
    expect(
      typeEqual<ToBinary<"16777215">, "111111111111111111111111">(true)
    ).toBe(true);
    expect(
      typeEqual<ListChar<ToBinary<"16777215">>["length"], MaxBinaryLength>(true)
    ).toBe(true);
  });
  type $15Ones = "111111111111111";
  type $14Zeroes1One = "000000000000001";
  type $15Zeroes = "000000000000000";
  type $14One1Zero = "111111111111110";
  it("should have binary and logic", () => {
    expect(typeEqual<LengthedBinaryAnd<"1", "1">, "1">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryAnd<"1", "0">, "0">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryAnd<"0", "1">, "0">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryAnd<"0", "0">, "0">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryAnd<"11", "00">, "00">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryAnd<"11", "01">, "01">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryAnd<"11", "10">, "10">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryAnd<"11", "11">, "11">(true)).toBe(true);
    // Max binary operation length currently is 15
    expect(typeEqual<LengthedBinaryAnd<$15Ones, $15Ones>, $15Ones>(true)).toBe(
      true
    );
    expect(typeEqual<BinaryAnd<$15Ones, "1">, $14Zeroes1One>(true)).toBe(true);
    expect(typeEqual<BinaryAnd<"1", $15Ones>, $14Zeroes1One>(true)).toBe(true);
    expect(typeEqual<BAnd<32767, 1>, $14Zeroes1One>(true)).toBe(true);
    expect(typeEqual<BAnd<32766, 1>, $15Zeroes>(true)).toBe(true);
  });
  it("should have binary or logic", () => {
    expect(typeEqual<LengthedBinaryOr<"1", "1">, "1">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryOr<"1", "0">, "1">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryOr<"0", "1">, "1">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryOr<"0", "0">, "0">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryOr<"00", "00">, "00">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryOr<"00", "01">, "01">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryOr<"00", "10">, "10">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryOr<"00", "11">, "11">(true)).toBe(true);
    // Max binary operation length currently is 15
    expect(typeEqual<LengthedBinaryOr<$15Ones, $15Ones>, $15Ones>(true)).toBe(
      true
    );
    expect(typeEqual<BinaryOr<$15Ones, "1">, $15Ones>(true)).toBe(true);
    expect(typeEqual<BinaryOr<"1", $15Ones>, $15Ones>(true)).toBe(true);
    expect(typeEqual<BOr<32767, 1>, $15Ones>(true)).toBe(true);
    expect(typeEqual<BOr<32766, 1>, $15Ones>(true)).toBe(true);
  });
  it("should have binary xor logic", () => {
    expect(typeEqual<LengthedBinaryXOr<"1", "1">, "0">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryXOr<"1", "0">, "1">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryXOr<"0", "1">, "1">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryXOr<"0", "0">, "0">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryXOr<"00", "00">, "00">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryXOr<"00", "01">, "01">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryXOr<"00", "10">, "10">(true)).toBe(true);
    expect(typeEqual<LengthedBinaryXOr<"00", "11">, "11">(true)).toBe(true);
    // Max binary operation length currently is 15
    expect(
      typeEqual<LengthedBinaryXOr<$15Ones, $15Ones>, $15Zeroes>(true)
    ).toBe(true);
    expect(typeEqual<BinaryXOr<$15Ones, "1">, $14One1Zero>(true)).toBe(true);
    expect(typeEqual<BinaryXOr<"1", $15Ones>, $14One1Zero>(true)).toBe(true);
    expect(typeEqual<BXOr<32767, 1>, $14One1Zero>(true)).toBe(true);
    expect(typeEqual<BXOr<32766, 1>, $15Ones>(true)).toBe(true);
  });
});
