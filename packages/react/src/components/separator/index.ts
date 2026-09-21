export { Separator } from "./separator";
// `SeparatorProps` lives in ./separator.types but is deliberately NOT re-exported
// here: the root barrel star-exports this module and ./resizable, whose
// react-resizable-panels `SeparatorProps` would collide (TS2308).
