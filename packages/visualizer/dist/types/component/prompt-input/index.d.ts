import './index.less';
import React from 'react';
import type { RunType } from '../../types';
import type { ServiceModeType } from '../../types';
import './index.less';
import type { DeviceAction } from '@sqai/core';
interface PromptInputProps {
    runButtonEnabled: boolean;
    form: any;
    serviceMode: ServiceModeType;
    selectedType: RunType;
    dryMode: boolean;
    stoppable: boolean;
    loading: boolean;
    onRun: () => void;
    onStop: () => void;
    clearPromptAfterRun?: boolean;
    hideDomAndScreenshotOptions?: boolean;
    actionSpace: DeviceAction<any>[];
}
export declare const PromptInput: React.FC<PromptInputProps>;
export {};
