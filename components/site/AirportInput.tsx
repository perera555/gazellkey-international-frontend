"use client";

import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Airport, airportLabel, searchAirports } from "@/lib/airports";

type Position = { top: number; left: number; width: number };

// Text input with an airport suggestion list. The list is portalled to the
// body because the home hero clips its overflow. Free text is still accepted
// for airports that aren't in the list.
export default function AirportInput({
  name,
  placeholder,
  required = false,
}: {
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = searchAirports(text);

  // Keep the list under the input while the page scrolls or resizes
  useEffect(() => {
    if (!open) return;
    function place() {
      const rect = inputRef.current?.getBoundingClientRect();
      if (rect) {
        setPosition({ top: rect.bottom + 6, left: rect.left, width: Math.max(rect.width, 300) });
      }
    }
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  function choose(airport: Airport) {
    setText(airportLabel(airport));
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key == "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key == "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key == "Enter" && open && results[active]) {
      event.preventDefault();
      choose(results[active]);
    } else if (event.key == "Escape") {
      setOpen(false);
    }
  }

  const showList = open && position && results.length > 0;

  return (
    <>
      <input
        ref={inputRef}
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={Boolean(showList)}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList ? `${listId}-${active}` : undefined}
        className="input"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={(event) => {
          event.target.select();
          setOpen(true);
        }}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      {showList
        ? createPortal(
            <ul
              id={listId}
              role="listbox"
              style={{ top: position.top, left: position.left, width: position.width }}
              className="fixed z-50 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 text-navy-900 shadow-[0_24px_48px_-16px_rgba(7,26,48,0.45)]"
            >
              {results.map((airport, index) => (
                <li
                  key={airport.code}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index == active}
                  // mousedown fires before the input's blur closes the list
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(airport);
                  }}
                  onMouseEnter={() => setActive(index)}
                  className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${index == active ? "bg-navy-50" : ""}`}
                >
                  <span className="w-11 shrink-0 rounded-md bg-navy-900 py-1 text-center text-xs font-bold tracking-wide text-gold-400">
                    {airport.code}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {airport.city}, {airport.country}
                    </span>
                    <span className="block truncate text-xs text-slate-500">{airport.name}</span>
                  </span>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </>
  );
}
