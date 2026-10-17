"use client";

import { useState } from "react";

type MakeOption = { make: string; models: string[] };

// Make + model dropdowns inside the vehicles filter form (a plain GET form).
//   mode "vehicle": sends ?make=Toyota&model=Aqua
//   mode "parts":   sends ?fits=Toyota Aqua (parts that fit this model)
export default function MakeModelPicker({
  makes,
  mode,
  defaultMake = "",
  defaultModel = "",
}: {
  makes: MakeOption[];
  mode: "vehicle" | "parts";
  defaultMake?: string;
  defaultModel?: string;
}) {
  const [make, setMake] = useState(defaultMake);
  const [model, setModel] = useState(defaultModel);
  const models = makes.find((each) => each.make.toLowerCase() == make.toLowerCase())?.models ?? [];

  return (
    <>
      <select
        aria-label="Make"
        name={mode == "vehicle" ? "make" : undefined}
        value={make}
        onChange={(event) => {
          setMake(event.target.value);
          setModel("");
        }}
        className="input"
      >
        <option value="">{mode == "vehicle" ? "Any make" : "Vehicle make"}</option>
        {makes.map((each) => (
          <option key={each.make} value={each.make}>{each.make}</option>
        ))}
      </select>
      <select
        aria-label="Model"
        name={mode == "vehicle" ? "model" : undefined}
        value={model}
        disabled={make == ""}
        onChange={(event) => setModel(event.target.value)}
        className="input disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">{make == "" ? "Choose a make first" : mode == "vehicle" ? "Any model" : "Model"}</option>
        {models.map((each) => (
          <option key={each} value={each}>{each}</option>
        ))}
      </select>
      {mode == "parts" && make != "" ? (
        // parts are matched on "Make Model"; with only a make, match the make
        model != "" ? <input type="hidden" name="fits" value={`${make} ${model}`} /> : <input type="hidden" name="make" value={make} />
      ) : null}
    </>
  );
}
