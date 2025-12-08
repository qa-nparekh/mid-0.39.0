import type { UIContext } from '@sqai/core';
import type React from 'react';
interface ContextPreviewProps {
    uiContextPreview: UIContext | undefined;
    setUiContextPreview: (context: UIContext) => void;
    showContextPreview: boolean;
}
export declare const ContextPreview: React.FC<ContextPreviewProps>;
export {};
