import { jsx, jsxs } from "react/jsx-runtime";
import "react";
const SvgMagnifyingGlass = (props)=>/*#__PURE__*/ jsxs("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 19,
        height: 19,
        fill: "none",
        viewBox: "0 0 19 19",
        ...props,
        children: [
            /*#__PURE__*/ jsxs("g", {
                stroke: "#000",
                strokeLinejoin: "round",
                strokeOpacity: 0.65,
                strokeWidth: 1.5,
                clipPath: "url(#magnifying-glass_svg__a)",
                children: [
                    /*#__PURE__*/ jsx("path", {
                        d: "M8.397 14.29a6.375 6.375 0 1 0 0-12.75 6.375 6.375 0 0 0 0 12.75Z"
                    }),
                    /*#__PURE__*/ jsx("path", {
                        strokeLinecap: "round",
                        d: "M10.519 5.42a3 3 0 0 0-2.122-.88 3 3 0 0 0-2.121.88M12.98 12.499l3.182 3.182"
                    })
                ]
            }),
            /*#__PURE__*/ jsx("defs", {
                children: /*#__PURE__*/ jsx("clipPath", {
                    id: "magnifying-glass_svg__a",
                    children: /*#__PURE__*/ jsx("path", {
                        fill: "#fff",
                        d: "M.522.04h18v18h-18z"
                    })
                })
            })
        ]
    });
const magnifying_glass = SvgMagnifyingGlass;
export { magnifying_glass as default };
