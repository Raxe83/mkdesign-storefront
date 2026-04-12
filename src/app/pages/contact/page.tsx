import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { shopDetails } from "../../global";
import PageHeader from "../../components/PageHeader";
import ContactForm from "./ContactForm";

// WhatsApp: strip non-digits from phone, ensure country code without leading 0
const waNumber = shopDetails.contact.phone
  .replace(/\D/g, '')
  .replace(/^490/, '49');

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

      <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Contact info + WhatsApp */}
        <div className="space-y-3">
          <a
            href={`mailto:${shopDetails.contact.email}`}
            className="flex items-center gap-4 p-5 rounded border border-border hover:border-muted transition-colors duration-200 group"
          >
            <div className="w-11 h-11 rounded-sm bg-surface flex items-center justify-center shrink-0 group-hover:bg-border transition-colors duration-200">
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
            className="flex items-center gap-4 p-5 rounded border border-border hover:border-muted transition-colors duration-200 group"
          >
            <div className="w-11 h-11 rounded-sm bg-surface flex items-center justify-center shrink-0 group-hover:bg-border transition-colors duration-200">
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

          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded border border-border hover:border-muted transition-colors duration-200 group"
          >
            <div className="w-11 h-11 rounded-sm bg-surface flex items-center justify-center shrink-0 group-hover:bg-border transition-colors duration-200">
              <MessageCircle size={18} className="text-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted mb-0.5 uppercase tracking-wider">WhatsApp</p>
              <p className="text-sm font-medium text-primary">{shopDetails.contact.phone}</p>
            </div>
            <span className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Schreiben →
            </span>
          </a>

          <div className="flex items-center gap-4 p-5 rounded border border-border">
            <div className="w-11 h-11 rounded-sm bg-surface flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-muted" />
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5 uppercase tracking-wider">Adresse</p>
              <p className="text-sm font-medium text-primary">{shopDetails.contact.address}</p>
              <p className="text-sm text-muted">
                {shopDetails.contact.city} · {shopDetails.contact.country}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Contact form */}
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-4">Direktanfrage</p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
