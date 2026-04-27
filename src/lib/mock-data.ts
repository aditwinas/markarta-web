import type {
  AdsPerformance,
  Brand,
  BrandDashboardData,
  CalendarItem,
  ScorecardMetric,
  UserRole,
  WorksheetEntry
} from "@/types/markarta";

export const brands: Brand[] = [
  { id: "sebelas", name: "Sebelas Coffee", shortName: "Sebelas", source: "Olsera", ownerRole: "shared" },
  { id: "zona", name: "Zona Massage", shortName: "Zona", source: "Latepoint", ownerRole: "shared" },
  { id: "snapobox", name: "Snapobox", shortName: "Snapobox", source: "Photolab", ownerRole: "shared" },
  { id: "snaposnap", name: "Snap O' Snap", shortName: "Snap O' Snap", source: "Google Sheet", ownerRole: "content_creator" },
  { id: "tunas", name: "Tunas Mekar Dental", shortName: "Tunas Mekar", source: "Shopee Seller", ownerRole: "shared" },
  { id: "balcos", name: "Balcos Compound", shortName: "Balcos", source: "Manual Input", ownerRole: "manager" }
];

export const scorecardMetrics: ScorecardMetric[] = [
  { brandId: "sebelas", omzet: 412_000_000, target: 430_000_000, progress: 96, digitalScore: 88, activationCount: 4, sentimentScore: 78, status: "green" },
  { brandId: "zona", omzet: 285_000_000, target: 360_000_000, progress: 79, digitalScore: 81, activationCount: 3, sentimentScore: 74, status: "yellow" },
  { brandId: "snapobox", omzet: 155_000_000, target: 260_000_000, progress: 60, digitalScore: 62, activationCount: 2, sentimentScore: 58, status: "red" },
  { brandId: "snaposnap", omzet: 228_000_000, target: 245_000_000, progress: 93, digitalScore: 86, activationCount: 5, sentimentScore: 82, status: "green" },
  { brandId: "tunas", omzet: 178_000_000, target: 235_000_000, progress: 76, digitalScore: 69, activationCount: 1, sentimentScore: 65, status: "yellow" },
  { brandId: "balcos", omzet: 92_000_000, target: 160_000_000, progress: 58, digitalScore: 54, activationCount: 2, sentimentScore: 61, status: "red" }
];

function ads(channel: string, spend: number, roas: number, ctr: number, impressions: number): AdsPerformance {
  return { channel, spend, roas, ctr, impressions };
}

export const dashboardData: Record<string, BrandDashboardData> = {
  sebelas: {
    brandId: "sebelas",
    summary: {
      omzet: 412_000_000,
      target: 430_000_000,
      monthOverMonth: 12,
      activeCampaigns: 3,
      weeklyHighlights: "Produk seasonal latte menjadi kontributor omzet tertinggi minggu ini."
    },
    revenueDaily: [
      { label: "Sen", value: 16_000_000 },
      { label: "Sel", value: 18_500_000 },
      { label: "Rab", value: 19_200_000 },
      { label: "Kam", value: 21_000_000 },
      { label: "Jum", value: 24_800_000 },
      { label: "Sab", value: 28_100_000 },
      { label: "Min", value: 23_600_000 }
    ],
    revenueMonthly: [
      { label: "Jan", value: 352_000_000 },
      { label: "Feb", value: 374_000_000 },
      { label: "Mar", value: 390_000_000 },
      { label: "Apr", value: 412_000_000 }
    ],
    topProducts: [
      { name: "Royal Latte", quantity: 1380, revenue: 72_000_000 },
      { name: "Cold Brew Series", quantity: 1085, revenue: 58_000_000 },
      { name: "Signature Croffle", quantity: 920, revenue: 45_000_000 }
    ],
    social: [
      { platform: "Instagram", reach: 420_000, engagement: 26_800, published: 11, target: 12 },
      { platform: "TikTok", reach: 510_000, engagement: 35_500, published: 10, target: 12 },
      { platform: "X", reach: 95_000, engagement: 6_100, published: 13, target: 12 }
    ],
    ads: [
      ads("Meta Ads", 28_000_000, 4.8, 2.7, 1_800_000),
      ads("TikTok Ads", 19_500_000, 3.9, 2.1, 1_230_000)
    ],
    kol: [
      { name: "Ayu Foodie", platform: "Instagram", reach: 185_000, impact: "Drive store visit tinggi", status: "Aktif" },
      { name: "Kopi Jakarta", platform: "TikTok", reach: 240_000, impact: "Video review tembus FYP", status: "Done" }
    ],
    activations: [
      { title: "Campus Coffee Pop-Up", date: "19 Apr 2026", status: "On Progress", result: "Reservasi booth 87%" },
      { title: "Morning Brew Run Club", date: "26 Apr 2026", status: "Approved", result: "Target 120 peserta" }
    ],
    salesEvents: [
      { title: "Weekend Brunch Set", revenue: 34_000_000, attendees: 310 },
      { title: "Corporate Coffee Cart", revenue: 22_500_000, attendees: 170 }
    ],
    sentiment: {
      score: 78,
      positive: 62,
      neutral: 26,
      negative: 12,
      keywords: ["cozy", "latte", "ramah", "wifi", "dessert", "weekend"],
      mentions: [
        { source: "Google Review", text: "Pelayanannya cepat dan latte-nya konsisten enak.", tone: "positif" },
        { source: "Instagram", text: "Tempatnya nyaman buat meeting pagi.", tone: "positif" },
        { source: "Threads", text: "Antrian agak panjang di jam makan siang.", tone: "netral" }
      ]
    }
  },
  zona: {
    brandId: "zona",
    summary: {
      omzet: 285_000_000,
      target: 360_000_000,
      monthOverMonth: 6,
      activeCampaigns: 2,
      weeklyHighlights: "Promo weekday treatment mulai mengangkat booking organik."
    },
    revenueDaily: [
      { label: "Sen", value: 10_500_000 },
      { label: "Sel", value: 11_800_000 },
      { label: "Rab", value: 13_000_000 },
      { label: "Kam", value: 12_400_000 },
      { label: "Jum", value: 14_500_000 },
      { label: "Sab", value: 16_800_000 },
      { label: "Min", value: 15_600_000 }
    ],
    revenueMonthly: [
      { label: "Jan", value: 241_000_000 },
      { label: "Feb", value: 252_000_000 },
      { label: "Mar", value: 269_000_000 },
      { label: "Apr", value: 285_000_000 }
    ],
    topProducts: [
      { name: "Aroma Therapy", quantity: 680, revenue: 58_000_000 },
      { name: "Deep Tissue Massage", quantity: 510, revenue: 49_000_000 },
      { name: "Spa Package", quantity: 320, revenue: 45_000_000 }
    ],
    social: [
      { platform: "Instagram", reach: 310_000, engagement: 16_900, published: 9, target: 12 },
      { platform: "TikTok", reach: 220_000, engagement: 14_100, published: 8, target: 12 }
    ],
    ads: [
      ads("Meta Ads", 21_000_000, 3.4, 1.8, 1_260_000),
      ads("TikTok Ads", 12_000_000, 2.8, 1.5, 820_000)
    ],
    kol: [
      { name: "Wellness with Nia", platform: "Instagram", reach: 122_000, impact: "Booking naik di weekday", status: "Aktif" }
    ],
    activations: [
      { title: "Corporate Relaxation Day", date: "24 Apr 2026", status: "Submitted", result: "Menunggu approval venue" }
    ],
    salesEvents: [{ title: "Member Referral Drive", revenue: 18_700_000, attendees: 96 }],
    sentiment: {
      score: 74,
      positive: 57,
      neutral: 29,
      negative: 14,
      keywords: ["relax", "tenang", "therapist", "clean", "booking"],
      mentions: [
        { source: "Google Review", text: "Terapisnya profesional dan ambience tenang.", tone: "positif" },
        { source: "Threads", text: "Sistem booking lebih mudah minggu ini.", tone: "positif" },
        { source: "Instagram", text: "Pilihan slot weekend cepat penuh.", tone: "netral" }
      ]
    }
  },
  snapobox: {
    brandId: "snapobox",
    summary: {
      omzet: 155_000_000,
      target: 260_000_000,
      monthOverMonth: -9,
      activeCampaigns: 4,
      weeklyHighlights: "Traffic studio menurun, perlu push collab kampus dan promo bundling."
    },
    revenueDaily: [
      { label: "Sen", value: 5_500_000 },
      { label: "Sel", value: 6_100_000 },
      { label: "Rab", value: 5_800_000 },
      { label: "Kam", value: 7_200_000 },
      { label: "Jum", value: 8_400_000 },
      { label: "Sab", value: 10_500_000 },
      { label: "Min", value: 9_300_000 }
    ],
    revenueMonthly: [
      { label: "Jan", value: 208_000_000 },
      { label: "Feb", value: 197_000_000 },
      { label: "Mar", value: 171_000_000 },
      { label: "Apr", value: 155_000_000 }
    ],
    topProducts: [
      { name: "Graduation Package", quantity: 210, revenue: 38_000_000 },
      { name: "Group Studio Session", quantity: 168, revenue: 31_000_000 },
      { name: "Birthday Theme Set", quantity: 124, revenue: 22_500_000 }
    ],
    social: [
      { platform: "Instagram", reach: 185_000, engagement: 9_400, published: 7, target: 12 },
      { platform: "TikTok", reach: 140_000, engagement: 8_200, published: 6, target: 12 }
    ],
    ads: [
      ads("Meta Ads", 17_000_000, 2.1, 1.4, 920_000),
      ads("TikTok Ads", 11_500_000, 1.8, 1.2, 640_000)
    ],
    kol: [
      { name: "Campus Lens Club", platform: "TikTok", reach: 90_000, impact: "Awareness tinggi, booking rendah", status: "Perlu follow-up" }
    ],
    activations: [
      { title: "Graduation Roadshow", date: "28 Apr 2026", status: "On Progress", result: "2 kampus confirmed" }
    ],
    salesEvents: [{ title: "Flash Promo Akhir Pekan", revenue: 9_800_000, attendees: 54 }],
    sentiment: {
      score: 58,
      positive: 41,
      neutral: 33,
      negative: 26,
      keywords: ["studio", "slot", "harga", "theme", "editing"],
      mentions: [
        { source: "TikTok", text: "Tempat lucu tapi waiting list penuh.", tone: "netral" },
        { source: "Google Review", text: "Hasil foto bagus, proses pilih file cukup lama.", tone: "negatif" },
        { source: "Instagram", text: "Tema wisuda terbaru menarik banget.", tone: "positif" }
      ]
    }
  },
  snaposnap: {
    brandId: "snaposnap",
    summary: {
      omzet: 228_000_000,
      target: 245_000_000,
      monthOverMonth: 14,
      activeCampaigns: 2,
      weeklyHighlights: "Konten behind the scenes menaikkan inquiry harian paling tinggi."
    },
    revenueDaily: [
      { label: "Sen", value: 8_000_000 },
      { label: "Sel", value: 9_400_000 },
      { label: "Rab", value: 10_600_000 },
      { label: "Kam", value: 11_100_000 },
      { label: "Jum", value: 12_000_000 },
      { label: "Sab", value: 13_600_000 },
      { label: "Min", value: 12_900_000 }
    ],
    revenueMonthly: [
      { label: "Jan", value: 180_000_000 },
      { label: "Feb", value: 193_000_000 },
      { label: "Mar", value: 205_000_000 },
      { label: "Apr", value: 228_000_000 }
    ],
    topProducts: [
      { name: "Wedding Booth", quantity: 95, revenue: 52_000_000 },
      { name: "Corporate Event Booth", quantity: 82, revenue: 41_000_000 },
      { name: "Birthday Pop-Up", quantity: 76, revenue: 32_000_000 }
    ],
    social: [
      { platform: "Instagram", reach: 268_000, engagement: 18_500, published: 12, target: 12 },
      { platform: "TikTok", reach: 356_000, engagement: 24_100, published: 11, target: 12 }
    ],
    ads: [
      ads("Meta Ads", 14_500_000, 4.1, 2.2, 990_000),
      ads("TikTok Ads", 10_800_000, 3.7, 2.0, 710_000)
    ],
    kol: [
      { name: "Event Diary ID", platform: "Instagram", reach: 132_000, impact: "Inquiry paket wedding naik", status: "Done" }
    ],
    activations: [
      { title: "Wedding Expo Surabaya", date: "02 Mei 2026", status: "Approved", result: "Booth dan PIC terkunci" }
    ],
    salesEvents: [{ title: "Roadshow Vendor Gathering", revenue: 17_400_000, attendees: 88 }],
    sentiment: {
      score: 82,
      positive: 68,
      neutral: 21,
      negative: 11,
      keywords: ["booth", "rame", "event", "wedding", "fun"],
      mentions: [
        { source: "Instagram", text: "Photobooth-nya jadi pusat perhatian pas event.", tone: "positif" },
        { source: "Threads", text: "Response admin untuk inquiry lebih cepat sekarang.", tone: "positif" }
      ]
    }
  },
  tunas: {
    brandId: "tunas",
    summary: {
      omzet: 178_000_000,
      target: 235_000_000,
      monthOverMonth: 8,
      activeCampaigns: 1,
      weeklyHighlights: "Kategori whitening kit mulai menopang penjualan marketplace."
    },
    revenueDaily: [
      { label: "Sen", value: 6_300_000 },
      { label: "Sel", value: 6_900_000 },
      { label: "Rab", value: 7_400_000 },
      { label: "Kam", value: 7_100_000 },
      { label: "Jum", value: 8_200_000 },
      { label: "Sab", value: 9_100_000 },
      { label: "Min", value: 8_800_000 }
    ],
    revenueMonthly: [
      { label: "Jan", value: 142_000_000 },
      { label: "Feb", value: 151_000_000 },
      { label: "Mar", value: 165_000_000 },
      { label: "Apr", value: 178_000_000 }
    ],
    topProducts: [
      { name: "Whitening Kit", quantity: 560, revenue: 46_000_000 },
      { name: "Scaling Package", quantity: 305, revenue: 39_500_000 },
      { name: "Consultation + X-Ray", quantity: 180, revenue: 24_000_000 }
    ],
    social: [
      { platform: "Instagram", reach: 145_000, engagement: 8_100, published: 10, target: 12 },
      { platform: "TikTok", reach: 172_000, engagement: 10_800, published: 9, target: 12 }
    ],
    ads: [
      ads("Meta Ads", 12_800_000, 3.2, 1.9, 740_000),
      ads("TikTok Ads", 8_100_000, 2.9, 1.7, 520_000)
    ],
    kol: [
      { name: "Drg. Tasya", platform: "TikTok", reach: 74_000, impact: "Edukasi trust tinggi", status: "Aktif" }
    ],
    activations: [
      { title: "School Dental Check-Up", date: "30 Apr 2026", status: "Draft", result: "Proposal awal disiapkan" }
    ],
    salesEvents: [{ title: "Shopee Live Whitening", revenue: 11_300_000, attendees: 140 }],
    sentiment: {
      score: 65,
      positive: 49,
      neutral: 30,
      negative: 21,
      keywords: ["dokter", "bersih", "antri", "promo", "ramah"],
      mentions: [
        { source: "Google Review", text: "Dokternya ramah dan edukatif.", tone: "positif" },
        { source: "TikTok", text: "Promo bundling cukup menarik untuk keluarga.", tone: "positif" }
      ]
    }
  },
  balcos: {
    brandId: "balcos",
    summary: {
      omzet: 92_000_000,
      target: 160_000_000,
      monthOverMonth: -4,
      activeCampaigns: 2,
      weeklyHighlights: "Perlu percepat pengumpulan input manual dan sinkron sales lapangan."
    },
    revenueDaily: [
      { label: "Sen", value: 3_500_000 },
      { label: "Sel", value: 4_100_000 },
      { label: "Rab", value: 3_900_000 },
      { label: "Kam", value: 4_500_000 },
      { label: "Jum", value: 5_200_000 },
      { label: "Sab", value: 5_600_000 },
      { label: "Min", value: 4_700_000 }
    ],
    revenueMonthly: [
      { label: "Jan", value: 108_000_000 },
      { label: "Feb", value: 102_000_000 },
      { label: "Mar", value: 96_000_000 },
      { label: "Apr", value: 92_000_000 }
    ],
    topProducts: [
      { name: "Compound Premium", quantity: 290, revenue: 32_000_000 },
      { name: "Sealant Pack", quantity: 220, revenue: 24_000_000 },
      { name: "Starter Bundle", quantity: 150, revenue: 15_000_000 }
    ],
    social: [
      { platform: "Instagram", reach: 90_000, engagement: 4_200, published: 6, target: 12 },
      { platform: "TikTok", reach: 110_000, engagement: 5_300, published: 5, target: 12 }
    ],
    ads: [
      ads("Meta Ads", 9_000_000, 1.9, 1.3, 450_000),
      ads("TikTok Ads", 4_300_000, 1.5, 1.1, 280_000)
    ],
    kol: [
      { name: "Builder Corner", platform: "Instagram", reach: 58_000, impact: "Lead B2B masih rendah", status: "Perlu review" }
    ],
    activations: [
      { title: "Contractor Meet-Up", date: "05 Mei 2026", status: "Submitted", result: "Venue shortlist 3 lokasi" }
    ],
    salesEvents: [{ title: "Project Showcase", revenue: 6_400_000, attendees: 42 }],
    sentiment: {
      score: 61,
      positive: 44,
      neutral: 35,
      negative: 21,
      keywords: ["compound", "durable", "stock", "harga", "aplikasi"],
      mentions: [
        { source: "Google Review", text: "Produk kuat, tapi stok warna tertentu sering habis.", tone: "negatif" },
        { source: "Threads", text: "After-sales support cukup responsif.", tone: "positif" }
      ]
    }
  }
};

export const calendarItems: CalendarItem[] = [
  { id: "cal-1", brandId: "sebelas", title: "Launch Royal Latte Reels", platform: "Instagram", date: "2026-04-22", weekLabel: "Minggu 4", status: "planning", owner: "Nisa" },
  { id: "cal-2", brandId: "sebelas", title: "UGC Weekend Challenge", platform: "TikTok", date: "2026-04-24", weekLabel: "Minggu 4", status: "produksi", owner: "Nisa" },
  { id: "cal-3", brandId: "snaposnap", title: "Behind The Booth Story", platform: "Instagram", date: "2026-04-23", weekLabel: "Minggu 4", status: "published", owner: "Rio" },
  { id: "cal-4", brandId: "tunas", title: "Edukasi Scaling 101", platform: "TikTok", date: "2026-04-25", weekLabel: "Minggu 4", status: "planning", owner: "Tasya" },
  { id: "cal-5", brandId: "zona", title: "Promo Weekday Treatment", platform: "Instagram", date: "2026-04-26", weekLabel: "Minggu 4", status: "published", owner: "Farah" },
  { id: "cal-6", brandId: "snapobox", title: "Graduation Theme Carousel", platform: "Instagram", date: "2026-04-27", weekLabel: "Minggu 5", status: "produksi", owner: "Dimas" }
];

export const worksheetEntries: WorksheetEntry[] = [
  {
    id: "ws-1",
    role: "content_creator",
    brandId: "snaposnap",
    title: "Weekly report performa Reels",
    kind: "weekly_report",
    status: "Perlu dikirim hari ini",
    updatedAt: "22 Apr 2026, 08.10",
    notes: "Fokus highlight inquiry dari konten BTS."
  },
  {
    id: "ws-2",
    role: "kol",
    brandId: "snapobox",
    title: "Update project Campus Lens Club",
    kind: "kol_update",
    status: "Menunggu deliverable final",
    updatedAt: "21 Apr 2026, 16.40",
    notes: "Butuh follow-up CTA agar booking naik."
  },
  {
    id: "ws-3",
    role: "activation",
    brandId: "sebelas",
    title: "Laporan pop-up kampus",
    kind: "aktivasi",
    status: "Siap direview manager",
    updatedAt: "22 Apr 2026, 07.45",
    notes: "Upload traffic booth dan lead form."
  }
];

export const teamHighlights = [
  { label: "Brand aktif", value: "6 brand", note: "Semua unit masuk ke scorecard harian" },
  { label: "Konten bulan ini", value: "55/72", note: "Setara 76% target lintas brand" },
  { label: "KOL project", value: "13 aktif", note: "4 project perlu update minggu ini" },
  { label: "Campaign berjalan", value: "14", note: "3 campaign mendekati deadline" }
];

export function getBrandById(brandId: string) {
  return brands.find((brand) => brand.id === brandId) ?? brands[0];
}

export function getScorecardView() {
  return brands.map((brand) => ({
    brand,
    metric: scorecardMetrics.find((item) => item.brandId === brand.id)!
  }));
}

export function getDashboardForBrand(brandId: string) {
  return dashboardData[brandId] ?? dashboardData[brands[0].id];
}

export function getCalendarItems(brandId?: string, platform?: string) {
  return calendarItems.filter((item) => {
    const matchesBrand = brandId && brandId !== "all" ? item.brandId === brandId : true;
    const matchesPlatform = platform && platform !== "all" ? item.platform === platform : true;
    return matchesBrand && matchesPlatform;
  });
}

export function getWorksheetEntries(role: UserRole, brandId?: string) {
  return worksheetEntries.filter((entry) => {
    const roleMatch = role === "manager" ? true : entry.role === role;
    const brandMatch = brandId ? entry.brandId === brandId : true;
    return roleMatch && brandMatch;
  });
}
