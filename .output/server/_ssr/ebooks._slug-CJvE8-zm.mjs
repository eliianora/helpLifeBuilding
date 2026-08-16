import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ebooks._slug-CJvE8-zm.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "p-16 text-center",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-display text-2xl",
		children: "Ce livre n'existe pas."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/ebooks",
		className: "mt-4 inline-block text-sm underline",
		children: "Retour au catalogue"
	})]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
