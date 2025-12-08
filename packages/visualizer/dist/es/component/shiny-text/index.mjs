import { jsx } from "react/jsx-runtime";
import "./index.css";
const ShinyText = (param)=>{
    let { text, disabled = false, speed = 5, className = '' } = param;
    const style = {
        '--animation-duration': `${speed}s`
    };
    return /*#__PURE__*/ jsx("div", {
        className: `shiny-text ${disabled ? 'disabled' : ''} ${className}`,
        style: style,
        children: text
    });
};
const shiny_text = ShinyText;
export { shiny_text as default };
