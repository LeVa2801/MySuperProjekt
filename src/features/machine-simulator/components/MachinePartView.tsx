import { partViews } from "./parts/partRegistry";
import type { PartViewProps } from "./parts/types";

export function MachinePartView(props: PartViewProps) {
  const View = partViews[props.part.kind];
  return <View {...props} />;
}
