import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { n as listEbooks } from "./catalog.functions-B22O1TPy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CRNMPnCo.js
var ebooksQuery = queryOptions({
	queryKey: ["ebooks"],
	queryFn: () => listEbooks()
});
//#endregion
export { ebooksQuery as t };
