import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { D as isRedirect, _ as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./button-CWkTyF61.mjs";
import { a as requireSupabaseAuth } from "./auth-middleware-BoaO0enN.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DtYZ27hI.mjs";
import { l as stringType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { t as optionalSupabaseAuth } from "./supabase-optional-auth-vWvPV78I.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-bPK1miZt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var slugInput = (data) => objectType({ slug: stringType().min(1).max(120) }).parse(data);
/** Library ownership + reading progress for the public fiche (works without login). */
var getEbookAccessStatus = createServerFn({ method: "GET" }).middleware([optionalSupabaseAuth]).validator(slugInput).handler(createSsrRpc("e9d0d497275f40cbdbaf891fe4ccc73afce640cf85627325eb80764883085592"));
var getMyLibrary = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("b5e807a74f28b703bba47f834af9ee52d003bd70bea8fd37d1b9059d859a6144"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator(slugInput).handler(createSsrRpc("a04496c84775fb383d5f59ee960d8150b69698e6db09dea5a6748fc54fb1d415"));
/** Full book content. Requires library_entries ownership. */
var getReaderBook = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).validator(slugInput).handler(createSsrRpc("f3956786d29dbafe3c8a4d5571425c6f999aaac0254ea4e3fc86f8347b44ecbb"));
var saveProgress = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({
	slug: stringType().min(1).max(120),
	chapterPosition: numberType().int().min(1).max(500),
	percent: numberType().int().min(0).max(100)
}).parse(data)).handler(createSsrRpc("fe3f553ed0790b17c1eeeac99cc336e1e15dadbaf0c7839ed6f1ab23f9ffab09"));
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
//#endregion
export { saveProgress as a, getReaderBook as i, getEbookAccessStatus as n, useServerFn as o, getMyLibrary as r, Progress as t };
