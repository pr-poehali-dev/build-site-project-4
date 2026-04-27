import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Layout/Navbar";
import Icon from "@/components/ui/icon";
import { PROJECTS, formatPrice } from "@/data/projects";

type SortKey = "price_asc" | "price_desc" | "area_asc" | "area_desc" | "year_desc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "price_asc", label: "По цене: сначала дешевле" },
  { key: "price_desc", label: "По цене: сначала дороже" },
  { key: "area_asc", label: "По площади: сначала меньше" },
  { key: "area_desc", label: "По площади: сначала больше" },
  { key: "year_desc", label: "По новизне" },
];

const FILTER_GROUPS = [
  {
    key: "type",
    label: "Материал стен",
    options: ["Дом из газобетона", "Дом из кирпича", "Дом из бруса", "Дом из керамоблока"],
  },
  {
    key: "floors",
    label: "Этажность",
    options: ["1 этаж", "2 этажа"],
  },
  {
    key: "area",
    label: "Площадь",
    options: ["до 120 м²", "120–180 м²", "от 180 м²"],
  },
  {
    key: "price",
    label: "Цена",
    options: ["до 4 млн", "4–7 млн", "от 7 млн"],
  },
  {
    key: "bedrooms",
    label: "Спальни",
    options: ["2 спальни", "3 спальни", "4+ спальни"],
  },
];

function matchesFilter(project: (typeof PROJECTS)[0], filters: Record<string, string[]>): boolean {
  for (const [key, values] of Object.entries(filters)) {
    if (!values.length) continue;
    if (key === "type") {
      if (!values.includes(project.type)) return false;
    }
    if (key === "floors") {
      const fl = project.floors === 1 ? "1 этаж" : "2 этажа";
      if (!values.includes(fl)) return false;
    }
    if (key === "area") {
      const inRange = values.some((v) => {
        if (v === "до 120 м²") return project.area < 120;
        if (v === "120–180 м²") return project.area >= 120 && project.area <= 180;
        if (v === "от 180 м²") return project.area > 180;
        return false;
      });
      if (!inRange) return false;
    }
    if (key === "price") {
      const inRange = values.some((v) => {
        if (v === "до 4 млн") return project.price < 4_000_000;
        if (v === "4–7 млн") return project.price >= 4_000_000 && project.price <= 7_000_000;
        if (v === "от 7 млн") return project.price > 7_000_000;
        return false;
      });
      if (!inRange) return false;
    }
    if (key === "bedrooms") {
      const inRange = values.some((v) => {
        if (v === "2 спальни") return project.bedrooms === 2;
        if (v === "3 спальни") return project.bedrooms === 3;
        if (v === "4+ спальни") return project.bedrooms >= 4;
        return false;
      });
      if (!inRange) return false;
    }
  }
  return true;
}

export default function ProjectsCatalog() {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<SortKey>("price_asc");
  const [sortOpen, setSortOpen] = useState(false);

  function toggleFilter(groupKey: string, value: string) {
    setFilters((prev) => {
      const current = prev[groupKey] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [groupKey]: next };
    });
  }

  function clearAll() {
    setFilters({});
  }

  const activeCount = Object.values(filters).flat().length;

  const sorted = useMemo(() => {
    const filtered = PROJECTS.filter((p) => matchesFilter(p, filters));
    return filtered.sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "area_asc") return a.area - b.area;
      if (sort === "area_desc") return b.area - a.area;
      if (sort === "year_desc") return b.year - a.year;
      return 0;
    });
  }, [filters, sort]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label || "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Page header */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <p className="section-label mb-2">Каталог</p>
            <h1 className="font-display text-5xl font-light">Проекты домов</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Filter bar — GoodWood style: horizontal scrollable tags */}
          <div className="py-6 border-b border-border">
            {FILTER_GROUPS.map((group) => (
              <div key={group.key} className="flex flex-wrap items-center gap-2 mb-3 last:mb-0">
                <span className="text-[11px] font-body uppercase tracking-widest text-muted-foreground w-28 flex-shrink-0">
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.options.map((opt) => {
                    const active = (filters[group.key] || []).includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleFilter(group.key, opt)}
                        className={`filter-chip text-[11px] py-1 px-3 transition-all ${
                          active
                            ? "bg-foreground text-background border-foreground"
                            : "hover:border-foreground/40"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sort + results count bar */}
          <div className="flex items-center justify-between py-4">
            <span className="text-sm font-body text-muted-foreground">
              {sorted.length} {sorted.length === 1 ? "проект" : sorted.length < 5 ? "проекта" : "проектов"}
              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  className="ml-4 text-xs text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Сбросить фильтры ({activeCount})
                </button>
              )}
            </span>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-xs font-body uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors"
              >
                <Icon name="ArrowUpDown" size={13} />
                {currentSortLabel}
                <Icon name={sortOpen ? "ChevronUp" : "ChevronDown"} size={13} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 bg-background border border-border shadow-lg z-20 min-w-56 animate-fade-in">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setSort(opt.key); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-xs font-body uppercase tracking-widest transition-colors hover:bg-secondary ${
                        sort === opt.key ? "text-foreground bg-secondary" : "text-muted-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project grid */}
          {sorted.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground font-body">
              По выбранным параметрам проектов не найдено
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
              {sorted.map((project, i) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className={`group block hover-lift animate-fade-up delay-${(i % 3) * 100}`}
                >
                  {/* Image */}
                  <div className="img-zoom aspect-[4/3] overflow-hidden bg-muted relative mb-4">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {project.tags.length > 0 && (
                      <div className="absolute top-3 left-3 flex gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-body uppercase tracking-widest bg-background/90 text-foreground px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
                  </div>

                  {/* Info */}
                  <div>
                    <p className="section-label mb-1">{project.type}</p>
                    <h3 className="font-display text-2xl font-medium mb-1 group-hover:text-[hsl(38,60%,45%)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs font-body text-muted-foreground mb-3">{project.subtitle}</p>

                    {/* Specs row */}
                    <div className="flex gap-4 text-xs font-body text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Icon name="Maximize2" size={11} />
                        {project.area} м²
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Layers" size={11} />
                        {project.floors} эт.
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="BedDouble" size={11} />
                        {project.bedrooms} сп.
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="font-display text-2xl font-light text-foreground">
                          {formatPrice(project.price)}
                        </span>
                      </div>
                      <span className="text-xs font-body text-muted-foreground flex items-center gap-1 group-hover:text-[hsl(38,60%,50%)] transition-colors">
                        Подробнее
                        <Icon name="ArrowRight" size={12} />
                      </span>
                    </div>
                    {project.pricePromo && (
                      <p className="text-[11px] font-body text-[hsl(38,60%,50%)] mt-1">{project.pricePromo}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
