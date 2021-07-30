import type { MethodDecoratorContext } from "../../decorators/define";
import { WrappedMethod } from "../../decorators/define";
import { ReadonlyOutside } from "../../decorators/limitations";
import { invalidOperation } from "../../internal/exceptions";
import type { MethodKeys } from "../../types/concepts";
import type { IContainer } from "../interfaces/schema";

export const ImmutableIteration = WrappedMethod<
  IContainer<unknown>,
  typeof Symbol.iterator
>(
  function* ({
    func,
  }: MethodDecoratorContext<
    IContainer<unknown>,
    typeof Symbol.iterator
  >): Generator<unknown, void, undefined> {
    const lastModified = this.$modified;
    const generator = func.apply(this);
    for (
      let iterator = generator.next();
      !iterator.done;
      iterator = generator.next()
    ) {
      yield iterator.value;
      if (this.$modified !== lastModified) {
        return invalidOperation("Container modified in iteration.");
      }
    }
  },
  { writable: false }
);

export const Modified = WrappedMethod<
  IContainer<unknown>,
  MethodKeys<IContainer<unknown>>
>(function (this: IContainer<unknown>, { func }, ...args) {
  const result = func.apply(this, args);
  modify.apply(this);
  return result;
});
const readonly$modifier = ReadonlyOutside<IContainer<unknown>>({
  enumerable: false,
  configurable: false,
});
export const iteration = {
  modifier: readonly$modifier.decorate<"$modified">(0),
};
export function modify(this: IContainer<unknown>) {
  readonly$modifier.set(this, "$modified", this.$modified + 1);
}
