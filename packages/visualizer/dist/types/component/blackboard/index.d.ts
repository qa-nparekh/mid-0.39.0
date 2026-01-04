import 'pixi.js/unsafe-eval';
import type { BaseElement, Rect, UIContext } from '@sqaitech/core';
import * as PIXI from 'pixi.js';
import './index.less';
export declare const pointMarkForItem: (point: [number, number], type: "highlightPoint") => PIXI.Graphics;
export declare const rectMarkForItem: (rect: Rect, name: string, type: "element" | "searchArea" | "highlight") => (PIXI.Graphics | PIXI.Text)[];
export declare const Blackboard: (props: {
    uiContext: UIContext;
    highlightElements?: BaseElement[];
    highlightRect?: Rect;
    highlightPoints?: [number, number][];
    hideController?: boolean;
    onCanvasClick?: (position: [number, number]) => void;
}) => import("react").JSX.Element;
export default Blackboard;
