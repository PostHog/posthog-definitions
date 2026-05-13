import type { ButtonTile, Layout, TextTile } from "./types.js";

export function text(spec: { body: string; layout: Layout }): TextTile {
  return { kind: "text", body: spec.body, layout: spec.layout };
}

export function button(spec: {
  url: string;
  text: string;
  layout: Layout;
  placement?: "left" | "right";
  style?: "primary" | "secondary";
}): ButtonTile {
  return {
    kind: "button",
    url: spec.url,
    text: spec.text,
    layout: spec.layout,
    placement: spec.placement,
    style: spec.style,
  };
}
