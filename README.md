# Gazellekey Website

Public website and customer account area for Gazellekey International. It has
no database of its own; all data comes from the backend API project
(`../gazellkey-client/gazellkey-international`). Staff use the separate admin
portal (`../gazellekey-admin`).

## Run it

1. Start the backend API first.
2. Copy `.env.example` to `.env.local` and set `API_URL` to the backend's
   address and `NEXT_PUBLIC_ADMIN_URL` to the admin portal's address.
3. `npm install`
4. `npm run dev`, then open http://localhost:3002

## How it talks to the API

- `next.config.ts` rewrites `/api/*` to `API_URL/api/*`. The browser only ever
  sees this site, so the backend's httpOnly `login-token` cookie works without CORS.
- Server components call the API with `apiGet()` / `apiGetItem()` /
  `apiGetMine()` in `lib/api.ts`, passing the visitor's cookie on.
- Client components (forms) use `apiRequest()` in `lib/api-client.ts`.
- `proxy.ts` only checks that the cookie exists for `/account/*`. The real check
  is `requireCustomer()` in `app/account/layout.tsx` and in every backend route.
- Staff who sign in here are sent to the admin portal.

## Pages

| Path                         | Backend route                              |
| ---------------------------- | ------------------------------------------ |
| `/`                          | `/api/content/home.hero`, events, tours    |
| `/about`                     | `/api/content/about.page`                  |
| `/contact`                   | `POST /api/enquiries`                      |
| `/travel`, `/travel/[slug]`  | `/api/travel/tours`                        |
| `/events`, `/events/[slug]`  | `/api/events`, `POST .../registrations`    |
| `/gems`, `/gems/[sku]`       | `/api/gems`                                |
| `/vehicles`, `/vehicles/[sku]` | `/api/vehicles`                          |
| `/import`, `/export` (+ `/[sku]`) | `/api/trade/products?direction=...`   |
| `/login`, `/register`        | `/api/auth/login`, `/api/auth/register`    |
| `/account/*`                 | `/api/me/{enquiries,quotations,orders,...}`|
| `/cart`                      | `POST /api/shop/checkout` (Stripe Checkout)|
| `/checkout/success`          | `GET /api/shop/checkout?session_id=...`    |

## Online shop

Fixed-price gems, vehicles / spare parts and trade products show an "Add to
cart" box. The cart lives in the browser (`lib/cart.ts`); at checkout the
backend prices everything again, holds the stock for 30 minutes and sends the
customer to Stripe's payment page. Stripe confirms the payment to the backend
(webhook), the order becomes Confirmed, and the customer can download a PDF
receipt (`/api/payments/{id}/receipt`) from the thank-you page or
`/account/payments`. Stripe keys are set in the backend's `.env`.

Customers accept, decline or ask for changes to a quotation on
`/account/quotations` (`POST /api/quotations/{id}/respond`).

Home and About text can be edited by staff as content blocks `home.hero`
(`title`, `body.text`) and `about.page` (`title`, `body.paragraphs` or `body.text`).
Built-in text is shown when a block is missing.
