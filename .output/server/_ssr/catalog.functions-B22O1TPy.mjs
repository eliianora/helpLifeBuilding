import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DtYZ27hI.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog.functions-B22O1TPy.js
var listEbooks = createServerFn({ method: "GET" }).handler(createSsrRpc("9d8d0f2c57d475cdb9b1684d50a9dd67bcefea9451ac4769d1c21369e26eab6e"));
var getEbookBySlug = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ slug: stringType().min(1).max(120) }).parse(data)).handler(createSsrRpc("bb40d3c28e2844b3d182c27f79d815407af7cc4789874c41634a961c718f2915"));
//#endregion
export { listEbooks as n, getEbookBySlug as t };
