export interface Product {
  id: number;
  name: string;
  company: string;
  price: number;
  image: string;
  description: string;
  specifications: string[];
}

export const productsData: Product[] = [
  {
    id: 1,
    name: "Actin One",
    company: "AVA STORE",
    price: 497.0,
    image: "/images/actinoneava/actinoneava.webp",
    description:
      "Pajisje profesionale terapeutike për lehtësimin e dhimbjes dhe rikuperimin e muskujve.",
    specifications: [
      "Professional-grade therapeutic device",
      "Pain relief and muscle recovery",
      "Portable and easy to use",
      "Multiple therapy modes",
    ],
  },
  {
    id: 2,
    name: "Active Recovery Kit",
    company: "AVA STORE",
    price: 99.0,
    image: "/images/active-recovery-kit/AquaBag Ball.webp",
    description: "Set i plotë rikuperimi me shumë mjete për rehabilitim aktiv.",
    specifications: [
      "Multiple recovery tools",
      "Active rehabilitation support",
      "Complete kit",
    ],
  },
  {
    id: 3,
    name: "Inflatable Leg and Foot Cushion",
    company: "AVA STORE",
    price: 47.0,
    image:
      "/images/Inflatable Leg and Foot Cushion/InflatableLegandFootCushion1.webp",
    description:
      "Comfortable inflatable support for leg and foot elevation during recovery.",
    specifications: ["Inflatable design", "Comfortable support", "Easy to use"],
  },
  {
    id: 4,
    name: "AVABoots",
    company: "AVA STORE",
    price: 697.0,
    image: "/images/AVABoots/AVABoots1.webp",
    description:
      "Advanced compression boots for improved circulation and recovery.",
    specifications: [
      "Advanced compression technology",
      "Improved circulation",
      "Recovery support",
    ],
  },
  {
    id: 5,
    name: "AVAPress",
    company: "AVA STORE",
    price: 27.0,
    image: "/images/Avapress/AVAPRESS-COMPRESSION1.webp",
    description:
      "Compression therapy system for effective treatment and recovery.",
    specifications: [
      "Compression therapy",
      "Effective treatment",
      "Recovery support",
    ],
  },
  {
    id: 6,
    name: "Bioimpedance Scale",
    company: "AVA STORE",
    price: 897.0,
    image: "/images/Bioimpedancescale.webp",
    description:
      "Advanced body composition analysis scale with bioimpedance technology.",
    specifications: [
      "Body composition analysis",
      "Bioimpedance technology",
      "Advanced features",
    ],
  },
  {
    id: 7,
    name: "Elasticated Bands",
    company: "AVA STORE",
    price: 12.0,
    image: "/images/active-recovery-kit/elasticatedbands.webp",
    description:
      "High-quality elasticated resistance bands for rehabilitation and training.",
    specifications: [
      "High-quality material",
      "Multiple resistance levels",
      "Rehabilitation support",
    ],
  },
  {
    id: 8,
    name: "Super Elastic Bands",
    company: "AVA STORE",
    price: 27.0,
    image: "/images/active-recovery-kit/Super Elastic Bands.webp",
    description:
      "Premium elastic bands for strength training and recovery exercises.",
    specifications: [
      "Premium quality",
      "Strength training",
      "Recovery exercises",
    ],
  },
  {
    id: 9,
    name: "Roller Massage Stick",
    company: "AVA STORE",
    price: 22.0,
    image: "/images/active-recovery-kit/Roller Massage Stick.webp",
    description:
      "Professional massage roller stick for muscle recovery and tension relief.",
    specifications: [
      "Muscle recovery",
      "Tension relief",
      "Professional quality",
    ],
  },
  {
    id: 10,
    name: "Actin One Pro",
    company: "AVA STORE",
    price: 547.0,
    image: "/images/actinoneava/actinoneava2.webp",
    description:
      "Advanced professional therapeutic device with enhanced features.",
    specifications: [
      "Enhanced features",
      "Professional grade",
      "Advanced technology",
    ],
  },
  {
    id: 11,
    name: "AVABoots Premium",
    company: "AVA STORE",
    price: 797.0,
    image: "/images/AVABoots/AVABoots2.webp",
    description:
      "Premium compression boots with advanced features for optimal recovery.",
    specifications: [
      "Premium quality",
      "Advanced features",
      "Optimal recovery",
    ],
  },
  {
    id: 12,
    name: "Actin One Elite",
    company: "AVA STORE",
    price: 647.0,
    image: "/images/actinoneava/actinoneava3.webp",
    description:
      "Elite therapeutic device with cutting-edge technology for maximum effectiveness.",
    specifications: [
      "Cutting-edge technology",
      "Maximum effectiveness",
      "Elite quality",
    ],
  },
];

export function getCompanies(): string[] {
  const companySet = new Set<string>();
  productsData.forEach((product) => {
    companySet.add(product.company);
  });
  const companies = Array.from(companySet);
  return companies.sort();
}

export function getProductsByCompany(company: string): Product[] {
  if (company === "all") {
    return productsData;
  }
  return productsData.filter((product) => product.company === company);
}

export function getProductById(id: number | string): Product | undefined {
  return productsData.find((product) => product.id === parseInt(String(id)));
}
