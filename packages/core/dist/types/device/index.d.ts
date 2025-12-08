import type { DeviceAction, LocateResultElement } from '../types';
import type { ElementNode } from '@sqai/shared/extractor';
import { z } from 'zod';
import type { ElementCacheFeature, Rect, Size, UIContext } from '../types';
export declare abstract class AbstractInterface {
    abstract interfaceType: string;
    abstract screenshotBase64(): Promise<string>;
    abstract size(): Promise<Size>;
    abstract actionSpace(): DeviceAction[] | Promise<DeviceAction[]>;
    abstract cacheFeatureForRect?(rect: Rect, opt?: {
        _orderSensitive: boolean;
    }): Promise<ElementCacheFeature>;
    abstract rectMatchesCacheFeature?(feature: ElementCacheFeature): Promise<Rect>;
    abstract destroy?(): Promise<void>;
    abstract describe?(): string;
    abstract beforeInvokeAction?(actionName: string, param: any): Promise<void>;
    abstract afterInvokeAction?(actionName: string, param: any): Promise<void>;
    abstract getElementsNodeTree?: () => Promise<ElementNode>;
    abstract url?: () => string | Promise<string>;
    abstract evaluateJavaScript?<T = any>(script: string): Promise<T>;
    abstract getContext?(): Promise<UIContext>;
}
export declare const defineAction: <TSchema extends z.ZodType, TRuntime = z.infer<TSchema>>(config: {
    name: string;
    description: string;
    interfaceAlias?: string;
    paramSchema: TSchema;
    call: (param: TRuntime) => Promise<void>;
} & Partial<Omit<DeviceAction<TRuntime>, "name" | "description" | "interfaceAlias" | "paramSchema" | "call">>) => DeviceAction<TRuntime>;
export declare const actionTapParamSchema: z.ZodObject<{
    locate: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}>;
export type ActionTapParam = {
    locate: LocateResultElement;
};
export declare const defineActionTap: (call: (param: ActionTapParam) => Promise<void>) => DeviceAction<ActionTapParam>;
export declare const actionRightClickParamSchema: z.ZodObject<{
    locate: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}>;
export type ActionRightClickParam = {
    locate: LocateResultElement;
};
export declare const defineActionRightClick: (call: (param: ActionRightClickParam) => Promise<void>) => DeviceAction<ActionRightClickParam>;
export declare const actionDoubleClickParamSchema: z.ZodObject<{
    locate: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}>;
export type ActionDoubleClickParam = {
    locate: LocateResultElement;
};
export declare const defineActionDoubleClick: (call: (param: ActionDoubleClickParam) => Promise<void>) => DeviceAction<ActionDoubleClickParam>;
export declare const actionHoverParamSchema: z.ZodObject<{
    locate: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}>;
export type ActionHoverParam = {
    locate: LocateResultElement;
};
export declare const defineActionHover: (call: (param: ActionHoverParam) => Promise<void>) => DeviceAction<ActionHoverParam>;
export declare const actionInputParamSchema: z.ZodObject<{
    value: z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber]>, string, string | number>;
    locate: z.ZodOptional<z.ZodObject<{
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
    }, z.ZodTypeAny, "passthrough">>>;
    mode: z.ZodOptional<z.ZodDefault<z.ZodEnum<["replace", "clear", "append"]>>>;
}, "strip", z.ZodTypeAny, {
    value: string;
    locate?: z.objectOutputType<{
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
    }, z.ZodTypeAny, "passthrough"> | undefined;
    mode?: "replace" | "clear" | "append" | undefined;
}, {
    value: string | number;
    locate?: z.objectInputType<{
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
    }, z.ZodTypeAny, "passthrough"> | undefined;
    mode?: "replace" | "clear" | "append" | undefined;
}>;
export type ActionInputParam = {
    value: string;
    locate?: LocateResultElement;
    mode?: 'replace' | 'clear' | 'append';
};
export declare const defineActionInput: (call: (param: ActionInputParam) => Promise<void>) => DeviceAction<ActionInputParam>;
export declare const actionKeyboardPressParamSchema: z.ZodObject<{
    locate: z.ZodOptional<z.ZodObject<{
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
    }, z.ZodTypeAny, "passthrough">>>;
    keyName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    keyName: string;
    locate?: z.objectOutputType<{
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
    }, z.ZodTypeAny, "passthrough"> | undefined;
}, {
    keyName: string;
    locate?: z.objectInputType<{
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
    }, z.ZodTypeAny, "passthrough"> | undefined;
}>;
export type ActionKeyboardPressParam = {
    locate?: LocateResultElement;
    keyName: string;
};
export declare const defineActionKeyboardPress: (call: (param: ActionKeyboardPressParam) => Promise<void>) => DeviceAction<ActionKeyboardPressParam>;
export declare const actionScrollParamSchema: z.ZodObject<{
    direction: z.ZodDefault<z.ZodEnum<["down", "up", "right", "left"]>>;
    scrollType: z.ZodDefault<z.ZodEnum<["once", "untilBottom", "untilTop", "untilRight", "untilLeft"]>>;
    distance: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    locate: z.ZodOptional<z.ZodObject<{
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
    }, z.ZodTypeAny, "passthrough">>>;
}, "strip", z.ZodTypeAny, {
    direction: "left" | "right" | "down" | "up";
    scrollType: "once" | "untilBottom" | "untilTop" | "untilRight" | "untilLeft";
    locate?: z.objectOutputType<{
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
    }, z.ZodTypeAny, "passthrough"> | undefined;
    distance?: number | null | undefined;
}, {
    locate?: z.objectInputType<{
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
    }, z.ZodTypeAny, "passthrough"> | undefined;
    direction?: "left" | "right" | "down" | "up" | undefined;
    scrollType?: "once" | "untilBottom" | "untilTop" | "untilRight" | "untilLeft" | undefined;
    distance?: number | null | undefined;
}>;
export type ActionScrollParam = {
    direction?: 'down' | 'up' | 'right' | 'left';
    scrollType?: 'once' | 'untilBottom' | 'untilTop' | 'untilRight' | 'untilLeft';
    distance?: number | null;
    locate?: LocateResultElement;
};
export declare const defineActionScroll: (call: (param: ActionScrollParam) => Promise<void>) => DeviceAction<ActionScrollParam>;
export declare const actionDragAndDropParamSchema: z.ZodObject<{
    from: z.ZodObject<{
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
    to: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    from: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
    to: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}, {
    from: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
    to: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}>;
export type ActionDragAndDropParam = {
    from: LocateResultElement;
    to: LocateResultElement;
};
export declare const defineActionDragAndDrop: (call: (param: ActionDragAndDropParam) => Promise<void>) => DeviceAction<ActionDragAndDropParam>;
export declare const ActionLongPressParamSchema: z.ZodObject<{
    locate: z.ZodObject<{
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
    duration: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
    duration?: number | undefined;
}, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
    duration?: number | undefined;
}>;
export type ActionLongPressParam = {
    locate: LocateResultElement;
    duration?: number;
};
export declare const defineActionLongPress: (call: (param: ActionLongPressParam) => Promise<void>) => DeviceAction<ActionLongPressParam>;
export declare const ActionSwipeParamSchema: z.ZodObject<{
    start: z.ZodOptional<z.ZodObject<{
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
    }, z.ZodTypeAny, "passthrough">>>;
    direction: z.ZodOptional<z.ZodEnum<["up", "down", "left", "right"]>>;
    distance: z.ZodOptional<z.ZodNumber>;
    end: z.ZodOptional<z.ZodObject<{
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
    }, z.ZodTypeAny, "passthrough">>>;
    duration: z.ZodDefault<z.ZodNumber>;
    repeat: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    duration: number;
    repeat?: number | undefined;
    direction?: "left" | "right" | "down" | "up" | undefined;
    distance?: number | undefined;
    start?: z.objectOutputType<{
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
    }, z.ZodTypeAny, "passthrough"> | undefined;
    end?: z.objectOutputType<{
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
    }, z.ZodTypeAny, "passthrough"> | undefined;
}, {
    repeat?: number | undefined;
    direction?: "left" | "right" | "down" | "up" | undefined;
    distance?: number | undefined;
    duration?: number | undefined;
    start?: z.objectInputType<{
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
    }, z.ZodTypeAny, "passthrough"> | undefined;
    end?: z.objectInputType<{
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
    }, z.ZodTypeAny, "passthrough"> | undefined;
}>;
export type ActionSwipeParam = {
    start?: LocateResultElement;
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
    end?: LocateResultElement;
    duration?: number;
    repeat?: number;
};
export declare const defineActionSwipe: (call: (param: ActionSwipeParam) => Promise<void>) => DeviceAction<ActionSwipeParam>;
export declare const actionClearInputParamSchema: z.ZodObject<{
    locate: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}, {
    locate: {
        prompt: string | ({
            prompt: string;
        } & {
            images?: {
                name: string;
                url: string;
            }[] | undefined;
            convertHttpImage2Base64?: boolean | undefined;
        });
        cacheable?: boolean | undefined;
        deepThink?: boolean | undefined;
        xpath?: string | boolean | undefined;
    } & {
        [k: string]: unknown;
    };
}>;
export type ActionClearInputParam = {
    locate: LocateResultElement;
};
export declare const defineActionClearInput: (call: (param: ActionClearInputParam) => Promise<void>) => DeviceAction<ActionClearInputParam>;
export type { DeviceAction } from '../types';
