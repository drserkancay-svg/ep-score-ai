"use client";

import type { ReactNode } from "react";

type SelectionCardProps = {
  selected: boolean;
  title: string;
  description?: string;
  points?: string | number;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

type NumberFieldProps = {
  id: string;
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  description?: string;
  placeholder?: string;
};

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function SelectionCard({
  selected,
  title,
  description,
  points,
  icon,
  onClick,
  disabled = false,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition duration-300 sm:p-5 ${
        selected
          ? "border-cyan-300 bg-cyan-50 shadow-sm shadow-cyan-100"
          : "border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-slate-50 hover:shadow-md"
      } disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0`}
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition ${
          selected
            ? "border-cyan-600 bg-cyan-600 text-white shadow-sm shadow-cyan-200"
            : "border-slate-200 bg-slate-50 text-slate-500 group-hover:border-cyan-200 group-hover:bg-cyan-50 group-hover:text-cyan-700"
        }`}
      >
        {selected ? <CheckIcon /> : icon}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-bold transition ${
            selected ? "text-cyan-950" : "text-slate-900"
          }`}
        >
          {title}
        </span>

        {description ? (
          <span className="mt-1.5 block text-xs leading-5 text-slate-500">
            {description}
          </span>
        ) : null}
      </span>

      {points !== undefined ? (
        <span
          className={`shrink-0 rounded-xl border px-3 py-1.5 text-xs font-black ${
            selected
              ? "border-cyan-200 bg-white text-cyan-700"
              : "border-slate-200 bg-slate-50 text-slate-500"
          }`}
        >
          {typeof points === "number" && points > 0 ? `+${points}` : points}
        </span>
      ) : null}
    </button>
  );
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  description,
  placeholder,
}: NumberFieldProps) {
  return (
    <label
      htmlFor={id}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100 sm:p-5"
    >
      <span className="flex items-start justify-between gap-4">
        <span className="min-w-0">
          <span className="block text-sm font-bold text-slate-900">
            {label}
          </span>

          {description ? (
            <span className="mt-1.5 block text-xs leading-5 text-slate-500">
              {description}
            </span>
          ) : null}
        </span>

        {unit ? (
          <span className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {unit}
          </span>
        ) : null}
      </span>

      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={(event) => {
          const nextValue = event.target.value;

          onChange(nextValue === "" ? "" : Number(nextValue));
        }}
        className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
      />
    </label>
  );
}

export function FieldGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div>
        <h3 className="text-base font-black tracking-tight text-slate-950">
          {title}
        </h3>

        {description ? (
          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}