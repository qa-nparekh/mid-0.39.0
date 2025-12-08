import { jsx } from "react/jsx-runtime";
import "./shiny-text.css";
const ShinyText = ({ text, disabled = false, speed = 5, className = '' })=>{
    const style = {
        '--animation-duration': `${speed}s`
    };
    return /*#__PURE__*/ jsx("div", {
        className: `shiny-text ${disabled ? 'disabled' : ''} ${className}`,
        style: style,
        children: text
    });
};
export { ShinyText };
