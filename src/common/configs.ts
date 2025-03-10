import { SvgPanZoomInstance } from "../utility/svg-pan-zoom-ex"
import { LayoutHandler } from "../layouts/handler"
import { RecursivePartial } from "./common"
import { Node, Edge, Edges, Path } from "./types"

type CallableValue<V, T> = V | ((target: T) => V)

type CallableValues<V, T> = {
  [K in keyof V]: CallableValue<V[K], T>
}

export class Config {
  static value<V, T>(value: CallableValue<V, T>, target: T): V {
    return value instanceof Function ? value(target) : value
  }

  static values<V, T>(value: CallableValues<V, T>, target: T): V {
    if (Object.values(value).filter(v => v instanceof Function).length === 0) {
      return value as V // all config are literals
    }
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, v instanceof Function ? v(target) : v])
    ) as V
  }
}

/* View configuration */

export interface GridLine {
  color: string
  width: number
  dasharray?: string | number
}

export interface GridConfig {
  visible: boolean
  interval: number
  thickIncrements: number | false
  line: GridLine
  thick: GridLine
}

export interface ViewConfig {
  scalingObjects: boolean
  panEnabled: boolean
  zoomEnabled: boolean
  minZoomLevel: number
  maxZoomLevel: number
  doubleClickZoomEnabled: boolean
  mouseWheelZoomEnabled: boolean
  fit: boolean
  layoutHandler: LayoutHandler
  onSvgPanZoomInitialized?: (instance: SvgPanZoomInstance) => void
  grid: GridConfig
}

/* Shape style */

export interface ShapeStyleBase {
  strokeWidth: number
  strokeColor?: string
  strokeDasharray?: string | number
  color: string
}

export type ShapeType = "circle" | "rect"

interface CircleShape extends ShapeStyleBase {
  radius: number
}

interface RectangleShape extends ShapeStyleBase {
  width: number
  height: number
  borderRadius: number
}

// `Shape` is an object whose fields can change depending on
// the type value.
// Normally, Union Types would be used, but in order to minimize
// the use of type guards when users build and use the configuration,
// we define it as an object that contains all fields.

type ShapeBase<T extends ShapeType = ShapeType> = {
  type: T
}

export type ShapeStyle = ShapeBase & CircleShape & RectangleShape
export type CircleShapeStyle = ShapeBase<"circle"> & CircleShape
export type RectangleShapeStyle = ShapeBase<"rect"> & RectangleShape
export type AnyShapeStyle = CircleShapeStyle | RectangleShapeStyle

/* Label style */

interface Padding {
  vertical: number
  horizontal: number
}
export interface LabelBackgroundStyle {
  visible: boolean
  color?: string
  padding?: number | Padding
  borderRadius?: number
}

export interface LabelStyle {
  fontFamily?: string
  fontSize: number
  color: string
  background?: LabelBackgroundStyle
  lineHeight: number
}

/* Node style */

export enum NodeLabelDirection {
  CENTER = "center",
  NORTH = "north",
  NORTH_EAST = "north-east",
  EAST = "east",
  SOUTH_EAST = "south-east",
  SOUTH = "south",
  SOUTH_WEST = "south-west",
  WEST = "west",
  NORTH_WEST = "north-west",
}

export type NodeLabelDirectionType = "center" | "north" | "north-east" | "east" | "south-east" | "south" | "south-west" | "west" | "north-west"

export interface NodeLabelStyle extends LabelStyle {
  visible: boolean
  margin: number
  direction: NodeLabelDirectionType
  text: string
}

export interface NodeFocusRingStyle {
  visible: boolean
  width: number
  padding: number
  color: string
  dasharray?: string | number
}

export interface NodeConfig<N extends Node = Node> {
  normal: CallableValues<ShapeStyle, N>
  hover?: CallableValues<ShapeStyle, N>
  selected?: CallableValues<ShapeStyle, N>
  draggable: CallableValue<boolean, N>
  selectable: CallableValue<boolean, N> | number
  label: CallableValues<NodeLabelStyle, N>
  focusring: NodeFocusRingStyle
  transition?: string
}

/* Edge style */

export interface StrokeStyle {
  width: number
  color: string
  dasharray?: string | number
  linecap?: "butt" | "round" | "square"
  animate: boolean
  animationSpeed: number
}

export interface EdgeLabelStyle extends LabelStyle {
  margin: number
  padding: number
}

export type EdgeHeadType = "none" | "arrow" | "angle" | "circle" | "custom"
export type MarkerUnits = "strokeWidth" | "userSpaceOnUse"

export interface MarkerStyle {
  type: EdgeHeadType
  width: number
  height: number
  margin: number
  units: MarkerUnits
  color: string | null
  customId?: string
}

export type EdgeType = "straight" | "curve"

// Orientation to be considered when keeping multiple edge alignments.
//   "clock": Keep the forward/backward when viewed as a clock.
//   "vertical": Keep the vertical alignment.
//   "horizontal": Keep the horizontal alignment.
export type EdgeKeepOrderType = "clock" | "vertical" | "horizontal"

export interface EdgeConfig<E extends Edge = Edge> {
  normal: CallableValues<StrokeStyle, E>
  hover?: CallableValues<StrokeStyle, E>
  selected: CallableValues<StrokeStyle, E>
  selectable: CallableValue<boolean, E> | number
  gap: number | ((edges: Edges, configs: Configs) => number)
  type: EdgeType
  marker: {
    source: CallableValues<MarkerStyle, [E, StrokeStyle]>
    target: CallableValues<MarkerStyle, [E, StrokeStyle]>
  }
  margin: number | null
  summarize: boolean | ((edges: Edges, configs: Configs) => boolean | null)
  summarized: {
    label: CallableValues<LabelStyle, Record<string, E>>
    shape: CallableValues<ShapeStyle, Record<string, E>>
    stroke: CallableValues<StrokeStyle, Record<string, E>>
  }
  keepOrder: EdgeKeepOrderType
  label: EdgeLabelStyle
}

/* Path config */
export interface PathStrokeStyle extends StrokeStyle {
  linejoin: "miter" | "round" | "bevel"
}

export type PathEndType = "centerOfNode" | "edgeOfNode"

export interface PathConfig<P extends Path = Path> {
  visible: boolean
  clickable: boolean
  curveInNode: boolean
  end: PathEndType
  margin: CallableValue<number, P>
  path: CallableValues<PathStrokeStyle, P>
  transition?: string
}

/* Configuration */

export interface Configs<N extends Node = Node, E extends Edge = Edge, P extends Path = Path> {
  view: ViewConfig
  node: NodeConfig<N>
  edge: EdgeConfig<E>
  path: PathConfig<P>
}

/** For specification by the user */
export type UserConfigs<
  N extends Node = Node,
  E extends Edge = Edge,
  P extends Path = Path
> = RecursivePartial<Configs<N, E, P>>

/** Make a config with self object */
export function withSelf<T extends { [name: string]: any }>(callback: (self: T) => T): T {
  const self = {} as T
  return Object.assign(self, callback(self))
}

/** @deprecated */
export function configsWithType<
  N extends Node = Node,
  E extends Edge = Edge,
  P extends Path = Path,
  U extends UserConfigs<N, E, P> = UserConfigs<N, E, P>
>(configs: U): U & UserConfigs<N, E, P> {
  return configs
}

/** Define configurations */
export function defineConfigs<
  N extends Node = Node,
  E extends Edge = Edge,
  P extends Path = Path,
  U extends UserConfigs<N, E, P> = UserConfigs<N, E, P>
>(configs: U): U & UserConfigs<N, E, P> {
  return configs
}
