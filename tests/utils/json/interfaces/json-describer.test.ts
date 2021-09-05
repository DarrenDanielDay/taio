import type {
  CreateTupleTypeBySchema,
  CreateTypeBySchemaType,
} from "../../../../src/utils/json/interfaces/json-describer";
import { typeEqual } from "../../../../src/utils/typed-function";

describe("JSON Schema", () => {
  it("should generate type", () => {
    expect(
      typeEqual<
        CreateTypeBySchemaType<{
          type: "object";
          fields: {
            a: { type: "literal"; value: 1 };
          };
        }>,
        { a: 1 }
      >(true)
    ).toBe(true);
    expect(
      typeEqual<
        CreateTupleTypeBySchema<
          [{ type: "literal"; value: 1 }, { type: "literal"; value: 2 }]
        >,
        [1, 2]
      >(true)
    ).toBe(true);
    expect(
      typeEqual<
        CreateTypeBySchemaType<{
          type: "union";
          unions: [{ type: "string" }, { type: "number" }];
        }>,
        number | string
      >(true)
    ).toBe(true);
  });
});
