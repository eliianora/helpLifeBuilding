import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-logo-DVSES6xW.js
var import_jsx_runtime = require_jsx_runtime();
/** Logo officiel Help Life Building (public/logo2.png). */
function SiteLogo({ className = "", height = 44 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/",
		className: `group inline-flex shrink-0 items-center ${className}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/logo2.png",
			alt: "Help Life Building — Your life coaching",
			height,
			width: Math.round(height * 3.6),
			className: "block object-contain transition-transform duration-300 group-hover:-translate-y-0.5",
			style: {
				height,
				width: "auto",
				maxWidth: Math.round(height * 3.6)
			}
		})
	});
}
//#endregion
export { SiteLogo as t };
