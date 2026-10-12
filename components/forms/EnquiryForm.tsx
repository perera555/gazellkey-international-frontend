"use client";

import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import { DIVISION_LIST, Option } from "@/lib/divisions";
import { Division } from "@/lib/types";

type Props = {
  division?: Division; // fixed division; when missing the visitor chooses
  defaultDivision?: Division; // pre-selected choice when the visitor chooses
  services?: Option[];
  defaultService?: string;
  itemType?: string; // the listing this enquiry is about (backend EntityType)
  itemId?: string;
  defaultSubject?: string;
  defaultMessage?: string;
  showCompany?: boolean;
  prefill?: { firstName?: string; lastName?: string; email?: string };
  submitLabel?: string;
};

// FR-SH-02: every division page has a clear enquiry action
export default function EnquiryForm(props: Props) {
  const [division, setDivision] = useState<string>(
    props.division ?? props.defaultDivision ?? "",
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const services =
    props.services ??
    DIVISION_LIST.find((item) => item.key == division)?.services ??
    [];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSending(true);

    const form = new FormData(event.currentTarget);
    const value = (name: string) => {
      const text = String(form.get(name) ?? "").trim();
      return text == "" ? undefined : text;
    };

    const result = await apiRequest<{ reference?: string }>("POST", "/api/enquiries", {
      division: division,
      serviceType: value("serviceType"),
      subject: value("subject"),
      message: value("message"),
      firstName: value("firstName"),
      lastName: value("lastName"),
      companyName: value("companyName"),
      email: value("email"),
      phone: value("phone"),
      country: value("country"),
      itemType: props.itemType,
      itemId: props.itemId,
      website: value("website"), // honeypot
    });

    setSending(false);
    if (result.ok) {
      setReference(result.data.reference ?? "received");
    } else {
      setError(result.data.message ?? "Could not send your enquiry.");
    }
  }

  if (reference) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-semibold text-emerald-900">Thank you - we received your enquiry.</p>
        {reference != "received" ? (
          <p className="mt-2 text-sm text-emerald-800">
            Your reference is <span className="font-mono font-semibold">{reference}</span>.
            We have emailed you a copy and our team will reply soon.
          </p>
        ) : null}
        <button type="button" onClick={() => setReference("")} className="btn-outline mt-5">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      {!props.division ? (
        <div className="sm:col-span-2">
          <label className="label" htmlFor="division">Division *</label>
          <select
            id="division"
            className="input"
            required
            value={division}
            onChange={(event) => setDivision(event.target.value)}
          >
            <option value="">Choose a division...</option>
            {DIVISION_LIST.map((item) => (
              <option key={item.key} value={item.key}>{item.name}</option>
            ))}
          </select>
        </div>
      ) : null}

      {services.length > 0 ? (
        <div className="sm:col-span-2">
          <label className="label" htmlFor="serviceType">I am interested in</label>
          <select
            id="serviceType"
            name="serviceType"
            className="input"
            defaultValue={props.defaultService ?? ""}
            key={division}
          >
            <option value="">General enquiry</option>
            {services.map((service) => (
              <option key={service.value} value={service.value}>{service.label}</option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label className="label" htmlFor="firstName">First name *</label>
        <input id="firstName" name="firstName" required maxLength={100} autoComplete="given-name" className="input" defaultValue={props.prefill?.firstName} />
      </div>
      <div>
        <label className="label" htmlFor="lastName">Last name</label>
        <input id="lastName" name="lastName" maxLength={100} autoComplete="family-name" className="input" defaultValue={props.prefill?.lastName} />
      </div>
      <div>
        <label className="label" htmlFor="email">Email *</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" defaultValue={props.prefill?.email} />
      </div>
      <div>
        <label className="label" htmlFor="phone">Phone / WhatsApp</label>
        <input id="phone" name="phone" type="tel" maxLength={30} autoComplete="tel" className="input" />
      </div>
      {props.showCompany ? (
        <div>
          <label className="label" htmlFor="companyName">Company</label>
          <input id="companyName" name="companyName" maxLength={200} autoComplete="organization" className="input" />
        </div>
      ) : null}
      <div className={props.showCompany ? "" : "sm:col-span-2"}>
        <label className="label" htmlFor="country">Country</label>
        <input id="country" name="country" maxLength={100} autoComplete="country-name" className="input" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="subject">Subject *</label>
        <input
          id="subject"
          name="subject"
          required
          minLength={3}
          maxLength={200}
          className="input"
          defaultValue={props.defaultSubject}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          maxLength={5000}
          rows={5}
          className="input"
          defaultValue={props.defaultMessage}
          placeholder="Dates, quantities, destination, budget - anything that helps us quote."
        />
      </div>

      {/* honeypot: hidden from people, bots fill it in */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2" role="alert">
          {error}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button type="submit" disabled={sending} className="btn-gold w-full sm:w-auto">
          {sending ? "Sending..." : props.submitLabel ?? "Send Enquiry"}
        </button>
      </div>
    </form>
  );
}
