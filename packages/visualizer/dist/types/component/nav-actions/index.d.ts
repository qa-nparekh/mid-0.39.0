import './style.less';
export interface NavActionsProps {
    showEnvConfig?: boolean;
    showTooltipWhenEmpty?: boolean;
    showModelName?: boolean;
    githubUrl?: string;
    helpUrl?: string;
    className?: string;
}
export declare function NavActions({ showEnvConfig, showTooltipWhenEmpty, showModelName, githubUrl, helpUrl, className, }: NavActionsProps): import("react").JSX.Element;
