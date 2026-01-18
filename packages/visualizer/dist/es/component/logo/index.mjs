import { jsx } from "react/jsx-runtime";
import "./index.css";
import sqai_logo from "../../assets/sqai-logo.mjs";
const LogoUrl = sqai_logo;
const Logo = (param)=>{
    let { hideLogo = false } = param;
    if (hideLogo) return null;
    return /*#__PURE__*/ jsx("div", {
        className: "logo",
        children: /*#__PURE__*/ jsx("a", {
            href: "https://sqai.tech",
            target: "_blank",
            rel: "noreferrer",
            children: /*#__PURE__*/ jsx("img", {
                alt: "SQAI Logo",
                src: sqai_logo
            })
        })
    });
};
export { Logo, LogoUrl };
