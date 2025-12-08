import { jsx } from "react/jsx-runtime";
import "./index.css";
const LogoUrl = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/vhaeh7vhabf/Midscene.png';
const Logo = (param)=>{
    let { hideLogo = false } = param;
    if (hideLogo) return null;
    return /*#__PURE__*/ jsx("div", {
        className: "logo",
        children: /*#__PURE__*/ jsx("a", {
            href: "https://midscenejs.com/",
            target: "_blank",
            rel: "noreferrer",
            children: /*#__PURE__*/ jsx("img", {
                alt: "Midscene_logo",
                src: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhaeh7vhabf/Midscene.png"
            })
        })
    });
};
export { Logo, LogoUrl };
