import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as Mail, K as ChevronRight, Y as Check, a as User, q as ChevronLeft, y as Phone } from "../_libs/lucide-react.mjs";
import { i as SiteHeader } from "./site-header-CKKobd7D.mjs";
import { t as SiteFooter } from "./site-footer-HO9x-7Tg.mjs";
import { t as PageBanner } from "./page-banner-kacNVSs9.mjs";
import { c as RDV_SERVICES, d as formatFcfa, i as CRENEAUX } from "./site-content-Cpl4DOVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rdv-BCjpNXTU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var JOURS = [
	"Lun",
	"Mar",
	"Mer",
	"Jeu",
	"Ven",
	"Sam",
	"Dim"
];
function getDaysInMonth(date) {
	const year = date.getFullYear();
	const month = date.getMonth();
	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const days = [];
	for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i += 1) days.push(null);
	for (let i = 1; i <= daysInMonth; i += 1) days.push(new Date(year, month, i));
	return days;
}
function isDateAvailable(date) {
	if (!date) return false;
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const day = date.getDay();
	return date >= today && day !== 0 && day !== 6;
}
function formatDate(date) {
	if (!date) return "";
	return date.toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
}
function RdvPage() {
	const [step, setStep] = (0, import_react.useState)(1);
	const [service, setService] = (0, import_react.useState)(null);
	const [date, setDate] = (0, import_react.useState)(null);
	const [time, setTime] = (0, import_react.useState)(null);
	const [month, setMonth] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const [form, setForm] = (0, import_react.useState)({
		nom: "",
		email: "",
		telephone: "",
		message: ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageBanner, {
				kicker: "Contact",
				title: "Prendre rendez-vous",
				subtitle: "Réservez votre créneau en trois étapes."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-5 py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center",
					children: [
						1,
						2,
						3
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `flex size-10 items-center justify-center rounded-full text-sm font-bold transition-all ${step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`,
							children: step > s ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "size-5",
								"aria-hidden": true
							}) : s
						}), s < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mx-2 h-1 w-16 rounded-full ${step > s ? "bg-brand" : "bg-secondary"}` }) : null]
					}, s))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "premium-card mt-10 p-8",
					children: [
						step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-semibold",
							children: "Choisissez votre service"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 space-y-4",
							children: RDV_SERVICES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setService(item);
									setStep(2);
								},
								className: `w-full rounded-2xl border-2 p-5 text-left transition-all hover:border-brand/60 ${service?.id === item.id ? "border-brand bg-brand/5" : "border-border"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: item.nom
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground",
										children: [item.duree, " minutes"]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-xl font-semibold text-brand-strong",
										children: item.prix ? formatFcfa(item.prix) : "Sur devis"
									})]
								})
							}, item.id))
						})] }) : null,
						step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-semibold",
								children: "Choisissez une date et un horaire"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex items-center justify-between",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1)),
										className: "rounded-lg p-2 hover:bg-secondary",
										"aria-label": "Mois précédent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
											className: "size-5",
											"aria-hidden": true
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold capitalize",
										children: month.toLocaleDateString("fr-FR", {
											month: "long",
											year: "numeric"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1)),
										className: "rounded-lg p-2 hover:bg-secondary",
										"aria-label": "Mois suivant",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
											className: "size-5",
											"aria-hidden": true
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground",
								children: JOURS.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "py-2",
									children: day
								}, day))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-7 gap-2",
								children: getDaysInMonth(month).map((day, index) => {
									const available = isDateAvailable(day);
									const active = day && date?.toDateString() === day.toDateString();
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: !available,
										onClick: () => day && setDate(day),
										className: `rounded-lg py-3 text-sm font-medium transition-all ${!day ? "invisible" : active ? "bg-primary text-primary-foreground" : available ? "hover:bg-brand/10" : "cursor-not-allowed text-muted-foreground/40"}`,
										children: day?.getDate()
									}, index);
								})
							}),
							date ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-semibold",
									children: ["Horaires disponibles le ", formatDate(date)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4",
									children: CRENEAUX.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setTime(slot),
										className: `rounded-xl py-3 text-sm font-semibold transition-all ${time === slot ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-brand/10"}`,
										children: slot
									}, slot))
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStep(1),
									className: "rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary",
									children: "Retour"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: !date || !time,
									onClick: () => setStep(3),
									className: "bg-primary rounded-xl px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md disabled:opacity-50",
									children: "Continuer"
								})]
							})
						] }) : null,
						step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (event) => {
								event.preventDefault();
								setStep(4);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl font-semibold",
									children: "Vos informations"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 space-y-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											icon: User,
											label: "Nom complet",
											required: true,
											value: form.nom,
											onChange: (v) => setForm({
												...form,
												nom: v
											}),
											placeholder: "Aminata Koné"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											icon: Mail,
											label: "Email",
											type: "email",
											required: true,
											value: form.email,
											onChange: (v) => setForm({
												...form,
												email: v
											}),
											placeholder: "aminata@exemple.com"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											icon: Phone,
											label: "Téléphone",
											type: "tel",
											value: form.telephone,
											onChange: (v) => setForm({
												...form,
												telephone: v
											}),
											placeholder: "+225 07 00 00 00 00"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "mb-2 block text-sm font-medium",
											htmlFor: "rdv-message",
											children: "Message (optionnel)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											id: "rdv-message",
											rows: 4,
											value: form.message,
											onChange: (event) => setForm({
												...form,
												message: event.target.value
											}),
											placeholder: "Décrivez brièvement votre besoin…",
											className: "w-full resize-none rounded-xl border border-border bg-background/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/40"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl bg-brand/8 p-5 text-sm text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-foreground",
													children: "Récapitulatif"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-2",
													children: ["Service : ", service?.nom]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Date : ", formatDate(date)] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Heure : ", time] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Prix : ", service?.prix ? formatFcfa(service.prix) : "Sur devis"] })
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setStep(2),
										className: "rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary",
										children: "Retour"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "bg-primary rounded-xl px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md",
										children: "Confirmer le rendez-vous"
									})]
								})
							]
						}) : null,
						step === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-10 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex size-20 items-center justify-center rounded-full bg-brand/12 text-brand-strong",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										className: "size-10",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-6 font-display text-3xl font-semibold",
									children: "Rendez-vous confirmé"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-muted-foreground",
									children: "Vous recevrez un email de confirmation avec le lien de connexion et tous les détails."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									className: "bg-primary mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md",
									children: "Retour à l'accueil"
								})
							]
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Field({ icon: Icon, label, value, onChange, placeholder, type = "text", required = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-2 block text-sm font-medium",
		htmlFor: `field-${label}`,
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id: `field-${label}`,
			type,
			required,
			value,
			placeholder,
			onChange: (event) => onChange(event.target.value),
			className: "w-full rounded-xl border border-border bg-background/70 py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand/40"
		})]
	})] });
}
//#endregion
export { RdvPage as component };
