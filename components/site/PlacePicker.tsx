"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CountryEntry } from "@/lib/places";

// Country -> place (-> hotel) dropdowns inside a plain GET search form.
// Tours send ?country=&search=<destination>; hotels send ?country=&city=.
// Picking a hotel opens its page straight away (keeping the stay dates).
export default function PlacePicker({
  countries,
  placeParam,
  placeLabel,
  countLabel,
  defaultCountry = "",
  defaultPlace = "",
  hotelHrefQuery,
  fieldClassName = "",
}: {
  fieldClassName?: string; // extra classes on each field, e.g. "lg:flex-1" in a flex row
  countries: CountryEntry[];
  placeParam: "search" | "city";
  placeLabel: string;
  countLabel: string; // "tour" / "hotel"
  defaultCountry?: string;
  defaultPlace?: string;
  hotelHrefQuery?: string; // set = show the hotel dropdown; "?checkin=..." added to hotel links
}) {
  const router = useRouter();
  const [country, setCountry] = useState(defaultCountry);
  const [place, setPlace] = useState(defaultPlace);
  const countryEntry = countries.find((each) => each.country.toLowerCase() == country.toLowerCase());
  const places = countryEntry?.places ?? [];
  const placeEntry = places.find((each) => each.name.toLowerCase() == place.toLowerCase());
  const hotels = placeEntry?.hotels ?? [];
  const count = (n: number) => (n > 0 ? ` (${n} ${countLabel}${n == 1 ? "" : "s"})` : "");

  return (
    <>
      <label className={`block min-w-0 ${fieldClassName}`}>
        <span className="label">Country</span>
        <select
          name="country"
          value={country}
          onChange={(event) => {
            setCountry(event.target.value);
            setPlace("");
          }}
          className="input"
        >
          <option value="">All countries</option>
          {/* keep a typed-in country selectable */}
          {country && !countryEntry ? <option value={country}>{country}</option> : null}
          {countries.map((each) => (
            <option key={each.country} value={each.country}>
              {each.country}
              {count(each.count)}
            </option>
          ))}
        </select>
      </label>

      <label className={`block min-w-0 ${fieldClassName}`}>
        <span className="label">{placeLabel}</span>
        <select
          name={placeParam}
          value={place}
          onChange={(event) => setPlace(event.target.value)}
          disabled={country == "" && !place}
          className="input disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="">{country == "" ? "Choose a country first" : `All of ${country}`}</option>
          {place && !placeEntry ? <option value={place}>{place}</option> : null}
          {places.map((each) => (
            <option key={each.name} value={each.name}>
              {each.name}
              {count(each.count)}
            </option>
          ))}
        </select>
      </label>

      {hotelHrefQuery != undefined ? (
        <label className={`block min-w-0 ${fieldClassName}`}>
          <span className="label">Hotel</span>
          <select
            value=""
            disabled={hotels.length == 0}
            onChange={(event) => {
              if (event.target.value) router.push(`/hotels/${event.target.value}${hotelHrefQuery}`);
            }}
            className="input disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            aria-label="Go to a hotel"
          >
            <option value="">
              {hotels.length > 0 ? `All hotels in ${place} (${hotels.length})` : place ? "No hotels listed yet" : "Choose a city first"}
            </option>
            {hotels.map((hotel) => (
              <option key={hotel.slug} value={hotel.slug}>{hotel.name}</option>
            ))}
          </select>
        </label>
      ) : null}
    </>
  );
}
