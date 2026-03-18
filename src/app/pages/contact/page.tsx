"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { shopDetails } from "../../global";
import PageHeader from "../../components/PageHeader";

export default function ContactPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Kontakt"
        eyebrow="Support"
        breadcrumbs={[
          { label: "Start", href: "/" },
          { label: "Kontakt" },
        ]}
      />

      <div className="max-w-2xl space-y-3">
        <a
          href={`mailto:${shopDetails.contact.email}`}
          className="flex items-center gap-4 p-5 rounded border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-200 group"
        >
          <div className="w-11 h-11 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors duration-200">
            <Mail size={18} className="text-muted" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted mb-0.5 uppercase tracking-wider">E-Mail</p>
            <p className="text-sm font-medium text-primary truncate">{shopDetails.contact.email}</p>
          </div>
          <span className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Schreiben →
          </span>
        </a>

        <a
          href={`tel:${shopDetails.contact.phone}`}
          className="flex items-center gap-4 p-5 rounded border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-200 group"
        >
          <div className="w-11 h-11 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors duration-200">
            <Phone size={18} className="text-muted" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted mb-0.5 uppercase tracking-wider">Telefon</p>
            <p className="text-sm font-medium text-primary">{shopDetails.contact.phone}</p>
          </div>
          <span className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Anrufen →
          </span>
        </a>

        <div className="flex items-center gap-4 p-5 rounded border border-zinc-200 dark:border-zinc-800">
          <div className="w-11 h-11 rounded-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-muted" />
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5 uppercase tracking-wider">Adresse</p>
            <p className="text-sm font-medium text-primary">
              {shopDetails.contact.address}
            </p>
            <p className="text-sm text-muted">
              {shopDetails.contact.city} · {shopDetails.contact.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
