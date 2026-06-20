import Link from "next/link";
import { PriceTag } from "./PriceTag";
import { StatusBadge } from "./StatusBadge";

type Project = {
  id: string;
  title: string;
  category: string;
  status: string;
  description: string | null;
  total_cost: string | number;
  material_count: string | number;
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block bg-surface border border-ink/10 rounded-sm p-5 shadow-[2px_2px_0_0_var(--grid-line)] hover:shadow-[3px_3px_0_0_var(--rust)] hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-display font-bold text-lg leading-snug group-hover:text-rust transition-colors">
          {project.title}
        </h3>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-xs uppercase tracking-wide text-muted mb-3">
        {project.category}
      </p>
      {project.description ? (
        <p className="text-sm text-ink/70 mb-4 line-clamp-2">{project.description}</p>
      ) : null}
      <div className="flex items-center justify-between pt-3 border-t border-dashed border-grid-line">
        <span className="text-xs text-muted">
          {project.material_count} material{Number(project.material_count) !== 1 ? "s" : ""}
        </span>
        <PriceTag amount={project.total_cost} />
      </div>
    </Link>
  );
}
