import Link from "next/link";

type Params = Record<string, string | undefined>;

// Link to the same page with some filters changed (undefined removes one)
function withParams(basePath: string, current: Params, changes: Params) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...current, ...changes, pageNumber: undefined })) {
    if (value) {
      query.set(key, value);
    }
  }
  const text = query.toString();
  return text ? `${basePath}?${text}` : basePath;
}

// Left column of the Shop page: categories, price range and toggles.
// Plain links and a GET form, so it works without JavaScript too.
export default function ShopFilters({
  basePath,
  current,
  categories,
  currencies,
}: {
  basePath: string;
  current: Params;
  categories: { name: string; count: number }[];
  currencies: string[];
}) {
  const active = current.category?.toLowerCase();
  const hasFilters = ["category", "minPrice", "maxPrice", "currency", "onSale", "inStock", "search"].some(
    (key) => current[key],
  );

  return (
    <div className="space-y-7">
      {categories.length > 0 ? (
        <div>
          <h3 className="text-xs font-bold tracking-widest text-navy-900 uppercase">Category</h3>
          <ul className="mt-3 space-y-0.5">
            <li>
              <Link
                href={withParams(basePath, current, { category: undefined })}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  !active ? "bg-navy-950 font-semibold text-white" : "text-slate-600 hover:bg-navy-50"
                }`}
              >
                All categories
              </Link>
            </li>
            {categories.map((category) => {
              const selected = active == category.name.toLowerCase();
              return (
                <li key={category.name}>
                  <Link
                    href={withParams(basePath, current, { category: selected ? undefined : category.name })}
                    className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      selected ? "bg-navy-950 font-semibold text-white" : "text-slate-600 hover:bg-navy-50"
                    }`}
                  >
                    <span className="truncate">{category.name}</span>
                    <span className={`text-xs ${selected ? "text-gold-400" : "text-slate-400"}`}>{category.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <form action={basePath} className="space-y-7">
        {/* keep the choices made outside this form */}
        {["kind", "category", "search", "sort"].map((key) =>
          current[key] ? <input key={key} type="hidden" name={key} value={current[key]} /> : null,
        )}

        <div>
          <h3 className="text-xs font-bold tracking-widest text-navy-900 uppercase">Price</h3>
          <div className="mt-3 flex items-center gap-2">
            <input
              name="minPrice"
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="Min"
              defaultValue={current.minPrice}
              className="input py-2"
              aria-label="Minimum price"
            />
            <span className="text-slate-400">–</span>
            <input
              name="maxPrice"
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="Max"
              defaultValue={current.maxPrice}
              className="input py-2"
              aria-label="Maximum price"
            />
          </div>
          {currencies.length > 1 ? (
            <select name="currency" defaultValue={current.currency ?? ""} className="input mt-2 py-2" aria-label="Currency">
              <option value="">Any currency</option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold tracking-widest text-navy-900 uppercase">Show</h3>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
            <input type="checkbox" name="onSale" value="true" defaultChecked={current.onSale == "true"} className="h-4 w-4 accent-gold-600" />
            On sale only
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
            <input type="checkbox" name="inStock" value="true" defaultChecked={current.inStock == "true"} className="h-4 w-4 accent-gold-600" />
            In stock only
          </label>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn-navy flex-1 py-2.5">
            Apply
          </button>
          {hasFilters ? (
            <Link href={withParams(basePath, { kind: current.kind, sort: current.sort }, {})} className="btn-outline py-2.5">
              Clear
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}
