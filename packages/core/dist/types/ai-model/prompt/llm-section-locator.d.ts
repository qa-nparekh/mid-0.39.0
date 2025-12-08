import type { TVlModeTypes } from '@sqai/shared/env';
export declare function systemPromptToLocateSection(vlMode: TVlModeTypes | undefined): string;
export declare const sectionLocatorInstruction: ({ sectionDescription, }: {
    sectionDescription: string;
}) => string;
