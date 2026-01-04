import type { BaseElement, ElementTreeNode, Size, UIContext } from '../../types';
import type { TVlModeTypes } from '@sqaitech/shared/env';
export declare function describeSize(size: Size): string;
export declare function describeElement(elements: (Pick<BaseElement, 'rect' | 'content'> & {
    id: string;
})[]): string;
export declare const distanceThreshold = 16;
export declare function elementByPositionWithElementInfo(treeRoot: ElementTreeNode<BaseElement>, position: {
    x: number;
    y: number;
}, options?: {
    requireStrictDistance?: boolean;
    filterPositionElements?: boolean;
}): BaseElement | undefined;
export declare function distance(point1: {
    x: number;
    y: number;
}, point2: {
    x: number;
    y: number;
}): number;
export declare const samplePageDescription = "\nAnd the page is described as follows:\n====================\nThe size of the page: 1280 x 720\nSome of the elements are marked with a rectangle in the screenshot corresponding to the markerId, some are not.\n\nDescription of all the elements in screenshot:\n<div id=\"969f1637\" markerId=\"1\" left=\"100\" top=\"100\" width=\"100\" height=\"100\"> // The markerId indicated by the rectangle label in the screenshot\n  <h4 id=\"b211ecb2\" markerId=\"5\" left=\"150\" top=\"150\" width=\"90\" height=\"60\">\n    The username is accepted\n  </h4>\n  ...many more\n</div>\n====================\n";
export declare function describeUserPage<ElementType extends BaseElement = BaseElement>(context: Omit<UIContext<ElementType>, 'describer'>, opt: {
    truncateTextLength?: number;
    filterNonTextContent?: boolean;
    domIncluded?: boolean | 'visible-only';
    visibleOnly?: boolean;
    vlMode: TVlModeTypes | undefined;
}): Promise<{
    description: string;
    elementById(idOrIndexId: string): ElementType;
    elementByPosition(position: {
        x: number;
        y: number;
    }, size: {
        width: number;
        height: number;
    }): BaseElement | undefined;
    insertElementByPosition(position: {
        x: number;
        y: number;
    }): ElementType;
    size: {
        width: number;
        height: number;
    };
}>;
