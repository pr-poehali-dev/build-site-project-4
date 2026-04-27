import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Layout/Navbar";
import Icon from "@/components/ui/icon";
import { PROJECTS, getProjectBySlug, formatPrice } from "@/data/projects";
import type { Project } from "@/data/projects";

// ─── Anchor tabs config ────────────────────────────────────────────────────
const ANCHOR_TABS = [
  { id: "plans", label: "Планировка" },
  { id: "equipment", label: "Комплектация" },
  { id: "schedule", label: "График строительства" },
  { id: "mortgage", label: "Ипотека" },
];

// ─── Compare context (max 4) ───────────────────────────────────────────────
function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const toggle = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };
  return { compareIds, toggle };
}

// ─── Lightbox ─────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <button className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors z-10" onClick={onClose}>
        <Icon name="X" size={24} />
      </button>
      <button
        className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 flex items-center justify-center text-white hover:border-[hsl(38,60%,50%)] hover:text-[hsl(38,60%,50%)] transition-all z-10"
        onClick={(e) => { e.stopPropagation(); prev(); }}
      >
        <Icon name="ChevronLeft" size={20} />
      </button>
      <button
        className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 flex items-center justify-center text-white hover:border-[hsl(38,60%,50%)] hover:text-[hsl(38,60%,50%)] transition-all z-10"
        onClick={(e) => { e.stopPropagation(); next(); }}
      >
        <Icon name="ChevronRight" size={20} />
      </button>
      <img
        src={images[idx]}
        alt=""
        className="max-w-full max-h-[88vh] object-contain animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-sm font-body">
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}

// ─── Compare Drawer ────────────────────────────────────────────────────────
function CompareDrawer({ compareIds, onRemove }: { compareIds: string[]; onRemove: (id: string) => void }) {
  if (!compareIds.length) return null;
  const projects = compareIds.map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean) as Project[];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[hsl(20,10%,6%)] border-t border-white/10 animate-fade-up">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-6 overflow-x-auto">
          <span className="text-xs font-body uppercase tracking-widest text-white/40 flex-shrink-0">
            Сравнение ({compareIds.length}/4)
          </span>
          <div className="flex gap-4 flex-1">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center gap-3 flex-shrink-0 bg-white/5 px-4 py-2">
                <img src={p.images[0]} alt={p.title} className="w-12 h-9 object-cover" />
                <div>
                  <div className="text-xs font-body text-white font-medium">{p.title}</div>
                  <div className="text-[10px] font-body text-white/40">{p.area} м² · {formatPrice(p.price)}</div>
                </div>
                <button onClick={() => onRemove(p.id)} className="text-white/30 hover:text-white ml-2 transition-colors">
                  <Icon name="X" size={12} />
                </button>
              </div>
            ))}
            {Array.from({ length: 4 - projects.length }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-48 h-14 border border-dashed border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-body text-white/20">Добавить проект</span>
              </div>
            ))}
          </div>
          <Link
            to="/projects"
            className="flex-shrink-0 btn-outline border-white/30 text-white text-xs hover:bg-white hover:text-foreground py-2 px-4"
          >
            Сравнить
            <Icon name="ArrowRight" size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = getProjectBySlug(id || "");

  const [slideIdx, setSlideIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);
  const [activeTab, setActiveTab] = useState("plans");
  const [stickyVisible, setStickyVisible] = useState(false);
  const { compareIds, toggle: toggleCompare } = useCompare();
  const [planFloor, setPlanFloor] = useState(0);

  const anchorBarRef = useRef<HTMLDivElement>(null);

  // Sticky anchor bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!anchorBarRef.current) return;
      const rect = anchorBarRef.current.getBoundingClientRect();
      setStickyVisible(rect.top <= 64);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    plans: useRef<HTMLDivElement>(null),
    equipment: useRef<HTMLDivElement>(null),
    schedule: useRef<HTMLDivElement>(null),
    mortgage: useRef<HTMLDivElement>(null),
  };

  function scrollToSection(id: string) {
    setActiveTab(id);
    const el = sectionRefs[id]?.current;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  function openLightbox(i: number) {
    setLightboxStart(i);
    setLightboxOpen(true);
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Navbar />
        <div className="text-center pt-16">
          <h1 className="font-display text-4xl font-light mb-4">Проект не найден</h1>
          <Link to="/projects" className="btn-primary">← Все проекты</Link>
        </div>
      </div>
    );
  }

  const inCompare = compareIds.includes(project.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
            <Icon name="ChevronRight" size={12} />
            <Link to="/projects" className="hover:text-foreground transition-colors">Проекты</Link>
            <Icon name="ChevronRight" size={12} />
            <span className="text-foreground">{project.title}</span>
          </div>
        </div>

        {/* ── Hero: slider + specs ──────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">

            {/* Slider */}
            <div>
              <div className="relative overflow-hidden aspect-[16/10] bg-muted group cursor-pointer" onClick={() => openLightbox(slideIdx)}>
                <img
                  src={project.images[slideIdx]}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                {/* Arrows */}
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-[hsl(38,60%,50%)] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); setSlideIdx((i) => (i - 1 + project.images.length) % project.images.length); }}
                >
                  <Icon name="ChevronLeft" size={18} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-[hsl(38,60%,50%)] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); setSlideIdx((i) => (i + 1) % project.images.length); }}
                >
                  <Icon name="ChevronRight" size={18} />
                </button>
                {/* Zoom hint */}
                <div className="absolute bottom-4 right-4 bg-background/70 backdrop-blur-sm px-3 py-1 text-[10px] font-body uppercase tracking-widest text-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="ZoomIn" size={11} />
                  Увеличить
                </div>
                {/* Counter */}
                <div className="absolute bottom-4 left-4 font-display text-xl text-white">
                  {slideIdx + 1}<span className="text-white/40 text-base"> / {project.images.length}</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-2">
                {project.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIdx(i)}
                    className={`flex-1 aspect-[4/2.5] overflow-hidden transition-opacity ${slideIdx === i ? "opacity-100 ring-1 ring-[hsl(38,60%,50%)]" : "opacity-50 hover:opacity-80"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Specs sidebar */}
            <div>
              <p className="section-label mb-2">{project.type}</p>
              <h1 className="font-display text-4xl font-light mb-1 leading-tight">{project.title}</h1>
              <p className="text-sm font-body text-muted-foreground mb-6">{project.subtitle}</p>

              {/* Price block */}
              <div className="border border-border p-5 mb-4">
                <div className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-1">Стоимость строительства</div>
                <div className="font-display text-3xl font-light mb-2">от {formatPrice(project.price)}</div>
                {project.pricePromo && (
                  <div className="text-[11px] font-body text-[hsl(38,60%,50%)] bg-[hsl(38,60%,50%)]/8 px-3 py-2 border-l-2 border-[hsl(38,60%,50%)]">
                    {project.pricePromo}
                  </div>
                )}
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-px bg-border mb-4">
                {[
                  { label: "Площадь", value: `${project.area} м²`, icon: "Maximize2" },
                  { label: "Этажей", value: project.floors.toString(), icon: "Layers" },
                  { label: "Спален", value: project.bedrooms.toString(), icon: "BedDouble" },
                  { label: "Санузлов", value: project.specs.bathroomCount.toString(), icon: "Bath" },
                  { label: "Высота потолков", value: `${project.specs.ceilingHeight} м`, icon: "ArrowUpDown" },
                  { label: "Срок", value: `${project.completionMonths} мес.`, icon: "Calendar" },
                ].map((s) => (
                  <div key={s.label} className="bg-background p-4">
                    <div className="text-[10px] font-body uppercase tracking-widest text-muted-foreground mb-1">{s.label}</div>
                    <div className="font-display text-xl font-medium">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Materials */}
              <div className="mb-5">
                <div className="text-[10px] font-body uppercase tracking-widest text-muted-foreground mb-2">Возможные материалы</div>
                <div className="flex flex-wrap gap-1.5">
                  {project.materials.map((m) => (
                    <span key={m} className="filter-chip text-[11px] px-3 py-1 cursor-default">{m}</span>
                  ))}
                </div>
                <p className="text-[11px] font-body text-muted-foreground mt-2 leading-relaxed">
                  Проект предусматривает возможность строительства из{" "}
                  <Link to="/info/materialy" className="text-[hsl(38,60%,50%)] hover:underline">
                    {project.materials.join(", ").toLowerCase()}
                  </Link>.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button className="btn-primary w-full justify-center">
                  Рассчитать стоимость
                  <Icon name="Calculator" size={14} />
                </button>
                <button
                  onClick={() => toggleCompare(project.id)}
                  className={`btn-outline w-full justify-center text-xs ${inCompare ? "bg-foreground text-background" : ""}`}
                >
                  <Icon name="GitCompare" size={14} />
                  {inCompare ? "Убрать из сравнения" : "Сравнить проекты"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Anchor bar (inline + sticky clone) ───────────────────────── */}
        <div ref={anchorBarRef} className="border-y border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex overflow-x-auto">
              {ANCHOR_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`flex-shrink-0 px-5 py-4 text-xs font-body uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === tab.id
                      ? "border-[hsl(38,60%,50%)] text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky anchor bar */}
        {stickyVisible && (
          <div className="fixed top-16 left-0 right-0 z-40 bg-background/96 backdrop-blur-sm border-b border-border animate-fade-in shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex overflow-x-auto">
                {ANCHOR_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`flex-shrink-0 px-5 py-3.5 text-xs font-body uppercase tracking-widest transition-all border-b-2 ${
                      activeTab === tab.id
                        ? "border-[hsl(38,60%,50%)] text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Technical specs (full) ────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="section-label mb-3">Описание</p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">{project.description}</p>

              <div className="space-y-0 border-t border-border">
                {[
                  { label: "Общая площадь", value: `${project.specs.totalArea} м²`, link: "/info/ploshchad" },
                  { label: "Жилая площадь", value: `${project.specs.livingArea} м²`, link: "/info/ploshchad" },
                  { label: "Площадь кухни", value: `${project.specs.kitchenArea} м²` },
                  { label: "Количество спален", value: project.specs.bedroomCount },
                  { label: "Количество санузлов", value: project.specs.bathroomCount },
                  project.specs.garageSpaces ? { label: "Гараж", value: `на ${project.specs.garageSpaces} а/м` } : null,
                  { label: "Высота потолков", value: `${project.specs.ceilingHeight} м` },
                  { label: "Фундамент", value: project.specs.foundation },
                  { label: "Кровля", value: project.specs.roof },
                  { label: "Стены", value: project.specs.walls },
                ].filter(Boolean).map((row) => (
                  <div key={row!.label} className="flex justify-between items-center py-3.5 border-b border-border">
                    <span className="text-xs font-body text-muted-foreground uppercase tracking-wide">
                      {row!.link ? (
                        <Link to={row!.link} className="text-[hsl(38,60%,50%)] hover:underline flex items-center gap-1">
                          {row!.label}
                          <Icon name="Info" size={11} />
                        </Link>
                      ) : row!.label}
                    </span>
                    <span className="font-body text-sm font-medium">{row!.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="section-label mb-3">Возможные материалы</p>
              <div className="border border-border p-5 mb-4">
                <p className="text-sm font-body text-muted-foreground leading-relaxed">
                  Проект предусматривает возможность строительства из{" "}
                  <strong className="text-foreground">{project.materials.join(", ").toLowerCase()}</strong>.
                  Выбор материала влияет на теплосбережение, звукоизоляцию, сроки и итоговую стоимость.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {project.materials.map((m) => (
                    <div key={m} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm font-body">{m}</span>
                      <Link to="/info/materialy" className="text-[10px] font-body uppercase tracking-widest text-[hsl(38,60%,50%)] hover:underline flex items-center gap-1">
                        Подробнее <Icon name="ArrowRight" size={10} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-[hsl(20,10%,6%)] p-6">
                <p className="text-xs font-body uppercase tracking-widest text-white/40 mb-2">Остались вопросы?</p>
                <p className="font-display text-2xl font-light text-white mb-4">
                  Обсудим детали вашего проекта
                </p>
                <button className="btn-primary w-full justify-center">
                  Получить консультацию
                  <Icon name="Phone" size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Plans ─────────────────────────────────────────────────────── */}
        <div id="plans" ref={sectionRefs.plans} className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <p className="section-label mb-2">Планировка</p>
            <h2 className="font-display text-4xl font-light mb-8">Планировочные решения</h2>

            {/* Floor tabs */}
            {project.floorPlans.length > 1 && (
              <div className="flex gap-2 mb-8">
                {project.floorPlans.map((fp, i) => (
                  <button
                    key={i}
                    onClick={() => setPlanFloor(i)}
                    className={`filter-chip text-xs px-4 py-2 ${planFloor === i ? "bg-foreground text-background border-foreground" : ""}`}
                  >
                    {fp.label}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start">
              {/* Plan image — click to zoom */}
              <div
                className="bg-muted overflow-hidden cursor-zoom-in group relative"
                onClick={() => openLightbox(0)}
              >
                <img
                  src={project.floorPlans[planFloor]?.image}
                  alt={`Планировка ${project.floorPlans[planFloor]?.label}`}
                  className="w-full object-contain max-h-[500px] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-3 py-1.5 text-[10px] font-body uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="ZoomIn" size={11} />
                  Увеличить
                </div>
              </div>

              {/* Rooms list */}
              <div>
                <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-4">
                  {project.floorPlans[planFloor]?.label} — состав помещений
                </p>
                <div className="space-y-0">
                  {project.floorPlans[planFloor]?.rooms.map((room) => (
                    <div key={room.name} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                      <span className="text-sm font-body">{room.name}</span>
                      <span className="text-sm font-body text-muted-foreground">{room.area} м²</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-body uppercase tracking-widest text-muted-foreground">Итого</span>
                    <span className="font-display text-lg font-medium">
                      {project.floorPlans[planFloor]?.rooms.reduce((s, r) => s + r.area, 0)} м²
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Equipment ────────────────────────────────────────────────── */}
        <div id="equipment" ref={sectionRefs.equipment} className="border-t border-border bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <p className="section-label mb-2">Состав работ</p>
            <h2 className="font-display text-4xl font-light mb-8">Комплектация</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Фундамент",
                  items: ["Геодезическая разбивка", "Земляные работы", "Монтаж опалубки", "Армирование", "Бетонирование", "Гидроизоляция"],
                },
                {
                  title: "Коробка дома",
                  items: ["Кладка стен", "Перекрытия", "Лестница", "Кровельная конструкция", "Кровельное покрытие", "Фасадные работы"],
                },
                {
                  title: "Инженерия",
                  items: ["Электроснабжение", "Отопление", "Водоснабжение", "Канализация", "Вентиляция", "Слаботочные системы"],
                },
              ].map((section) => (
                <div key={section.title} className="bg-background p-6">
                  <h3 className="font-display text-xl font-medium mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                        <span className="text-[hsl(38,60%,50%)] mt-0.5 flex-shrink-0">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Schedule ─────────────────────────────────────────────────── */}
        <div id="schedule" ref={sectionRefs.schedule} className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <p className="section-label mb-2">Сроки</p>
            <h2 className="font-display text-4xl font-light mb-8">
              График строительства — {project.completionMonths} месяцев
            </h2>
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-8 pl-12">
                {[
                  { month: "1–2", title: "Подготовительный этап", desc: "Геодезия, подготовка участка, завоз материалов, устройство фундамента" },
                  { month: "2–4", title: "Коробка дома", desc: "Возведение стен, монтаж перекрытий, кровельные работы" },
                  { month: "4–5", title: "Инженерные системы", desc: "Прокладка электрики, водоснабжения, отопления, канализации" },
                  { month: `5–${project.completionMonths}`, title: "Отделочные работы", desc: "Внутренняя и внешняя отделка, установка дверей, окон, финишные работы" },
                ].map((step, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-12 w-8 h-8 bg-background border border-[hsl(38,60%,50%)] flex items-center justify-center">
                      <span className="text-[10px] font-body text-[hsl(38,60%,50%)] font-medium">{i + 1}</span>
                    </div>
                    <div className="text-[10px] font-body uppercase tracking-widest text-[hsl(38,60%,50%)] mb-1">
                      Месяц {step.month}
                    </div>
                    <h3 className="font-display text-lg font-medium mb-1">{step.title}</h3>
                    <p className="text-sm font-body text-muted-foreground">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mortgage ─────────────────────────────────────────────────── */}
        <div id="mortgage" ref={sectionRefs.mortgage} className="border-t border-border bg-[hsl(20,10%,6%)]">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <p className="section-label text-[hsl(38,60%,60%)] mb-2">Финансирование</p>
            <h2 className="font-display text-4xl font-light text-white mb-8">Ипотека</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { bank: "Сбербанк", rate: "от 6,1%", term: "до 30 лет", down: "от 20%" },
                { bank: "ВТБ", rate: "от 6,4%", term: "до 30 лет", down: "от 15%" },
                { bank: "Россельхозбанк", rate: "от 5,5%", term: "до 25 лет", down: "от 10%" },
              ].map((bank) => (
                <div key={bank.bank} className="border border-white/10 p-6">
                  <div className="font-display text-xl font-medium text-white mb-4">{bank.bank}</div>
                  <div className="space-y-3">
                    {[["Ставка", bank.rate], ["Срок", bank.term], ["Первый взнос", bank.down]].map(([label, val]) => (
                      <div key={label} className="flex justify-between items-center">
                        <span className="text-xs font-body text-white/40 uppercase tracking-wide">{label}</span>
                        <span className="text-sm font-body text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn-outline border-white/20 text-white hover:bg-white hover:text-foreground w-full justify-center mt-5 text-xs py-2">
                    Рассчитать
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs font-body text-white/30 text-center">
              * Условия носят информационный характер. Точные ставки уточняйте в банках.
            </p>
          </div>
        </div>

        {/* ── Other projects ────────────────────────────────────────────── */}
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label mb-2">Смотрите также</p>
                <h2 className="font-display text-4xl font-light">Похожие проекты</h2>
              </div>
              <Link to="/projects" className="btn-outline hidden md:flex text-xs">
                Все проекты <Icon name="ArrowRight" size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROJECTS.filter((p) => p.id !== project.id).slice(0, 3).map((p) => (
                <Link key={p.id} to={`/projects/${p.slug}`} className="group hover-lift block">
                  <div className="img-zoom aspect-[4/3] overflow-hidden bg-muted mb-3">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="section-label mb-1">{p.type}</p>
                  <h3 className="font-display text-xl font-medium mb-1 group-hover:text-[hsl(38,60%,45%)] transition-colors">{p.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-body text-muted-foreground">{p.area} м²</span>
                    <span className="font-display text-lg font-light">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={project.images}
          startIndex={lightboxStart}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Compare drawer */}
      <CompareDrawer compareIds={compareIds} onRemove={toggleCompare} />
    </div>
  );
}
