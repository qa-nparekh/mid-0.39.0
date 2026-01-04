import type { BaseElement, DeviceAction, ElementTreeNode, MidsceneYamlFlowItem, PlanningAction, Rect, Size } from '../types';
import type { ChatCompletionMessageParam } from 'openai/resources/index';
import type { PlanningLocateParam } from '../types';
import type { TVlModeTypes } from '@sqaitech/shared/env';
import { z } from 'zod';
export type AIArgs = ChatCompletionMessageParam[];
export declare enum AIActionType {
    ASSERT = 0,
    INSPECT_ELEMENT = 1,
    EXTRACT_DATA = 2,
    PLAN = 3,
    DESCRIBE_ELEMENT = 4,
    TEXT = 5
}
export declare function fillBboxParam(locate: PlanningLocateParam, width: number, height: number, rightLimit: number, bottomLimit: number, vlMode: TVlModeTypes | undefined): PlanningLocateParam;
export declare function adaptQwenBbox(bbox: number[]): [number, number, number, number];
export declare function adaptDoubaoBbox(bbox: string[] | number[] | string, width: number, height: number): [number, number, number, number];
export declare function adaptBbox(bbox: number[], width: number, height: number, rightLimit: number, bottomLimit: number, vlMode: TVlModeTypes | undefined): [number, number, number, number];
export declare function normalized01000(bbox: number[], width: number, height: number): [number, number, number, number];
export declare function adaptGeminiBbox(bbox: number[], width: number, height: number): [number, number, number, number];
export declare function adaptBboxToRect(bbox: number[], width: number, height: number, offsetX?: number, offsetY?: number, rightLimit?: number, bottomLimit?: number, vlMode?: TVlModeTypes | undefined): Rect;
export declare function warnGPT4oSizeLimit(size: Size, modelName: string): void;
export declare function mergeRects(rects: Rect[]): {
    left: number;
    top: number;
    width: number;
    height: number;
};
export declare function expandSearchArea(rect: Rect, screenSize: Size, vlMode: TVlModeTypes | undefined): Rect;
export declare function markupImageForLLM(screenshotBase64: string, tree: ElementTreeNode<BaseElement>, size: Size): Promise<string>;
export declare function buildYamlFlowFromPlans(plans: PlanningAction[], actionSpace: DeviceAction<any>[], sleep?: number): MidsceneYamlFlowItem[];
export declare const PointSchema: z.ZodObject<{
    left: z.ZodNumber;
    top: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    left: number;
    top: number;
}, {
    left: number;
    top: number;
}>;
export declare const SizeSchema: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    dpr: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    dpr?: number | undefined;
}, {
    width: number;
    height: number;
    dpr?: number | undefined;
}>;
export declare const RectSchema: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
    left: z.ZodNumber;
    top: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    left: number;
    top: number;
}, {
    left: number;
    top: number;
}>, z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
    dpr: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    dpr?: number | undefined;
}, {
    width: number;
    height: number;
    dpr?: number | undefined;
}>>, z.ZodObject<{
    zoom: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    zoom?: number | undefined;
}, {
    zoom?: number | undefined;
}>>;
export declare const TMultimodalPromptSchema: z.ZodObject<{
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        url: string;
    }, {
        name: string;
        url: string;
    }>, "many">>;
    convertHttpImage2Base64: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    images?: {
        name: string;
        url: string;
    }[] | undefined;
    convertHttpImage2Base64?: boolean | undefined;
}, {
    images?: {
        name: string;
        url: string;
    }[] | undefined;
    convertHttpImage2Base64?: boolean | undefined;
}>;
export declare const TUserPromptSchema: z.ZodUnion<[z.ZodString, z.ZodIntersection<z.ZodObject<{
    prompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    prompt: string;
}, {
    prompt: string;
}>, z.ZodObject<{
    images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        url: string;
    }, {
        name: string;
        url: string;
    }>, "many">>>;
    convertHttpImage2Base64: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    images?: {
        name: string;
        url: string;
    }[] | undefined;
    convertHttpImage2Base64?: boolean | undefined;
}, {
    images?: {
        name: string;
        url: string;
    }[] | undefined;
    convertHttpImage2Base64?: boolean | undefined;
}>>]>;
export type TMultimodalPrompt = z.infer<typeof TMultimodalPromptSchema>;
export type TUserPrompt = z.infer<typeof TUserPromptSchema>;
declare const MidsceneLocationInput: z.ZodObject<{
    prompt: z.ZodUnion<[z.ZodString, z.ZodIntersection<z.ZodObject<{
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
    }, {
        prompt: string;
    }>, z.ZodObject<{
        images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url: string;
        }, {
            name: string;
            url: string;
        }>, "many">>>;
        convertHttpImage2Base64: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }>>]>;
    deepThink: z.ZodOptional<z.ZodBoolean>;
    cacheable: z.ZodOptional<z.ZodBoolean>;
    xpath: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    prompt: z.ZodUnion<[z.ZodString, z.ZodIntersection<z.ZodObject<{
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
    }, {
        prompt: string;
    }>, z.ZodObject<{
        images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url: string;
        }, {
            name: string;
            url: string;
        }>, "many">>>;
        convertHttpImage2Base64: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }>>]>;
    deepThink: z.ZodOptional<z.ZodBoolean>;
    cacheable: z.ZodOptional<z.ZodBoolean>;
    xpath: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    prompt: z.ZodUnion<[z.ZodString, z.ZodIntersection<z.ZodObject<{
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
    }, {
        prompt: string;
    }>, z.ZodObject<{
        images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url: string;
        }, {
            name: string;
            url: string;
        }>, "many">>>;
        convertHttpImage2Base64: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }>>]>;
    deepThink: z.ZodOptional<z.ZodBoolean>;
    cacheable: z.ZodOptional<z.ZodBoolean>;
    xpath: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>;
}, z.ZodTypeAny, "passthrough">>;
declare const MidsceneLocationResult: z.ZodObject<{
    SQAI_location_field_flag: z.ZodLiteral<true>;
    prompt: z.ZodUnion<[z.ZodString, z.ZodIntersection<z.ZodObject<{
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
    }, {
        prompt: string;
    }>, z.ZodObject<{
        images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url: string;
        }, {
            name: string;
            url: string;
        }>, "many">>>;
        convertHttpImage2Base64: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }>>]>;
    deepThink: z.ZodOptional<z.ZodBoolean>;
    cacheable: z.ZodOptional<z.ZodBoolean>;
    xpath: z.ZodOptional<z.ZodBoolean>;
    center: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    rect: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
        left: z.ZodNumber;
        top: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        left: number;
        top: number;
    }, {
        left: number;
        top: number;
    }>, z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        dpr: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        dpr?: number | undefined;
    }, {
        width: number;
        height: number;
        dpr?: number | undefined;
    }>>, z.ZodObject<{
        zoom: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        zoom?: number | undefined;
    }, {
        zoom?: number | undefined;
    }>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    SQAI_location_field_flag: z.ZodLiteral<true>;
    prompt: z.ZodUnion<[z.ZodString, z.ZodIntersection<z.ZodObject<{
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
    }, {
        prompt: string;
    }>, z.ZodObject<{
        images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url: string;
        }, {
            name: string;
            url: string;
        }>, "many">>>;
        convertHttpImage2Base64: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }>>]>;
    deepThink: z.ZodOptional<z.ZodBoolean>;
    cacheable: z.ZodOptional<z.ZodBoolean>;
    xpath: z.ZodOptional<z.ZodBoolean>;
    center: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    rect: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
        left: z.ZodNumber;
        top: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        left: number;
        top: number;
    }, {
        left: number;
        top: number;
    }>, z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        dpr: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        dpr?: number | undefined;
    }, {
        width: number;
        height: number;
        dpr?: number | undefined;
    }>>, z.ZodObject<{
        zoom: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        zoom?: number | undefined;
    }, {
        zoom?: number | undefined;
    }>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    SQAI_location_field_flag: z.ZodLiteral<true>;
    prompt: z.ZodUnion<[z.ZodString, z.ZodIntersection<z.ZodObject<{
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
    }, {
        prompt: string;
    }>, z.ZodObject<{
        images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url: string;
        }, {
            name: string;
            url: string;
        }>, "many">>>;
        convertHttpImage2Base64: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }>>]>;
    deepThink: z.ZodOptional<z.ZodBoolean>;
    cacheable: z.ZodOptional<z.ZodBoolean>;
    xpath: z.ZodOptional<z.ZodBoolean>;
    center: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    rect: z.ZodIntersection<z.ZodIntersection<z.ZodObject<{
        left: z.ZodNumber;
        top: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        left: number;
        top: number;
    }, {
        left: number;
        top: number;
    }>, z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
        dpr: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        dpr?: number | undefined;
    }, {
        width: number;
        height: number;
        dpr?: number | undefined;
    }>>, z.ZodObject<{
        zoom: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        zoom?: number | undefined;
    }, {
        zoom?: number | undefined;
    }>>;
}, z.ZodTypeAny, "passthrough">>;
export type MidsceneLocationResultType = z.infer<typeof MidsceneLocationResult>;
export type MidsceneLocationInputType = z.infer<typeof MidsceneLocationInput>;
/**
 * Returns the schema for locator fields.
 * This now returns the input schema which is more permissive and suitable for validation.
 */
export declare const getMidsceneLocationSchema: () => z.ZodObject<{
    prompt: z.ZodUnion<[z.ZodString, z.ZodIntersection<z.ZodObject<{
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
    }, {
        prompt: string;
    }>, z.ZodObject<{
        images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url: string;
        }, {
            name: string;
            url: string;
        }>, "many">>>;
        convertHttpImage2Base64: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }>>]>;
    deepThink: z.ZodOptional<z.ZodBoolean>;
    cacheable: z.ZodOptional<z.ZodBoolean>;
    xpath: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    prompt: z.ZodUnion<[z.ZodString, z.ZodIntersection<z.ZodObject<{
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
    }, {
        prompt: string;
    }>, z.ZodObject<{
        images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url: string;
        }, {
            name: string;
            url: string;
        }>, "many">>>;
        convertHttpImage2Base64: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }>>]>;
    deepThink: z.ZodOptional<z.ZodBoolean>;
    cacheable: z.ZodOptional<z.ZodBoolean>;
    xpath: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    prompt: z.ZodUnion<[z.ZodString, z.ZodIntersection<z.ZodObject<{
        prompt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
    }, {
        prompt: string;
    }>, z.ZodObject<{
        images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            url: string;
        }, {
            name: string;
            url: string;
        }>, "many">>>;
        convertHttpImage2Base64: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }, {
        images?: {
            name: string;
            url: string;
        }[] | undefined;
        convertHttpImage2Base64?: boolean | undefined;
    }>>]>;
    deepThink: z.ZodOptional<z.ZodBoolean>;
    cacheable: z.ZodOptional<z.ZodBoolean>;
    xpath: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>;
}, z.ZodTypeAny, "passthrough">>;
export declare const ifMidsceneLocatorField: (field: any) => boolean;
export declare const dumpMidsceneLocatorField: (field: any) => string;
export declare const findAllMidsceneLocatorField: (zodType?: z.ZodType<any>, requiredOnly?: boolean) => string[];
export declare const dumpActionParam: (jsonObject: Record<string, any>, zodSchema: z.ZodType<any>) => Record<string, any>;
export declare const loadActionParam: (jsonObject: Record<string, any>, zodSchema: z.ZodType<any>) => Record<string, any>;
/**
 * Parse and validate action parameters using Zod schema.
 * All fields are validated through Zod, EXCEPT locator fields which are skipped.
 * Default values defined in the schema are automatically applied.
 *
 * Locator fields are special business logic fields with complex validation requirements,
 * so they are intentionally excluded from Zod parsing and use existing validation logic.
 */
export declare const parseActionParam: (rawParam: Record<string, any>, zodSchema: z.ZodType<any>) => Record<string, any>;
export {};
