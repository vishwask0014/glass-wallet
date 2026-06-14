type AISuggestionProps = {
  title: string;
  detail: string;
};

export default function AISuggestion({ title, detail }: AISuggestionProps) {
  return (
    <article className="theme-inverse-card rounded-[1.9rem] p-6">
      <p className="theme-inverse-muted text-sm">Insight</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">{title}</h2>
      <p className="theme-inverse-muted mt-3 text-sm leading-7">{detail}</p>
    </article>
  );
}
