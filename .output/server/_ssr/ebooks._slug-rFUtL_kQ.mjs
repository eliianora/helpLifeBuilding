import { n as coverFor } from "./covers-C3ZiEN96.mjs";
import { N as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { t as getEbookBySlug } from "./catalog.functions-B22O1TPy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ebooks._slug-rFUtL_kQ.js
var bookQuery = (slug) => queryOptions({
	queryKey: ["ebook", slug],
	queryFn: () => getEbookBySlug({ data: { slug } })
});
var $$splitComponentImporter = () => import("./ebooks._slug-BbEg0y0N.mjs");
var $$splitNotFoundComponentImporter = () => import("./ebooks._slug-CJvE8-zm.mjs");
var $$splitErrorComponentImporter = () => import("./ebooks._slug-C80DiPWw.mjs");
var Route = createFileRoute("/ebooks/$slug")({
	loader: async ({ context, params }) => {
		const data = await context.queryClient.ensureQueryData(bookQuery(params.slug));
		if (!data) throw notFound();
		return {
			title: data.ebook.title,
			description: data.ebook.description,
			coverKey: data.ebook.cover_key
		};
	},
	head: ({ loaderData }) => {
		const title = loaderData ? `${loaderData.title} — Prisca Brou` : "Livre — Prisca Brou";
		const description = loaderData?.description?.slice(0, 155) ?? "Un livre de Prisca Brou.";
		const cover = loaderData?.coverKey ? coverFor(loaderData.coverKey) : void 0;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			},
			{
				property: "og:type",
				content: "book"
			},
			...cover ? [{
				property: "og:image",
				content: cover
			}] : [],
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		] };
	},
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { bookQuery as n, Route as t };
