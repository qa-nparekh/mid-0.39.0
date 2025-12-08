import type { NodeType } from '../constants';
import type { ElementInfo } from '../extractor';
export interface Point {
    left: number;
    top: number;
}
export interface Size {
    width: number;
    height: number;
    dpr?: number;
}
export type Rect = Point & Size & {
    zoom?: number;
};
export declare abstract class BaseElement {
    abstract id: string;
    abstract indexId?: number;
    abstract attributes: {
        nodeType: NodeType;
        [key: string]: string;
    };
    abstract content: string;
    abstract rect: Rect;
    abstract center: [number, number];
    abstract xpaths?: string[];
    abstract isVisible: boolean;
}
export interface ElementTreeNode<ElementType extends BaseElement = BaseElement> {
    node: ElementType | null;
    children: ElementTreeNode<ElementType>[];
}
export interface WebElementInfo extends ElementInfo {
    zoom: number;
}
