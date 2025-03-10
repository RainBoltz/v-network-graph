import { RecursivePartial } from "./common"

/* ------------------------------------------ *
 * Network graph elements
 * ------------------------------------------ */

export interface Node {
  name?: string
  // any properties
  [x: string]: any
}

export type Nodes = Record<string, Node>

export interface Edge {
  source: string
  target: string
  // any properties
  [x: string]: any
}

export type Edges = Record<string, Edge>

export interface LinePosition {
  x1: number
  y1: number
  x2: number
  y2: number
}

export type LayerPosition =
  "paths"
  | "nodes"
  | "focusring"
  | "edges"
  | "base"
  | "grid"
  | "background"
  | "root"
export const LayerPositions: readonly LayerPosition[] = [
  "paths",
  "nodes",
  "focusring",
  "edges",
  "base",
  "grid",
  "background",
  "root",
]
export type Layers = Record<string, LayerPosition>

/* ------------------------------------------ *
 * Layouts
 * ------------------------------------------ */

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface FixablePosition extends Position {
  fixed?: boolean
}

export type NodePositions = Record<string, FixablePosition>

export interface Layouts {
  nodes: NodePositions
}
/** ユーザ指定用 optionalな指定のためのinterface */
export type UserLayouts = RecursivePartial<Layouts>

/* ------------------------------------------ *
 * Edge labels
 * ------------------------------------------ */

export interface EdgeLabelArea {
  source: {
    above: Position
    below: Position
  }
  target: {
    above: Position
    below: Position
  }
}

/* ------------------------------------------ *
 * Paths
 * ------------------------------------------ */

export interface Path {
  edges: string[]
  // any properties
  [x: string]: any
}

export type Paths = Path[]

// line: point | curve: [control-point, control-point, target-point] | move to next point: null
export type PositionOrCurve = Position | Position[] | null

/* ------------------------------------------ *
 * Events
 * ------------------------------------------ */

export type ViewEvent<T extends Event> = { event: T }
export type NodeEvent<T extends Event> = { node: string; event: T }
export type EdgeEvent<T extends Event> = { edge: string; edges: string[], summarized: false; event: T } | { edge?: undefined, edges: string[]; summarized: true; event: T }
export type PathEvent<T extends Event> = { path: Path, event: T }

// For compatibility with previous versions
export type NodePointerEvent = NodeEvent<PointerEvent>
export type EdgePointerEvent = EdgeEvent<PointerEvent>

export type Events = {
  "view:load": undefined
  "view:unload": undefined
  "view:mode": "default" | "node" | "edge"
  "view:zoom": number
  "view:pan": { x: number; y: number }
  "view:fit": undefined
  "view:resize": { x: number; y: number; width: number; height: number }
  "view:click": ViewEvent<MouseEvent>
  "view:dblclick": ViewEvent<MouseEvent>
  "view:contextmenu": ViewEvent<MouseEvent>
  "node:click": NodeEvent<MouseEvent>
  "node:dblclick": NodeEvent<MouseEvent>
  "node:pointerover": NodeEvent<PointerEvent>
  "node:pointerout": NodeEvent<PointerEvent>
  "node:pointerup": NodeEvent<PointerEvent>
  "node:pointerdown": NodeEvent<PointerEvent>
  "node:contextmenu": NodeEvent<MouseEvent>
  "node:dragstart": { [name: string]: Position }
  "node:pointermove": { [name: string]: Position }
  "node:dragend": { [name: string]: Position }
  "node:select": string[]
  "edge:pointerup": EdgeEvent<PointerEvent>
  "edge:pointerdown": EdgeEvent<PointerEvent>
  "edge:click": EdgeEvent<MouseEvent>
  "edge:dblclick": EdgeEvent<MouseEvent>
  "edge:pointerover": EdgeEvent<PointerEvent>
  "edge:pointerout": EdgeEvent<PointerEvent>
  "edge:contextmenu": EdgeEvent<MouseEvent>
  "edge:select": string[]
  "path:click": PathEvent<MouseEvent>
  "path:dblclick": PathEvent<MouseEvent>
  "path:contextmenu": PathEvent<MouseEvent>
}

export type EventHandlers = {
  "*"?: <T extends keyof Events>(type: T, event: Events[T]) => void
} & {
  [K in keyof Events]?: (event: Events[K]) => void
}

export type OnClickHandler = (param: NodeEvent<MouseEvent>) => void
export type OnDragHandler = (param: { [name: string]: Position }) => void

/* ------------------------------------------ *
 * SVG area
 * ------------------------------------------ */

export interface Point {
  x: number
  y: number
}

export interface Sizes {
  width: number
  height: number
  viewBox: {
    x: number
    y: number
    width: number
    height: number
  }
}
