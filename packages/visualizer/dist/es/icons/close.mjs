import { jsx } from "react/jsx-runtime";
import "react";
const SvgClose = (props)=>/*#__PURE__*/ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 18,
        height: 16,
        fill: "none",
        viewBox: "0 0 18 16",
        ...props,
        children: /*#__PURE__*/ jsx("path", {
            stroke: "#333",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.333,
            d: "m3.124 2.667 11.162 10.666M3.124 13.333 14.286 2.667"
        })
    });
const icons_close = SvgClose;
export { icons_close as default };
