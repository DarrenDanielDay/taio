import { TypedReflect } from "../../src/libs/typescript/reflect";
import { overwriteDescriptorConfig } from "../../src/utils/object-operation";

describe("overwrite descriptor", () => {
  it("should merge", () => {
    const foo = { a: 0 };
    const descriptor = TypedReflect.getOwnPropertyDescriptor(foo, "a")!;
    const overwritten = overwriteDescriptorConfig(
      { configurable: false, enumerable: false, writable: false },
      descriptor
    );
    expect(overwritten).not.toStrictEqual(descriptor);
  });
  it("should not merge", () => {
    const foo = { a: 0 };
    const descriptor = TypedReflect.getOwnPropertyDescriptor(foo, "a")!;
    const overwritten = overwriteDescriptorConfig({}, descriptor);
    expect(overwritten).toStrictEqual(descriptor);
  });
});
