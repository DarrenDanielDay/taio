import { MethodDecoratorContext, WrappedMethod } from "../../decorators/define";
import { ReadonlyOutside } from "../../decorators/limitations";
import { invalidOperation } from "../../internal/exceptions";
import { IContainer } from "../interfaces";

export const ImmutableIteration = WrappedMethod<
  IContainer<any>,
  // @ts-expect-error
  typeof Symbol.iterator
>(
  function* ({
    func,
  }: // @ts-expect-error
  MethodDecoratorContext<IContainer<any>, typeof Symbol.iterator>) {
    const generator = (func as (
      this: IContainer<any>
    ) => Generator<any, void, undefined>).apply(this);
    const lastModified = this.$modified;
    for (
      let iteration = generator.next();
      !iteration.done &&
      (this.$modified === lastModified
        ? true
        : invalidOperation("Container modified in iteration."));
      iteration = generator.next()
    ) {
      yield iteration.value;
    }
  },
  { writable: false }
);
// @ts-expect-error
export const Modified = WrappedMethod<IContainer<any>, keyof any>(function (
  this: IContainer<any>,
  { func },
  ...args
) {
  const result = (func as Function).apply(this, args);
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
export function modify(this: IContainer<any>) {
  readonly$modifier.set(this, "$modified", this.$modified + 1);
}
