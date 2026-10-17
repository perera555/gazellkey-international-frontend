import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import CartView from "@/components/shop/CartView";
import ReleaseCheckout from "@/components/shop/ReleaseCheckout";
import { apiFetch, apiGet } from "@/lib/api";
import { param } from "@/lib/format";
import { LogoutButton } from "@/components/forms/AuthForms";
import { getSessionUser, isStaff } from "@/lib/session";
import { ShopPaymentOption } from "@/lib/types";

export const metadata: Metadata = { title: "Your cart" };

// PayHere / Stripe send the customer back here with ?cancelled=CHK-2026-00001
// when they leave the payment page without paying
export default async function CartPage({ searchParams }: PageProps<"/cart">) {
  const params = await searchParams;
  const user = await getSessionUser();
  const cancelled = param(params.cancelled);
  // the backend only lets CUSTOMER accounts check out (lib/shop.ts)
  const staff = user != null && user.role != "CUSTOMER";

  const [options, me] = await Promise.all([
    apiGet<{ methods: ShopPaymentOption[] }>("/api/shop/options"),
    user ? apiFetch("/api/auth/me") : null,
  ]);
  // contact details we already have, to fill in the delivery form
  const customer = me?.ok ? me.body.customer : null;

  return (
    <>
      <PageHero
        eyebrow="Online shop"
        title="Your cart"
        text="Pay by card (Sri Lankan or foreign) or by bank transfer. Your order appears in your account straight away."
      />
      <div className="bg-[#f8f9fb]">
        <div className="container-page max-w-4xl space-y-6 py-12">
          {cancelled ? (
            <>
              {user != null ? <ReleaseCheckout checkout={cancelled} /> : null}
              <p role="status" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                Payment cancelled. Nothing was charged and your cart is still here.
              </p>
            </>
          ) : null}
          {staff ? (
            // Staff / admin accounts cannot buy online. On localhost the admin
            // portal shares this login cookie, so signing in there signs the
            // customer out here.
            <div role="alert" className="card flex flex-col gap-4 border-gold-400/60 bg-gold-100/50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-navy-900">
                  You are signed in with a {isStaff(user) ? "staff" : "non-customer"} account ({user.email})
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Only customer accounts can buy online. Sign out, then sign in with your customer account.
                </p>
              </div>
              <LogoutButton
                className="btn-navy btn-sm shrink-0"
                redirectTo={`/login?next=${encodeURIComponent("/cart")}`}
                label="Switch to customer account"
              />
            </div>
          ) : null}
          <CartView
            signedIn={user != null}
            staff={staff}
            options={options.ok ? options.data.methods : []}
            prefill={{
              phone: customer?.phone ?? "",
              address: customer?.address ?? "",
              city: "",
              country: customer?.country ?? "",
            }}
          />
        </div>
      </div>
    </>
  );
}
