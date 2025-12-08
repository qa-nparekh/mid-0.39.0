import { jsx, jsxs } from "react/jsx-runtime";
import "react";
const SvgHistory = (props)=>/*#__PURE__*/ jsxs("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 25,
        height: 25,
        fill: "none",
        viewBox: "0 0 25 25",
        ...props,
        children: [
            /*#__PURE__*/ jsx("path", {
                stroke: "#000",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeOpacity: 0.85,
                strokeWidth: 1.33,
                d: "M6.63 9.021c-2.862 6.126 2.197 10.501 6.063 10.501a7 7 0 1 0-6.063-10.5"
            }),
            /*#__PURE__*/ jsx("path", {
                stroke: "#000",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeOpacity: 0.85,
                strokeWidth: 1.33,
                d: "M12.695 8.322v4.203l2.967 2.968"
            })
        ]
    });
const icons_history = SvgHistory;
export { icons_history as default };
