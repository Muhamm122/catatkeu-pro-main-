"use client";

interface SectionCardProps {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
}

export default function SectionCard({
  title,
  description,
  icon,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}
