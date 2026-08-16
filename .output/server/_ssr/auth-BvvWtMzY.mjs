import { r as __toESM } from "../_runtime.mjs";
import { i as mapAuthError, r as isSupabaseConfigured, t as authRedirectTo } from "./ssr.mjs";
import { t as supabase } from "./client-DqaBVmPg.mjs";
import { n as resolvePostLoginPath } from "./admin-Bv8g1X24.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-CWkTyF61.mjs";
import { a as useSession, i as SiteHeader } from "./site-header-CKKobd7D.mjs";
import { t as SiteFooter } from "./site-footer-HO9x-7Tg.mjs";
import { t as Input } from "./input-Oigv6AWn.mjs";
import { t as Label } from "./label-DWmshiB9.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./auth-BInFQ-XR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BvvWtMzY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const { user, loading: sessionLoading } = useSession();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const configured = isSupabaseConfigured();
	const destination = search.redirect;
	(0, import_react.useEffect)(() => {
		if (sessionLoading || !user) return;
		let cancelled = false;
		resolvePostLoginPath(user.id, destination).then((path) => {
			if (!cancelled) navigate({
				to: path,
				replace: true
			});
		});
		return () => {
			cancelled = true;
		};
	}, [
		sessionLoading,
		user,
		destination,
		navigate
	]);
	async function ensureProfile(userId, displayName, email) {
		const { data: existing } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
		const display_name = displayName?.trim() || null;
		const nextEmail = email || null;
		if (existing) {
			await supabase.from("profiles").update({
				...display_name ? { display_name } : {},
				...nextEmail ? { email: nextEmail } : {}
			}).eq("id", userId);
			return;
		}
		await supabase.from("profiles").insert({
			id: userId,
			display_name,
			email: nextEmail,
			role: "client"
		});
	}
	async function handleSubmit(event) {
		event.preventDefault();
		if (!configured) {
			toast.error(mapAuthError(/* @__PURE__ */ new Error("Missing Supabase")));
			return;
		}
		setBusy(true);
		try {
			if (mode === "signup") {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: authRedirectTo(),
						data: { display_name: name }
					}
				});
				if (error) throw error;
				if (data.user && data.session) {
					await ensureProfile(data.user.id, name, data.user.email ?? email).catch(() => void 0);
					toast.success("Compte créé. Bienvenue !");
					navigate({ to: await resolvePostLoginPath(data.user.id, destination) });
					return;
				}
				toast.success("Compte créé. Vérifiez votre email pour confirmer l'inscription, puis connectez-vous.");
				setMode("signin");
				return;
			}
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (error) throw error;
			if (data.user) await ensureProfile(data.user.id, data.user.user_metadata?.display_name, data.user.email ?? email).catch(() => void 0);
			toast.success("Connexion réussie.");
			navigate({ to: await resolvePostLoginPath(data.user?.id ?? "", destination) });
		} catch (error) {
			toast.error(mapAuthError(error));
		} finally {
			setBusy(false);
		}
	}
	async function handleGoogle() {
		if (!configured) {
			toast.error(mapAuthError(/* @__PURE__ */ new Error("Missing Supabase")));
			return;
		}
		setBusy(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: authRedirectTo(),
					queryParams: { prompt: "select_account" }
				}
			});
			if (error) throw error;
		} catch (error) {
			setBusy(false);
			toast.error(mapAuthError(error));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex max-w-md flex-col px-5 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-extrabold uppercase tracking-tight",
						children: mode === "signin" ? "Content de vous revoir" : "Créer votre compte lecteur"
					}),
					!configured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive",
						children: [
							"Supabase n'est pas configuré. Ajoutez ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "VITE_SUPABASE_URL" }),
							" et",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "VITE_SUPABASE_PUBLISHABLE_KEY" }),
							" dans ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: ".env.local" }),
							", puis relancez le serveur."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "mt-8 normal-case tracking-normal",
						onClick: handleGoogle,
						disabled: busy || !configured,
						children: "Continuer avec Google"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
							"ou",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									children: "Prénom"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									value: name,
									onChange: (e) => setName(e.target.value),
									autoComplete: "given-name"
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									autoComplete: "email"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: "Mot de passe"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									required: true,
									minLength: 6,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									autoComplete: mode === "signin" ? "current-password" : "new-password"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "cta",
								className: "cta-glow w-full",
								disabled: busy || !configured,
								children: busy ? "Patientez…" : mode === "signin" ? "Se connecter" : "Créer mon compte"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-6 text-sm text-muted-foreground underline underline-offset-4",
						onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
						children: mode === "signin" ? "Pas encore de compte ? En créer un" : "J'ai déjà un compte"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { AuthPage as component };
