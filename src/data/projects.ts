export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  type: "Дом из газобетона" | "Дом из кирпича" | "Дом из бруса" | "Дом из керамоблока";
  area: number;
  floors: number;
  bedrooms: number;
  price: number;
  pricePromo?: string;
  year: number;
  images: string[];
  materials: string[];
  tags: string[];
  specs: {
    totalArea: number;
    livingArea: number;
    kitchenArea: number;
    bedroomCount: number;
    bathroomCount: number;
    garageSpaces?: number;
    ceilingHeight: number;
    foundation: string;
    roof: string;
    walls: string;
  };
  description: string;
  floorPlans: {
    floor: number;
    label: string;
    image: string;
    rooms: { name: string; area: number }[];
  }[];
  completionMonths: number;
}

const IMG1 = "https://cdn.poehali.dev/projects/3992aec9-f015-477c-8de1-d9314a23b644/files/b958361d-739d-469e-a932-f1e3a1809d8d.jpg";
const IMG2 = "https://cdn.poehali.dev/projects/3992aec9-f015-477c-8de1-d9314a23b644/files/02fc9ad1-0d83-4965-a69f-07f5faa80de1.jpg";
const IMG3 = "https://cdn.poehali.dev/projects/3992aec9-f015-477c-8de1-d9314a23b644/files/ba07babe-cd5c-4c85-bd91-bec6d937429c.jpg";

export const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "everest-148",
    title: "Эверест 148",
    subtitle: "Одноэтажный дом с панорамными окнами",
    type: "Дом из газобетона",
    area: 148,
    floors: 1,
    bedrooms: 3,
    price: 4200000,
    pricePromo: "Скидка 10% при заключении договора до 30 июня",
    year: 2024,
    images: [IMG1, IMG2, IMG3, IMG1],
    materials: ["Газобетон", "Кирпич", "Керамоблок"],
    tags: ["Популярный", "Просторный"],
    specs: {
      totalArea: 148,
      livingArea: 98,
      kitchenArea: 22,
      bedroomCount: 3,
      bathroomCount: 2,
      ceilingHeight: 3.0,
      foundation: "Монолитная плита",
      roof: "Двускатная, металлочерепица",
      walls: "Газобетон D400, 400мм",
    },
    description:
      "Просторный одноэтажный дом с открытой планировкой гостиной-кухни. Панорамные окна от пола до потолка наполняют пространство светом. Три спальни, два санузла и удобная постирочная.",
    floorPlans: [
      {
        floor: 1,
        label: "1 этаж",
        image: IMG2,
        rooms: [
          { name: "Гостиная", area: 32 },
          { name: "Кухня-столовая", area: 22 },
          { name: "Спальня 1", area: 18 },
          { name: "Спальня 2", area: 14 },
          { name: "Спальня 3", area: 12 },
          { name: "Санузел 1", area: 8 },
          { name: "Санузел 2", area: 5 },
          { name: "Постирочная", area: 6 },
          { name: "Холл", area: 12 },
          { name: "Терраса", area: 19 },
        ],
      },
    ],
    completionMonths: 6,
  },
  {
    id: "2",
    slug: "orion-195",
    title: "Орион 195",
    subtitle: "Двухэтажный дом для большой семьи",
    type: "Дом из кирпича",
    area: 195,
    floors: 2,
    bedrooms: 4,
    price: 6800000,
    year: 2024,
    images: [IMG2, IMG3, IMG1, IMG2],
    materials: ["Кирпич", "Газобетон"],
    tags: ["Новинка"],
    specs: {
      totalArea: 195,
      livingArea: 130,
      kitchenArea: 28,
      bedroomCount: 4,
      bathroomCount: 3,
      garageSpaces: 1,
      ceilingHeight: 2.8,
      foundation: "Ленточный монолит",
      roof: "Вальмовая, натуральная черепица",
      walls: "Кирпич полнотелый, 510мм",
    },
    description:
      "Классический двухэтажный дом с гаражом на одну машину. Первый этаж — открытое пространство кухни и гостиной, гостевой санузел и кабинет. Второй — четыре спальни, включая мастер-спальню с гардеробной.",
    floorPlans: [
      {
        floor: 1,
        label: "1 этаж",
        image: IMG1,
        rooms: [
          { name: "Гостиная", area: 36 },
          { name: "Кухня-столовая", area: 28 },
          { name: "Кабинет", area: 14 },
          { name: "Санузел", area: 5 },
          { name: "Гараж", area: 22 },
          { name: "Холл", area: 14 },
        ],
      },
      {
        floor: 2,
        label: "2 этаж",
        image: IMG3,
        rooms: [
          { name: "Мастер-спальня", area: 22 },
          { name: "Гардеробная", area: 8 },
          { name: "Спальня 2", area: 16 },
          { name: "Спальня 3", area: 14 },
          { name: "Спальня 4", area: 13 },
          { name: "Санузел 1", area: 9 },
          { name: "Санузел 2", area: 6 },
          { name: "Холл 2 эт.", area: 18 },
        ],
      },
    ],
    completionMonths: 8,
  },
  {
    id: "3",
    slug: "cedar-112",
    title: "Кедр 112",
    subtitle: "Уютный дом из бруса в скандинавском стиле",
    type: "Дом из бруса",
    area: 112,
    floors: 1,
    bedrooms: 2,
    price: 3150000,
    pricePromo: "Акция: отделка в подарок при заказе до конца месяца",
    year: 2023,
    images: [IMG3, IMG1, IMG2, IMG3],
    materials: ["Брус", "Газобетон"],
    tags: ["Хит продаж", "Скандинавский стиль"],
    specs: {
      totalArea: 112,
      livingArea: 74,
      kitchenArea: 18,
      bedroomCount: 2,
      bathroomCount: 1,
      ceilingHeight: 2.9,
      foundation: "Свайно-ростверковый",
      roof: "Двускатная, мягкая кровля",
      walls: "Клееный брус 200×200мм",
    },
    description:
      "Компактный и функциональный дом из клееного бруса. Открытая гостиная с высоким потолком и деревянными балками, две спальни, просторная терраса — всё для уединённой загородной жизни.",
    floorPlans: [
      {
        floor: 1,
        label: "1 этаж",
        image: IMG2,
        rooms: [
          { name: "Гостиная", area: 28 },
          { name: "Кухня", area: 18 },
          { name: "Спальня 1", area: 16 },
          { name: "Спальня 2", area: 14 },
          { name: "Санузел", area: 9 },
          { name: "Холл", area: 10 },
          { name: "Терраса", area: 17 },
        ],
      },
    ],
    completionMonths: 5,
  },
  {
    id: "4",
    slug: "atlas-240",
    title: "Атлас 240",
    subtitle: "Представительный дом с эркером и террасой",
    type: "Дом из керамоблока",
    area: 240,
    floors: 2,
    bedrooms: 5,
    price: 9500000,
    year: 2023,
    images: [IMG1, IMG3, IMG2, IMG1],
    materials: ["Керамоблок", "Кирпич"],
    tags: ["Премиум"],
    specs: {
      totalArea: 240,
      livingArea: 162,
      kitchenArea: 34,
      bedroomCount: 5,
      bathroomCount: 4,
      garageSpaces: 2,
      ceilingHeight: 3.2,
      foundation: "Монолитная плита с ребрами жёсткости",
      roof: "Многощипцовая, керамическая черепица",
      walls: "Керамоблок Porotherm 44, 440мм",
    },
    description:
      "Представительный двухэтажный дом с гаражом на два автомобиля. Эркер в гостиной, просторная открытая терраса, пять спален — идеальный вариант для большой семьи, ценящей пространство и комфорт.",
    floorPlans: [
      {
        floor: 1,
        label: "1 этаж",
        image: IMG3,
        rooms: [
          { name: "Гостиная с эркером", area: 44 },
          { name: "Кухня-столовая", area: 34 },
          { name: "Кабинет", area: 16 },
          { name: "Гостевая спальня", area: 14 },
          { name: "Санузел 1", area: 7 },
          { name: "Гараж", area: 40 },
          { name: "Терраса", area: 28 },
          { name: "Холл", area: 18 },
        ],
      },
      {
        floor: 2,
        label: "2 этаж",
        image: IMG1,
        rooms: [
          { name: "Мастер-спальня", area: 28 },
          { name: "Гардеробная", area: 10 },
          { name: "Спальня 2", area: 18 },
          { name: "Спальня 3", area: 16 },
          { name: "Спальня 4", area: 15 },
          { name: "Санузел 2", area: 11 },
          { name: "Санузел 3", area: 8 },
          { name: "Санузел 4", area: 6 },
          { name: "Холл 2 эт.", area: 22 },
        ],
      },
    ],
    completionMonths: 10,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function formatPrice(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} млрд ₽`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`;
  return `${n.toLocaleString("ru")} ₽`;
}
