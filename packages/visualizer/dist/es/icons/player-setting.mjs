import { jsx, jsxs } from "react/jsx-runtime";
import "react";
const SvgPlayerSetting = (props)=>/*#__PURE__*/ jsxs("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 16,
        height: 16,
        fill: "none",
        viewBox: "0 0 16 16",
        ...props,
        children: [
            /*#__PURE__*/ jsx("path", {
                stroke: "#333",
                strokeLinejoin: "round",
                strokeWidth: 1.333,
                d: "M11.333 13.667 14.667 8l-3.334-5.667H4.667L1.333 8l3.334 5.667z"
            }),
            /*#__PURE__*/ jsx("path", {
                stroke: "#333",
                strokeLinejoin: "round",
                strokeWidth: 1.333,
                d: "M8 9.667a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334Z"
            })
        ]
    });
const player_setting = SvgPlayerSetting;
export { player_setting as default };
