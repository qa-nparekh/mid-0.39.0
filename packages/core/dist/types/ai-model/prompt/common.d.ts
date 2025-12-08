import type { TVlModeTypes } from '@sqai/shared/env';
export declare function bboxDescription(vlMode: TVlModeTypes | undefined): "box_2d bounding box for the target element, should be [ymin, xmin, ymax, xmax] normalized to 0-1000." | "2d bounding box as [xmin, ymin, xmax, ymax]";
