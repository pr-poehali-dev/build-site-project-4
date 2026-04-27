import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Navbar from "@/components/Layout/Navbar";

const IMG1 = "https://cdn.poehali.dev/projects/3992aec9-f015-477c-8de1-d9314a23b644/files/b958361d-739d-469e-a932-f1e3a1809d8d.jpg";
const IMG2 = "https://cdn.poehali.dev/projects/3992aec9-f015-477c-8de1-d9314a23b644/files/02fc9ad1-0d83-4965-a69f-07f5faa80de1.jpg";
const IMG3 = "https://cdn.poehali.dev/projects/3992aec9-f015-477c-8de1-d9314a23b644/files/ba07babe-cd5c-4c85-bd91-bec6d937429c.jpg";



const BLOG_POSTS = [
  { id: 1, date: "18 апреля 2025", tag: "Тренды", title: "Биофильный дизайн: природа как архитектурный элемент", excerpt: "Как интеграция живой природы в архитектуру меняет восприятие пространства и влияет на качество жизни." },
  { id: 2, date: "5 марта 2025", tag: "Технологии", title: "BIM-проектирование: точность до миллиметра", excerpt: "Информационное моделирование зданий как стандарт современного проектирования — преимущества и практика." },
  { id: 3, date: "20 февраля 2025", tag: "Материалы", title: "Камень против бетона: выбор фасадного материала", excerpt: "Сравнительный анализ долговечности, эстетики и стоимости двух ключевых фасадных решений." },
];

const MAP_OBJECTS = [
  { id: 1, x: 42, y: 38, title: "БЦ «Северный»", type: "Коммерческое", city: "Москва" },
  { id: 2, x: 55, y: 45, title: "ЖК «Рассвет»", type: "Жилой комплекс", city: "Москва" },
  { id: 3, x: 38, y: 52, title: "Резиденция «Берёзовый лес»", type: "Частный дом", city: "Подмосковье" },
  { id: 4, x: 62, y: 72, title: "Вилла «Горизонт»", type: "Частный дом", city: "Сочи" },
  { id: 5, x: 30, y: 60, title: "ЗК «Тишина»", type: "Коммерческое", city: "Подмосковье" },
  { id: 6, x: 48, y: 55, title: "ТХ «Сосновый бор»", type: "Жилой комплекс", city: "Подмосковье" },
];

const SERVICES = [
  { icon: "Layers", title: "Концепция и эскиз", desc: "Разработка архитектурной концепции, объёмно-планировочных решений, визуализация" },
  { icon: "FileText", title: "Проектная документация", desc: "Полный пакет рабочей документации в соответствии со строительными нормами РФ" },
  { icon: "Ruler", title: "Инженерные системы", desc: "Проектирование инженерных сетей: вентиляция, отопление, электрика, водоснабжение" },
  { icon: "Building2", title: "Авторский надзор", desc: "Сопровождение строительства, контроль соответствия проекту на всех этапах" },
];


export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [slideIndex, setSlideIndex] = useState(0);
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [hoveredPin, setHoveredPin] = useState<number | null>(null);
  const [calcValues, setCalcValues] = useState({ area: 300, floors: 2, material: "brick", extras: [] as string[] });
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLElement>> = {
    home: useRef<HTMLElement>(null),
    projects: useRef<HTMLElement>(null),
    portfolio: useRef<HTMLElement>(null),
    design: useRef<HTMLElement>(null),
    about: useRef<HTMLElement>(null),
    contacts: useRef<HTMLElement>(null),
    blog: useRef<HTMLElement>(null),
  };

  function scrollTo(id: string) {
    setActiveSection(id);
    const el = sectionRefs[id]?.current;
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.3 }
    );
    Object.values(sectionRefs).forEach((r) => {
      if (r.current) observer.observe(r.current);
    });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slides = [IMG1, IMG2, IMG3];

  function calcPrice() {
    const base = calcValues.area * (calcValues.material === "brick" ? 65000 : calcValues.material === "wood" ? 55000 : 75000);
    const floorMult = 1 + (calcValues.floors - 1) * 0.15;
    const extras = calcValues.extras.length * calcValues.area * 3000;
    setCalcResult(Math.round(base * floorMult + extras));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section id="home" ref={sectionRefs.home as React.RefObject<HTMLDivElement>} className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0 img-zoom">
          <img src={IMG1} alt="Архитектурный рендер" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-32 w-full">
          <div className="max-w-2xl">
            <p className="section-label text-[hsl(38,60%,70%)] mb-4 animate-fade-up">Архитектурное бюро</p>
            <h1 className="font-display text-6xl md:text-8xl font-light text-white leading-none mb-6 animate-fade-up delay-100">
              Создаём<br />
              <span className="italic font-normal" style={{ color: "hsl(38,75%,72%)", textShadow: "0 0 40px hsla(38,80%,55%,0.4)" }}>пространства</span><br />
              для жизни
            </h1>
            <p className="font-body text-white/85 text-sm leading-relaxed max-w-md mb-10 animate-fade-up delay-200">
              Более 15 лет мы проектируем и строим объекты, которые становятся частью городской среды. Частные дома, жилые комплексы, коммерческая недвижимость.
            </p>
            <div className="flex gap-4 animate-fade-up delay-300">
              <Link to="/projects" className="btn-primary bg-white text-foreground border-white hover:bg-[hsl(38,60%,50%)] hover:border-[hsl(38,60%,50%)] hover:text-white">
                Смотреть проекты
                <Icon name="ArrowRight" size={14} />
              </Link>
              <button onClick={() => scrollTo("contacts")} className="btn-primary bg-transparent border-2 border-white text-white hover:bg-white hover:text-foreground">
                Консультация
              </button>
            </div>
          </div>
          <div className="absolute bottom-8 right-6 flex items-center gap-8 text-white/60 text-xs font-body tracking-widest uppercase">
            <div className="text-center">
              <div className="font-display text-3xl font-light text-white mb-1">127</div>
              <div>проектов</div>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <div className="font-display text-3xl font-light text-white mb-1">15</div>
              <div>лет опыта</div>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <div className="font-display text-3xl font-light text-white mb-1">3</div>
              <div>страны</div>
            </div>
          </div>
        </div>
        <button
          onClick={() => scrollTo("projects")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50 hover:text-white transition-colors animate-bounce"
        >
          <Icon name="ChevronDown" size={24} />
        </button>
      </section>

      {/* PROJECTS PREVIEW */}
      <section id="projects" ref={sectionRefs.projects as React.RefObject<HTMLDivElement>} className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="section-label mb-3">Наши работы</p>
            <h2 className="font-display text-5xl font-light">Проекты домов</h2>
          </div>
          <Link to="/projects" className="btn-outline flex-shrink-0">
            Все проекты
            <Icon name="ArrowRight" size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Эверест 148", type: "Дом из газобетона", area: 148, price: "от 4,2 млн ₽", img: IMG1, slug: "everest-148" },
            { title: "Орион 195", type: "Дом из кирпича", area: 195, price: "от 6,8 млн ₽", img: IMG2, slug: "orion-195" },
            { title: "Кедр 112", type: "Дом из бруса", area: 112, price: "от 3,15 млн ₽", img: IMG3, slug: "cedar-112" },
            { title: "Атлас 240", type: "Дом из керамоблока", area: 240, price: "от 9,5 млн ₽", img: IMG1, slug: "atlas-240" },
          ].map((p, i) => (
            <Link key={p.slug} to={`/projects/${p.slug}`} className={`group hover-lift block animate-fade-up delay-${i * 100}`}>
              <div className="img-zoom aspect-[3/4] overflow-hidden bg-muted mb-3">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <p className="section-label mb-1">{p.type}</p>
              <h3 className="font-display text-lg font-medium mb-1 group-hover:text-[hsl(38,60%,45%)] transition-colors">{p.title}</h3>
              <div className="flex justify-between items-center text-sm font-body text-muted-foreground">
                <span>{p.area} м²</span>
                <span className="font-display text-base text-foreground">{p.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PORTFOLIO SLIDER */}
      <section id="portfolio" ref={sectionRefs.portfolio as React.RefObject<HTMLDivElement>} className="bg-[hsl(20,10%,6%)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label text-[hsl(38,60%,60%)] mb-3">Детали объектов</p>
              <h2 className="font-display text-5xl font-light text-white">Портфолио</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="slide-counter">{slideIndex + 1}<span className="text-white/30 text-lg"> / {slides.length}</span></span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSlideIndex((i) => (i - 1 + slides.length) % slides.length)}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-[hsl(38,60%,50%)] hover:text-[hsl(38,60%,50%)] transition-colors"
                >
                  <Icon name="ArrowLeft" size={16} />
                </button>
                <button
                  onClick={() => setSlideIndex((i) => (i + 1) % slides.length)}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-[hsl(38,60%,50%)] hover:text-[hsl(38,60%,50%)] transition-colors"
                >
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden aspect-[16/7] bg-[hsl(20,10%,10%)] group cursor-zoom-in" onClick={() => setZoomImg(slides[slideIndex])}>
            <img
              src={slides[slideIndex]}
              alt="Портфолио"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              style={{ transition: "all 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon name="ZoomIn" size={20} className="text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div
                className="h-full bg-[hsl(38,60%,50%)] transition-all duration-500"
                style={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`flex-1 aspect-[4/2] overflow-hidden transition-opacity ${slideIndex === i ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
              >
                <img src={s} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DESIGN / Проектирование */}
      <section id="design" ref={sectionRefs.design as React.RefObject<HTMLDivElement>} className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <p className="section-label mb-3">Что мы делаем</p>
            <h2 className="font-display text-5xl font-light mb-6 leading-tight">
              Проектирование<br />
              <span className="italic text-muted-foreground">от идеи до документа</span>
            </h2>
            <p className="font-body text-muted-foreground text-sm leading-relaxed mb-8">
              Полный цикл проектных работ — от первичной концепции и эскизного проектирования до рабочей документации и авторского надзора. Работаем по всей России и ближнему зарубежью.
            </p>
            <button onClick={() => scrollTo("contacts")} className="btn-primary">
              Обсудить проект
              <Icon name="ArrowRight" size={14} />
            </button>
          </div>
          <div className="img-zoom aspect-square overflow-hidden">
            <img src={IMG2} alt="Проектирование" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {SERVICES.map((s, i) => (
            <div key={i} className="bg-background p-8 hover:bg-secondary transition-colors group">
              <div className="w-10 h-10 border border-border flex items-center justify-center mb-6 group-hover:border-[hsl(38,60%,50%)] transition-colors">
                <Icon name={s.icon} fallback="Layers" size={18} className="text-muted-foreground group-hover:text-[hsl(38,60%,50%)] transition-colors" />
              </div>
              <h3 className="font-display text-xl font-medium mb-3">{s.title}</h3>
              <p className="text-xs font-body text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAP */}
      <section className="bg-secondary/50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="section-label mb-3">География присутствия</p>
            <h2 className="font-display text-5xl font-light">Карта объектов</h2>
          </div>
          <div className="relative bg-[hsl(30,8%,92%)] overflow-hidden" style={{ height: "480px" }}>
            {/* Simplified Russia map background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[hsl(30,6%,78%)] font-display text-6xl font-light select-none">Россия</div>
            </div>
            {/* Grid lines */}
            {[20, 40, 60, 80].map((v) => (
              <div key={v} className="absolute top-0 bottom-0 border-l border-[hsl(30,6%,86%)]" style={{ left: `${v}%` }} />
            ))}
            {[25, 50, 75].map((v) => (
              <div key={v} className="absolute left-0 right-0 border-t border-[hsl(30,6%,86%)]" style={{ top: `${v}%` }} />
            ))}
            {/* Pins */}
            {MAP_OBJECTS.map((obj) => (
              <div
                key={obj.id}
                className="absolute"
                style={{ left: `${obj.x}%`, top: `${obj.y}%`, transform: "translate(-50%,-50%)" }}
                onMouseEnter={() => setHoveredPin(obj.id)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <div className="map-pin" />
                {hoveredPin === obj.id && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-body p-3 min-w-40 z-10 shadow-xl animate-fade-in">
                    <div className="font-medium mb-0.5">{obj.title}</div>
                    <div className="text-background/60">{obj.type} · {obj.city}</div>
                  </div>
                )}
              </div>
            ))}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              {[{ color: "bg-[hsl(38,60%,50%)]", label: "Частный дом" }, { color: "bg-foreground", label: "Жилой комплекс" }, { color: "bg-muted-foreground", label: "Коммерческое" }].map((l) => (
                <div key={l.label} className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                  <div className={`w-2 h-2 rounded-full ${l.color}`} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="py-24 px-6 bg-[hsl(20,10%,6%)]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="section-label text-[hsl(38,60%,60%)] mb-3">Планируете строительство?</p>
            <h2 className="font-display text-5xl font-light text-white">Калькулятор стоимости</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <label className="text-xs font-body text-white/50 uppercase tracking-widest mb-3 block">
                  Площадь объекта: <span className="text-[hsl(38,60%,60%)]">{calcValues.area} м²</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={10000}
                  step={50}
                  value={calcValues.area}
                  onChange={(e) => setCalcValues((v) => ({ ...v, area: +e.target.value }))}
                  className="w-full accent-[hsl(38,60%,50%)] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/30 font-body mt-1">
                  <span>50 м²</span><span>10 000 м²</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-body text-white/50 uppercase tracking-widest mb-3 block">
                  Этажность: <span className="text-[hsl(38,60%,60%)]">{calcValues.floors} эт.</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((f) => (
                    <button
                      key={f}
                      onClick={() => setCalcValues((v) => ({ ...v, floors: f }))}
                      className={`w-12 h-12 border font-body text-sm transition-all ${calcValues.floors === f ? "border-[hsl(38,60%,50%)] bg-[hsl(38,60%,50%)] text-white" : "border-white/20 text-white/50 hover:border-white/50"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-body text-white/50 uppercase tracking-widest mb-3 block">Основной материал</label>
                <div className="flex flex-col gap-2">
                  {[{ key: "brick", label: "Кирпич", price: "от 65 000 ₽/м²" }, { key: "wood", label: "Дерево / брус", price: "от 55 000 ₽/м²" }, { key: "monolith", label: "Монолит", price: "от 75 000 ₽/м²" }].map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setCalcValues((v) => ({ ...v, material: m.key }))}
                      className={`flex justify-between items-center px-4 py-3 border text-sm font-body transition-all ${calcValues.material === m.key ? "border-[hsl(38,60%,50%)] bg-[hsl(38,60%,50%)]/10 text-[hsl(38,60%,60%)]" : "border-white/10 text-white/50 hover:border-white/30"}`}
                    >
                      <span>{m.label}</span>
                      <span className="text-xs">{m.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-body text-white/50 uppercase tracking-widest mb-3 block">Дополнительно</label>
                <div className="flex flex-wrap gap-2">
                  {["Дизайн интерьера", "Ландшафт", "Инженерные сети", "Авторский надзор"].map((ex) => {
                    const active = calcValues.extras.includes(ex);
                    return (
                      <button
                        key={ex}
                        onClick={() => setCalcValues((v) => ({ ...v, extras: active ? v.extras.filter((e) => e !== ex) : [...v.extras, ex] }))}
                        className={`filter-chip text-xs transition-all ${active ? "bg-[hsl(38,60%,50%)] border-[hsl(38,60%,50%)] text-white" : "border-white/20 text-white/50 hover:border-white/40"}`}
                      >
                        {ex}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button onClick={calcPrice} className="btn-primary w-full justify-center">
                Рассчитать стоимость
                <Icon name="Calculator" size={14} />
              </button>
            </div>

            <div className="flex flex-col justify-center">
              {calcResult ? (
                <div className="border border-[hsl(38,60%,50%)]/30 p-10 animate-fade-up">
                  <p className="text-xs font-body text-white/40 uppercase tracking-widest mb-4">Ориентировочная стоимость</p>
                  <div className="font-display text-5xl font-light text-[hsl(38,60%,60%)] mb-4">
                    {formatPrice(calcResult)}
                  </div>
                  <div className="space-y-2 text-xs font-body text-white/40 mb-8">
                    <div className="flex justify-between"><span>Площадь</span><span>{calcValues.area} м²</span></div>
                    <div className="flex justify-between"><span>Этажей</span><span>{calcValues.floors}</span></div>
                    <div className="flex justify-between"><span>Материал</span><span>{calcValues.material === "brick" ? "Кирпич" : calcValues.material === "wood" ? "Дерево" : "Монолит"}</span></div>
                  </div>
                  <p className="text-xs text-white/30 font-body leading-relaxed mb-6">
                    * Расчёт является ориентировочным. Точная стоимость определяется после изучения технического задания.
                  </p>
                  <button onClick={() => scrollTo("contacts")} className="btn-primary w-full justify-center text-xs">
                    Получить точный расчёт
                  </button>
                </div>
              ) : (
                <div className="border border-white/10 p-10 text-center">
                  <div className="font-display text-6xl font-light text-white/10 mb-4">₽</div>
                  <p className="text-sm font-body text-white/30">Заполните параметры и нажмите кнопку расчёта</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={sectionRefs.about as React.RefObject<HTMLDivElement>} className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="img-zoom aspect-[3/4] overflow-hidden">
            <img src={IMG3} alt="О компании" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="section-label mb-3">Кто мы</p>
            <h2 className="font-display text-5xl font-light mb-8 leading-tight">
              Архитектурное бюро<br />
              <span className="italic text-muted-foreground">с 2009 года</span>
            </h2>
            <div className="space-y-4 font-body text-sm text-muted-foreground leading-relaxed mb-10">
              <p>АРКА — независимое архитектурное бюро, основанное командой архитекторов с опытом работы в ведущих европейских мастерских. Мы специализируемся на объектах, где форма и функция существуют в равновесии.</p>
              <p>Наш подход строится на глубоком изучении контекста каждого участка: климата, ландшафта, традиций местной архитектуры. Мы не производим типовых решений — каждый проект уникален.</p>
              <p>За 15 лет мы реализовали 127 проектов в России и за рубежом — от камерных частных резиденций до многофункциональных жилых комплексов.</p>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              {[{ n: "127", label: "реализованных проектов" }, { n: "38", label: "наград и премий" }, { n: "3", label: "страны присутствия" }].map((s) => (
                <div key={s.n}>
                  <div className="font-display text-4xl font-light text-gold mb-1">{s.n}</div>
                  <div className="text-xs font-body text-muted-foreground leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" ref={sectionRefs.blog as React.RefObject<HTMLDivElement>} className="py-24 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">Экспертиза</p>
              <h2 className="font-display text-5xl font-light">Блог</h2>
            </div>
            <button className="btn-outline hidden md:flex">
              Все публикации
              <Icon name="ArrowRight" size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, i) => (
              <article key={post.id} className={`animate-fade-up delay-${i * 100 + 100}`}>
                <div className="aspect-[4/3] img-zoom overflow-hidden bg-muted mb-6">
                  <img src={[IMG1, IMG2, IMG3][i]} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="section-label">{post.tag}</span>
                  <span className="text-xs text-muted-foreground font-body">{post.date}</span>
                </div>
                <h3 className="font-display text-xl font-medium mb-3 leading-snug hover:text-[hsl(38,60%,45%)] transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-xs font-body text-muted-foreground leading-relaxed">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" ref={sectionRefs.contacts as React.RefObject<HTMLDivElement>} className="py-24 px-6 bg-[hsl(20,10%,6%)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="section-label text-[hsl(38,60%,60%)] mb-3">Свяжитесь с нами</p>
              <h2 className="font-display text-5xl font-light text-white mb-8 leading-tight">
                Обсудим<br />
                <span className="italic text-white/40">ваш проект</span>
              </h2>
              <div className="space-y-6">
                {[{ icon: "Phone", label: "Телефон", value: "+7 (495) 123-45-67" }, { icon: "Mail", label: "Email", value: "info@arka-arch.ru" }, { icon: "MapPin", label: "Адрес", value: "Москва, Тверская ул., 10, оф. 204" }].map((c) => (
                  <div key={c.label} className="flex items-start gap-4">
                    <div className="w-8 h-8 border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={c.icon} fallback="Phone" size={14} className="text-[hsl(38,60%,60%)]" />
                    </div>
                    <div>
                      <div className="text-xs font-body text-white/30 uppercase tracking-widest mb-1">{c.label}</div>
                      <div className="text-sm font-body text-white">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-body text-white/40 uppercase tracking-widest mb-2 block">Имя</label>
                    <input type="text" placeholder="Александр" className="w-full bg-transparent border-b border-white/20 pb-3 text-white font-body text-sm outline-none placeholder:text-white/20 focus:border-[hsl(38,60%,50%)] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-body text-white/40 uppercase tracking-widest mb-2 block">Телефон</label>
                    <input type="tel" placeholder="+7 (999) 000-00-00" className="w-full bg-transparent border-b border-white/20 pb-3 text-white font-body text-sm outline-none placeholder:text-white/20 focus:border-[hsl(38,60%,50%)] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-body text-white/40 uppercase tracking-widest mb-2 block">Email</label>
                  <input type="email" placeholder="your@email.ru" className="w-full bg-transparent border-b border-white/20 pb-3 text-white font-body text-sm outline-none placeholder:text-white/20 focus:border-[hsl(38,60%,50%)] transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-body text-white/40 uppercase tracking-widest mb-2 block">Расскажите о проекте</label>
                  <textarea rows={4} placeholder="Тип объекта, площадь, бюджет, сроки..." className="w-full bg-transparent border-b border-white/20 pb-3 text-white font-body text-sm outline-none placeholder:text-white/20 focus:border-[hsl(38,60%,50%)] transition-colors resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  Отправить заявку
                  <Icon name="Send" size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[hsl(20,10%,4%)] px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-lg tracking-widest text-white/60 uppercase">АРКА</div>
          <div className="text-xs font-body text-white/30 text-center">
            © 2009–2025 Архитектурное бюро АРКА. Все права защищены.
          </div>
          <div className="flex gap-6">
            {["ВКонтакте", "Telegram", "Pinterest"].map((s) => (
              <a key={s} href="#" className="text-xs font-body text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest">
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Zoom modal */}
      {zoomImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setZoomImg(null)}
        >
          <button className="absolute top-6 right-6 text-white/60 hover:text-white">
            <Icon name="X" size={24} />
          </button>
          <img
            src={zoomImg}
            alt="Увеличенное изображение"
            className="max-w-full max-h-full object-contain animate-fade-up"
            style={{ maxHeight: "90vh" }}
          />
        </div>
      )}
    </div>
  );
}