import type { ReactNode } from "react";

type Props = { eyebrow: string; title: string; subtitle: string; aside?: ReactNode };
/**
 * Component to render a page heading with an optional aside section.
 * @param eyebrow - The eyebrow text above the title.
 * @param title - The main title of the page.
 * @param subtitle - The subtitle text below the title.
 * @param aside - Optional React node to display alongside the heading.
 */
export function PageHeading({ eyebrow, title, subtitle, aside }: Props) {
  return (
    <div className="page-heading">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-subtitle">{subtitle}</p></div>
      {aside}
    </div>
  );
}
