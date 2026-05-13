"use client";

interface FeeInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  step?: string;
  min?: number;
  helpText?: string;
}

export default function FeeInput({
  label,
  value,
  onChange,
  suffix,
  step = "0.01",
  min = 0,
  helpText,
}: FeeInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {suffix && (
          <span className="whitespace-nowrap text-xs text-zinc-500">
            {suffix}
          </span>
        )}
      </div>
      {helpText && <p className="text-xs text-zinc-500">{helpText}</p>}
    </div>
  );
}
