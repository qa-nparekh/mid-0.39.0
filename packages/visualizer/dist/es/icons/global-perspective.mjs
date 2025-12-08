import { jsx } from "react/jsx-runtime";
import "react";
const SvgGlobalPerspective = (props)=>/*#__PURE__*/ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 16,
        height: 16,
        fill: "none",
        viewBox: "0 0 16 16",
        ...props,
        children: /*#__PURE__*/ jsx("path", {
            fill: "#333",
            d: "M1.333 13v-2.5a.667.667 0 0 1 1.334 0V13c0 .184.149.333.333.333h2.5a.667.667 0 0 1 0 1.334H3c-.92 0-1.667-.746-1.667-1.667m12 0v-2.5a.667.667 0 0 1 1.334 0V13c0 .92-.746 1.667-1.667 1.667h-2.5a.667.667 0 0 1 0-1.334H13a.333.333 0 0 0 .333-.333m-12-7.5V3c0-.92.747-1.667 1.667-1.667h2.5a.667.667 0 0 1 0 1.334H3A.333.333 0 0 0 2.667 3v2.5a.667.667 0 0 1-1.334 0m12 0V3A.333.333 0 0 0 13 2.667h-2.5a.667.667 0 0 1 0-1.334H13c.92 0 1.667.747 1.667 1.667v2.5a.667.667 0 0 1-1.334 0M5.667 10.333h4.666V5.667H5.667zm6 .167c0 .644-.523 1.167-1.167 1.167h-5A1.167 1.167 0 0 1 4.333 10.5v-5c0-.644.523-1.167 1.167-1.167h5c.644 0 1.167.523 1.167 1.167z"
        })
    });
const global_perspective = SvgGlobalPerspective;
export { global_perspective as default };
