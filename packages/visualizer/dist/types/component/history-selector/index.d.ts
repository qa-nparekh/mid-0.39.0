import type React from 'react';
import type { HistoryItem } from '../../store/history';
import './index.less';
interface HistorySelectorProps {
    onSelect: (history: HistoryItem) => void;
    history: HistoryItem[];
    currentType: string;
}
export declare const HistorySelector: React.FC<HistorySelectorProps>;
export {};
