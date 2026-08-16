import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, Mail, Phone, User } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageBanner } from "@/components/page-banner";
import { CRENEAUX, RDV_SERVICES, formatFcfa } from "@/lib/site-content";

export const Route = createFileRoute("/rdv")({
  head: () => ({
    meta: [
      { title: "Prendre rendez-vous | Help Life Building" },
      {
        name: "description",
        content: "Réservez un coaching parental, un atelier ou une formation institution avec Help Life Building.",
      },
      { property: "og:title", content: "Prendre rendez-vous | Help Life Building" },
      { property: "og:description", content: "Choisissez votre service, votre date et votre créneau en ligne." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RdvPage,
});

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = [];
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i += 1) days.push(null);
  for (let i = 1; i <= daysInMonth; i += 1) days.push(new Date(year, month, i));
  return days;
}

function isDateAvailable(date: Date | null) {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = date.getDay();
  return date >= today && day !== 0 && day !== 6;
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function RdvPage() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<(typeof RDV_SERVICES)[number] | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [month, setMonth] = useState(new Date());
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", message: "" });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageBanner
        kicker="Contact"
        title="Prendre rendez-vous"
        subtitle="Réservez votre créneau en trois étapes."
      />

      <main className="mx-auto max-w-4xl px-5 py-16">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <span
                className={`flex size-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="size-5" aria-hidden /> : s}
              </span>
              {s < 3 ? <span className={`mx-2 h-1 w-16 rounded-full ${step > s ? "bg-brand" : "bg-secondary"}`} /> : null}
            </div>
          ))}
        </div>

        <div className="premium-card mt-10 p-8">
          {step === 1 ? (
            <div>
              <h2 className="font-display text-2xl font-semibold">Choisissez votre service</h2>
              <div className="mt-6 space-y-4">
                {RDV_SERVICES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setService(item);
                      setStep(2);
                    }}
                    className={`w-full rounded-2xl border-2 p-5 text-left transition-all hover:border-brand/60 ${
                      service?.id === item.id ? "border-brand bg-brand/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{item.nom}</p>
                        <p className="text-sm text-muted-foreground">{item.duree} minutes</p>
                      </div>
                      <p className="font-display text-xl font-semibold text-brand-strong">
                        {item.prix ? formatFcfa(item.prix) : "Sur devis"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h2 className="font-display text-2xl font-semibold">Choisissez une date et un horaire</h2>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
                  className="rounded-lg p-2 hover:bg-secondary"
                  aria-label="Mois précédent"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <p className="font-semibold capitalize">
                  {month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </p>
                <button
                  type="button"
                  onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
                  className="rounded-lg p-2 hover:bg-secondary"
                  aria-label="Mois suivant"
                >
                  <ChevronRight className="size-5" aria-hidden />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground">
                {JOURS.map((day) => (
                  <span key={day} className="py-2">
                    {day}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(month).map((day, index) => {
                  const available = isDateAvailable(day);
                  const active = day && date?.toDateString() === day.toDateString();
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={!available}
                      onClick={() => day && setDate(day)}
                      className={`rounded-lg py-3 text-sm font-medium transition-all ${
                        !day
                          ? "invisible"
                          : active
                            ? "bg-primary text-primary-foreground"
                            : available
                              ? "hover:bg-brand/10"
                              : "cursor-not-allowed text-muted-foreground/40"
                      }`}
                    >
                      {day?.getDate()}
                    </button>
                  );
                })}
              </div>

              {date ? (
                <div className="mt-8">
                  <h3 className="font-semibold">Horaires disponibles le {formatDate(date)}</h3>
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {CRENEAUX.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`rounded-xl py-3 text-sm font-semibold transition-all ${
                          time === slot ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-brand/10"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
                >
                  Retour
                </button>
                <button
                  type="button"
                  disabled={!date || !time}
                  onClick={() => setStep(3)}
                  className="bg-primary rounded-xl px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md disabled:opacity-50"
                >
                  Continuer
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setStep(4);
              }}
            >
              <h2 className="font-display text-2xl font-semibold">Vos informations</h2>

              <div className="mt-6 space-y-5">
                <Field icon={User} label="Nom complet" required value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} placeholder="Aminata Koné" />
                <Field icon={Mail} label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="aminata@exemple.com" />
                <Field icon={Phone} label="Téléphone" type="tel" value={form.telephone} onChange={(v) => setForm({ ...form, telephone: v })} placeholder="+225 07 00 00 00 00" />

                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="rdv-message">
                    Message (optionnel)
                  </label>
                  <textarea
                    id="rdv-message"
                    rows={4}
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                    placeholder="Décrivez brièvement votre besoin…"
                    className="w-full resize-none rounded-xl border border-border bg-background/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>

                <div className="rounded-2xl bg-brand/8 p-5 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Récapitulatif</p>
                  <p className="mt-2">Service : {service?.nom}</p>
                  <p>Date : {formatDate(date)}</p>
                  <p>Heure : {time}</p>
                  <p>Prix : {service?.prix ? formatFcfa(service.prix) : "Sur devis"}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="bg-primary rounded-xl px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md"
                >
                  Confirmer le rendez-vous
                </button>
              </div>
            </form>
          ) : null}

          {step === 4 ? (
            <div className="py-10 text-center">
              <span className="inline-flex size-20 items-center justify-center rounded-full bg-brand/12 text-brand-strong">
                <Check className="size-10" aria-hidden />
              </span>
              <h2 className="mt-6 font-display text-3xl font-semibold">Rendez-vous confirmé</h2>
              <p className="mt-3 text-muted-foreground">
                Vous recevrez un email de confirmation avec le lien de connexion et tous les détails.
              </p>
              <Link
                to="/"
                className="bg-primary mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md"
              >
                Retour à l'accueil
              </Link>
            </div>
          ) : null}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium" htmlFor={`field-${label}`}>
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          id={`field-${label}`}
          type={type}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-border bg-background/70 py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand/40"
        />
      </div>
    </div>
  );
}
