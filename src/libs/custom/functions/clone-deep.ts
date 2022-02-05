import {
  CloneDeepBuilder,
  CustomClassCloneDeepPlugin,
  DateCloneDeepPlugin,
  MapCloneDeepPlugin,
  SetCloneDeepPlugin,
} from "../algorithms/search-clone-deep";

export const cloneDeep = new CloneDeepBuilder()
  .withSearch("dfs")
  .withPlugin(new CustomClassCloneDeepPlugin())
  .withPlugin(new DateCloneDeepPlugin())
  .withPlugin(new SetCloneDeepPlugin())
  .withPlugin(new MapCloneDeepPlugin())
  .build();
