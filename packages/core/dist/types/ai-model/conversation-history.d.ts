import type { ChatCompletionMessageParam } from 'openai/resources/index';
export interface ConversationHistoryOptions {
    maxUserImageMessages?: number;
    initialMessages?: ChatCompletionMessageParam[];
}
export declare class ConversationHistory {
    private readonly maxUserImageMessages;
    private readonly messages;
    constructor(options?: ConversationHistoryOptions);
    append(message: ChatCompletionMessageParam): void;
    seed(messages: ChatCompletionMessageParam[]): void;
    reset(): void;
    snapshot(): ChatCompletionMessageParam[];
    get length(): number;
    [Symbol.iterator](): IterableIterator<ChatCompletionMessageParam>;
    toJSON(): ChatCompletionMessageParam[];
    private pruneOldestUserMessageIfNecessary;
}
