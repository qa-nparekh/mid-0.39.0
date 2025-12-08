import { jsx } from "react/jsx-runtime";
import "react";
const SvgSetting = (props)=>/*#__PURE__*/ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 27,
        height: 27,
        fill: "none",
        viewBox: "0 0 27 27",
        ...props,
        children: /*#__PURE__*/ jsx("path", {
            stroke: "#000",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeOpacity: 0.85,
            strokeWidth: 1.333,
            d: "M19.527 8.855h-2M14.86 7.522v2.667M14.86 8.855H7.527M10.194 13.522H7.527M12.86 12.189v2.666M20.193 13.522H12.86M19.527 18.189h-2M14.86 16.855v2.667M14.86 18.189H7.527"
        })
    });
const setting = SvgSetting;
export { setting as default };
