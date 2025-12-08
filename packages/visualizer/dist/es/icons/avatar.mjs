import { jsx, jsxs } from "react/jsx-runtime";
import "react";
const SvgAvatar = (props)=>/*#__PURE__*/ jsxs("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 20,
        height: 20,
        fill: "none",
        "aria-label": "Playground",
        viewBox: "0 0 20 20",
        ...props,
        children: [
            /*#__PURE__*/ jsx("rect", {
                width: 20,
                height: 20,
                fill: "#2B83FF",
                rx: 10
            }),
            /*#__PURE__*/ jsx("path", {
                fill: "#2B83FF",
                stroke: "#fff",
                strokeLinejoin: "round",
                strokeWidth: 1.125,
                d: "M6.866 5.882a.56.56 0 0 1 .667-.078l3.248 1.875 3.247 1.875a.563.563 0 0 1 0 .974l-3.247 1.875-3.248 1.875a.563.563 0 0 1-.784-.74l1.749-3.497-1.75-3.498a.56.56 0 0 1 .118-.661Z"
            })
        ]
    });
const avatar = SvgAvatar;
export { avatar as default };
