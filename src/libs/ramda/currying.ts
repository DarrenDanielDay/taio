import type {
  AnyArray,
  CutFirst,
  EmptyTuple,
  TupleSlices,
} from "../../types/array";
import type { AnyFunc, Func } from "../../types/concepts";
import { isPlaceholder, Placeholder, _$_ } from "./placeholder";

type PlaceHoldedParams<P extends AnyArray> = P extends EmptyTuple
  ? EmptyTuple
  : [P[0] | Placeholder, ...PlaceHoldedParams<CutFirst<P>>];
type CurryingCall<
  P extends AnyArray,
  R,
  Args extends TupleSlices<PlaceHoldedParams<P>>
> = ApplyArgs<P, Args> extends EmptyTuple ? R : Currying<ApplyArgs<P, Args>, R>;
type ApplyArgs<
  P extends AnyArray,
  Args extends TupleSlices<PlaceHoldedParams<P>>
> = Args extends EmptyTuple
  ? P
  : Args[0] extends Exclude<P[0], Placeholder>
  ? // @ts-expect-error
    ApplyArgs<CutFirst<P>, CutFirst<Args>>
  : // @ts-expect-error
    [Exclude<P[0], Placeholder>, ...ApplyArgs<CutFirst<P>, CutFirst<Args>>];

interface Currying<P extends AnyArray, R> {
  <Args extends TupleSlices<PlaceHoldedParams<P>>>(...args: Args): CurryingCall<
    P,
    R,
    Args
  >;
}

function _currying(fn: AnyFunc, passed: unknown[]) {
  return (...args: unknown[]) => {
    const newPassed = passed.slice();
    const toFill: number[] = [];
    for (let i = 0; i < passed.length; i++) {
      if (isPlaceholder(passed[i])) {
        toFill.push(i);
      }
    }
    for (let i = 0; i < args.length; i++) {
      const index = toFill[i];
      if (index === undefined) {
        break;
      }
      newPassed[index] = args[i];
    }
    if (newPassed.every((param) => !isPlaceholder(param))) {
      return fn.apply(undefined, newPassed);
    } else {
      return _currying(fn, newPassed);
    }
  };
}

export function currying<P extends AnyArray, R>(
  fn: Func<P, R>,
  count?: P["length"]
): Currying<P, R> {
  count = count ?? fn.length;
  const passed: unknown[] = new Array(count).fill(_$_);
  // @ts-expect-error
  return _currying(fn, passed);
}
