#!/usr/bin/env node

import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "src/data/markarta-report.json");
const ENV_PATH = path.join(ROOT, ".env.local");
const TIME_ZONE = "Asia/Jakarta";
const JAKARTA_OFFSET = "+07:00";

const STATIC_SEBELAS_ALL_OUTLET_RANKING = {
  title: "Top product all outlet",
  description: "Ranking menu utama, sudah dibersihkan dari ADD-ON dan PARKIR.",
  items: [
    { name: "LATTE", value: "8.896 cup", detail: "Rp188.159.000" },
    { name: "NEERA", value: "6.990 cup", detail: "Rp167.428.900" },
    { name: "JEEVA", value: "5.505 cup", detail: "Rp124.422.300" },
    { name: "AMERICANO (AMERICANO BOLD)", value: "4.640 cup", detail: "Rp89.891.800" }
  ]
};

const STATIC_SEBELAS_OUTLET_RANKING = {
  title: "Top product per outlet",
  description: "Snapshot SKU outlet terakhir yang terverifikasi, dipertahankan sambil endpoint SKU lintas outlet distabilkan.",
  items: [
    { name: "Veteran", value: "LATTE - Reguler", detail: "1.287 cup" },
    { name: "HOS Cokro", value: "LATTE - Reguler", detail: "1.417 cup" },
    { name: "Gejayan", value: "LATTE - Reguler", detail: "1.130 cup" },
    { name: "Monjali", value: "LATTE - Reguler", detail: "551 cup" },
    { name: "Concat", value: "LATTE - Reguler", detail: "736 cup" },
    { name: "Nologaten", value: "LATTE - Reguler", detail: "1.171 cup" },
    { name: "Auriga Jakal", value: "NEERA - Reguler", detail: "885 cup" }
  ]
};

const STATIC_ZONA_RANKING = {
  title: "Top service April",
  description: "Rumus ranking: Service + Durasi dari halaman Appointments. Ranking detail memakai snapshot terakhir yang terverifikasi.",
  items: [
    { name: "Balcos Compound", value: "Full Body Massage 90 menit", detail: "140 appointment" },
    { name: "Plemburan", value: "Full Body Massage 60 menit", detail: "85 appointment" }
  ]
};

const SNAPOSNAP_SHEETS = [
  { key: "GACA", sheetName: "OVERVIEW-GACA" },
  { key: "VETERAN", sheetName: "OVERVIEW VETERAN" },
  { key: "HOS", sheetName: "OVERVIEW-HOS" },
  { key: "SEMARANG", sheetName: "OVERVIEW-SEMARANG" }
];

main().catch((error) => {
  console.error("[markarta-report] Failed to generate report.");
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  loadEnvFile();

  const basisDates = getReportBasisDates();
  const previousPayload = await readPreviousPayload();
  const previousSectionsById = new Map((previousPayload?.brandReports ?? []).map((section) => [section.id, section]));

  const tasks = [
    runBrandTask("sebelas", () => buildSebelasCoffeeSection(basisDates)),
    runBrandTask("snapobox", () => buildSnapoboxSection(basisDates)),
    runBrandTask("zona", () => buildZonaSection(basisDates)),
    runBrandTask("snaposnap", () => buildSnapOSnapSection(basisDates))
  ];

  const settled = await Promise.allSettled(tasks);
  const liveResults = [];
  const warnings = [];

  for (const item of settled) {
    if (item.status === "fulfilled") {
      liveResults.push(item.value);
      continue;
    }

    const failedId = item.reason?.brandId;
    const fallbackSection = failedId ? previousSectionsById.get(failedId) : null;
    if (!fallbackSection) {
      throw item.reason;
    }

    const fallbackNotes = [...(fallbackSection.notes ?? [])];
    const fallbackBasis = previousPayload?.reportBasis
      ? `${previousPayload.reportBasis.dailyCurrent} vs ${previousPayload.reportBasis.dailyPrevious}`
      : null;
    fallbackNotes.unshift(
      `Refresh otomatis gagal pada ${formatDateTimeForHumans(new Date())}; dashboard mempertahankan snapshot terakhir yang valid untuk ${fallbackSection.name}.`
    );
    if (fallbackBasis) {
      fallbackNotes.unshift(`Basis data fallback yang masih ditampilkan: ${fallbackBasis}.`);
    }

    liveResults.push({
      brandId: fallbackSection.id,
      section: {
        ...fallbackSection,
        state: "fallback",
        note: `Snapshot terakhir valid dipakai karena refresh ${fallbackSection.source} gagal pada run ini.`,
        notes: fallbackNotes
      },
      metrics: deriveMetricsFromSection(fallbackSection)
    });
    warnings.push(`${fallbackSection.name}: ${item.reason?.message ?? "refresh gagal"}`);
  }

  const liveSectionsById = new Map(liveResults.map((item) => [item.brandId, item]));
  const placeholders = buildPlaceholderSections();

  const orderedLiveIds = ["sebelas", "snapobox", "zona", "snaposnap"];
  const brandReports = [
    ...orderedLiveIds.map((id) => liveSectionsById.get(id)?.section).filter(Boolean),
    ...placeholders
  ];

  const activeBrands = liveResults.filter((item) => item.section.state === "live").length;
  const trackedBrands = brandReports.length;
  const monthlyRevenue = sum(liveResults.map((item) => item.metrics.monthlyCurrent));
  const monthlyPreviousRevenue = sum(liveResults.map((item) => item.metrics.monthlyPrevious));
  const dailyRevenue = sum(liveResults.map((item) => item.metrics.dailyCurrent));
  const dailyPreviousRevenue = sum(liveResults.map((item) => item.metrics.dailyPrevious));
  const reportBasisSource = activeBrands === 0 && previousPayload?.reportBasis
    ? previousPayload.reportBasis
    : {
        label: "Basis report yang dipakai sekarang",
        monthlyCurrent: formatRangeLabel(basisDates.monthlyCurrentStart, basisDates.closedDay),
        monthlyPrevious: formatRangeLabel(basisDates.monthlyPreviousStart, basisDates.monthlyPreviousEnd),
        dailyCurrent: formatDateForHumans(basisDates.closedDay),
        dailyPrevious: formatDateForHumans(basisDates.previousDay)
      };

  const payload = {
    reportBasis: {
      ...reportBasisSource,
      updatedAt: formatDateTimeForHumans(new Date())
    },
    portfolioSummary: {
      activeBrands,
      trackedBrands,
      monthlyRevenue,
      monthlyChangePct: computePct(monthlyRevenue, monthlyPreviousRevenue),
      dailyRevenue,
      dailyChangePct: computePct(dailyRevenue, dailyPreviousRevenue)
    },
    brandReports
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);

  console.log(`[markarta-report] Updated ${path.relative(ROOT, OUTPUT_PATH)}`);
  console.log(
    `[markarta-report] Basis ${formatDateForHumans(basisDates.closedDay)} vs ${formatDateForHumans(basisDates.previousDay)} | warnings: ${warnings.length}`
  );
  if (warnings.length) {
    for (const warning of warnings) {
      console.log(`[markarta-report] Fallback ${warning}`);
    }
  }
}

async function runBrandTask(brandId, task) {
  try {
    return await task();
  } catch (error) {
    if (error && typeof error === "object" && !("brandId" in error)) {
      error.brandId = brandId;
    }
    throw error;
  }
}

function loadEnvFile() {
  try {
    const text = readFileSync(ENV_PATH, "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separatorIndex = line.indexOf("=");
      if (separatorIndex <= 0) continue;
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      if (!(key in process.env)) {
        process.env[key] = stripWrappingQuotes(value);
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function stripWrappingQuotes(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

async function readPreviousPayload() {
  try {
    const text = await fs.readFile(OUTPUT_PATH, "utf8");
    return JSON.parse(text);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function getReportBasisDates() {
  const nowJakarta = getJakartaDate();
  const closedDay = addDays(nowJakarta, -1);
  const previousDay = addDays(closedDay, -1);
  const monthlyCurrentStart = startOfMonth(closedDay);
  const monthlyPreviousStart = startOfMonth(addMonths(monthlyCurrentStart, -1));
  const monthlyPreviousEnd = clampDay(addMonths(closedDay, -1), closedDay.getDate());

  return {
    nowJakarta,
    closedDay,
    previousDay,
    monthlyCurrentStart,
    monthlyPreviousStart,
    monthlyPreviousEnd
  };
}

function getJakartaDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return new Date(`${year}-${month}-${day}T00:00:00${JAKARTA_OFFSET}`);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date, months) {
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  return new Date(Date.UTC(year, monthIndex + months, 1, 0, 0, 0) + 7 * 60 * 60 * 1000);
}

function startOfMonth(date) {
  return new Date(`${date.getFullYear()}-${pad2(date.getMonth() + 1)}-01T00:00:00${JAKARTA_OFFSET}`);
}

function clampDay(monthDate, targetDay) {
  const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  return new Date(`${monthDate.getFullYear()}-${pad2(monthDate.getMonth() + 1)}-${pad2(Math.min(targetDay, lastDay))}T00:00:00${JAKARTA_OFFSET}`);
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatDateForApi(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function formatDateForHumans(date) {
  return `${date.getDate()} ${monthName(date.getMonth())} ${date.getFullYear()}`;
}

function formatDateTimeForHumans(date) {
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);

  const map = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${map.day} ${capitalize(map.month)} ${map.year}, ${map.hour}.${map.minute} WIB`;
}

function formatRangeLabel(start, end) {
  return `${formatDateForHumans(start)} - ${formatDateForHumans(end)}`;
}

function monthName(index) {
  return ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][index];
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatCurrency(value) {
  return `Rp${Math.round(value).toLocaleString("id-ID")}`;
}

function formatCount(value) {
  return Math.round(value).toLocaleString("id-ID");
}

function formatSignedPct(value, digits = 1) {
  if (value === null || Number.isNaN(value)) return "-";
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${prefix}${Math.abs(value).toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })}%`;
}

function computePct(current, previous) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function parseCurrencyLike(value) {
  if (typeof value === "number") return value;
  let clean = String(value ?? "")
    .replace(/Rp\.?/gi, "")
    .replace(/\s+/g, "")
    .replace(/[^0-9,.-]/g, "");

  const commaCount = (clean.match(/,/g) ?? []).length;
  const dotCount = (clean.match(/\./g) ?? []).length;

  if (commaCount && !dotCount) {
    clean = commaCount > 1 || /,\d{3}(,|$)/.test(clean) ? clean.replace(/,/g, "") : clean.replace(",", ".");
  } else if (dotCount && !commaCount) {
    clean = dotCount > 1 || /\.(\d{3})(\.|$)/.test(clean) ? clean.replace(/\./g, "") : clean;
  } else if (dotCount && commaCount) {
    clean =
      clean.lastIndexOf(",") > clean.lastIndexOf(".")
        ? clean.replace(/\./g, "").replace(",", ".")
        : clean.replace(/,/g, "");
  }

  clean = clean.replace(/[^0-9.-]/g, "");
  if (!clean) return 0;
  return Number(clean);
}

function deriveMetricsFromSection(section) {
  const monthlyCard = section.summaryCards.find((item) => item.label.includes("Omset MTD"));
  const dailyCard = section.summaryCards.find((item) => item.label.includes("Omset Harian"));
  const monthlyCurrent = parseCurrencyLike(monthlyCard?.value ?? 0);
  const dailyCurrent = parseCurrencyLike(dailyCard?.value ?? 0);
  const monthlyPrevious =
    typeof monthlyCard?.changePct === "number" && monthlyCard.changePct !== -100 ? monthlyCurrent / (1 + monthlyCard.changePct / 100) : 0;
  const dailyPrevious =
    typeof dailyCard?.changePct === "number" && dailyCard.changePct !== -100 ? dailyCurrent / (1 + dailyCard.changePct / 100) : 0;

  return {
    monthlyCurrent,
    monthlyPrevious,
    dailyCurrent,
    dailyPrevious
  };
}

async function buildSebelasCoffeeSection(basisDates) {
  const contextPath = process.env.OLSERA_CONTEXT_PATH;
  if (!contextPath) {
    throw Object.assign(new Error("OLSERA_CONTEXT_PATH belum diisi."), { brandId: "sebelas" });
  }

  const context = JSON.parse(await fs.readFile(contextPath, "utf8"));
  const accessToken = context?.token?.access_token;
  const urlId = context?.store?.url_id;

  if (!accessToken || !urlId) {
    throw Object.assign(new Error("Context Olsera tidak lengkap."), { brandId: "sebelas" });
  }

  const currentRows = await fetchOlseraSalesSummary(urlId, accessToken, basisDates.monthlyCurrentStart, basisDates.closedDay);
  const previousRows = await fetchOlseraSalesSummary(urlId, accessToken, basisDates.monthlyPreviousStart, basisDates.monthlyPreviousEnd);
  const dailyRows = await fetchOlseraSalesSummary(urlId, accessToken, basisDates.closedDay, basisDates.closedDay);
  const previousDailyRows = await fetchOlseraSalesSummary(urlId, accessToken, basisDates.previousDay, basisDates.previousDay);

  const previousByStore = new Map(previousRows.map((row) => [row.store_id, row]));
  const dailyByStore = new Map(dailyRows.map((row) => [row.store_id, row]));
  const previousDailyByStore = new Map(previousDailyRows.map((row) => [row.store_id, row]));

  const rows = currentRows
    .map((row) => {
      const previous = previousByStore.get(row.store_id);
      const currentDaily = dailyByStore.get(row.store_id);
      const previousDaily = previousDailyByStore.get(row.store_id);
      const monthlyCurrent = parseNumber(row.total_amount);
      const monthlyPrevious = parseNumber(previous?.total_amount);
      const dailyCurrent = parseNumber(currentDaily?.total_amount);
      const dailyPrevious = parseNumber(previousDaily?.total_amount);

      return {
        outlet: normalizeSebelasOutletName(row.store_name),
        monthlyCurrent,
        monthlyPrevious,
        dailyCurrent,
        dailyPrevious
      };
    })
    .sort((left, right) => right.monthlyCurrent - left.monthlyCurrent);

  const monthlyCurrent = sum(rows.map((row) => row.monthlyCurrent));
  const monthlyPrevious = sum(rows.map((row) => row.monthlyPrevious));
  const dailyCurrent = sum(rows.map((row) => row.dailyCurrent));
  const dailyPrevious = sum(rows.map((row) => row.dailyPrevious));
  const strongestOutlet = rows[0];

  return {
    brandId: "sebelas",
    section: {
      id: "sebelas",
      name: "Sebelas Coffee",
      source: "Olsera",
      state: "live",
      note: "7 outlet aktif, data otomatis ditarik dari endpoint multi-outlet summary Olsera.",
      summaryCards: [
        {
          label: "Omset MTD",
          value: formatCurrency(monthlyCurrent),
          note: "Semua outlet Sebelas Coffee",
          changePct: computePct(monthlyCurrent, monthlyPrevious)
        },
        {
          label: "Omset Harian",
          value: formatCurrency(dailyCurrent),
          note: `${formatDateForHumans(basisDates.closedDay)} vs ${formatDateForHumans(basisDates.previousDay)}`,
          changePct: computePct(dailyCurrent, dailyPrevious)
        },
        {
          label: "Top Product",
          value: "LATTE",
          note: "Snapshot SKU terakhir terverifikasi"
        },
        {
          label: "Outlet Terkuat",
          value: shortenOutletName(strongestOutlet?.outlet ?? "-"),
          note: `MTD ${formatCurrency(strongestOutlet?.monthlyCurrent ?? 0)}`
        }
      ],
      table: {
        title: "Omset per outlet",
        description: "MTD April dan performa harian outlet inti Sebelas Coffee.",
        columns: [
          { key: "outlet", label: "Outlet" },
          { key: "mtd", label: "Omset MTD", align: "right" },
          { key: "mtdChange", label: "Vs Bulan Lalu", align: "right" },
          { key: "daily", label: formatDateForShortColumn(basisDates.closedDay), align: "right" },
          { key: "dailyChange", label: `Vs ${formatDateForShortColumn(basisDates.previousDay)}`, align: "right" }
        ],
        rows: rows.map((row) => ({
          outlet: row.outlet,
          mtd: formatCurrency(row.monthlyCurrent),
          mtdChange: formatSignedPct(computePct(row.monthlyCurrent, row.monthlyPrevious)),
          daily: formatCurrency(row.dailyCurrent),
          dailyChange: formatSignedPct(computePct(row.dailyCurrent, row.dailyPrevious))
        }))
      },
      rankings: [STATIC_SEBELAS_ALL_OUTLET_RANKING, STATIC_SEBELAS_OUTLET_RANKING],
      notes: [
        "Omset memakai endpoint multi-outlet summary sebagai source of truth.",
        "Ranking produk masih memakai snapshot SKU terakhir yang terverifikasi karena endpoint SKU lintas outlet belum konsisten untuk automation headless.",
        "Jika token Olsera kedaluwarsa, refresh berikutnya akan mempertahankan snapshot terakhir sampai sesi diperbarui."
      ]
    },
    metrics: {
      monthlyCurrent,
      monthlyPrevious,
      dailyCurrent,
      dailyPrevious
    }
  };
}

async function fetchOlseraSalesSummary(urlId, accessToken, fromDate, toDate) {
  const url = new URL(`https://permissions-api-dash.olsera.co.id/api/${urlId}/admin/v1/id/multioutletreports/salessummary`);
  url.searchParams.set("from", formatDateForApi(fromDate));
  url.searchParams.set("to", formatDateForApi(toDate));
  url.searchParams.set("period", "custom");

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Olsera summary gagal (${response.status})`);
  }

  const json = await response.json();
  if (!Array.isArray(json.data)) {
    throw new Error("Olsera summary tidak mengembalikan array data.");
  }

  return json.data;
}

function normalizeSebelasOutletName(value) {
  return String(value)
    .replace(/^Sebelas Coffee\s+/i, "Sebelas Coffee ")
    .replace(/\s+/g, " ")
    .trim();
}

function shortenOutletName(value) {
  return value.replace(/^Sebelas Coffee\s+/i, "");
}

async function buildSnapoboxSection(basisDates) {
  const email = process.env.SNAPOBOX_EMAIL;
  const password = process.env.SNAPOBOX_PASSWORD;
  if (!email || !password) {
    throw Object.assign(new Error("Credential Snapobox belum diisi."), { brandId: "snapobox" });
  }

  const token = await loginSnapobox(email, password);
  const kiosks = await fetchSnapoboxKiosks(token);

  const rows = await mapWithConcurrency(kiosks, 4, async (kiosk) => {
    const monthlyCurrent = await fetchSnapoboxGrossIncome(token, kiosk.id, basisDates.monthlyCurrentStart, basisDates.closedDay);
    const monthlyPrevious = await fetchSnapoboxGrossIncome(token, kiosk.id, basisDates.monthlyPreviousStart, basisDates.monthlyPreviousEnd);
    const dailyCurrent = await fetchSnapoboxGrossIncome(token, kiosk.id, basisDates.closedDay, basisDates.closedDay);
    const dailyPrevious = await fetchSnapoboxGrossIncome(token, kiosk.id, basisDates.previousDay, basisDates.previousDay);

    return {
      kiosk: kiosk.name,
      monthlyCurrent,
      monthlyPrevious,
      dailyCurrent,
      dailyPrevious
    };
  });

  rows.sort((left, right) => right.monthlyCurrent - left.monthlyCurrent);

  const monthlyCurrent = sum(rows.map((row) => row.monthlyCurrent));
  const monthlyPrevious = sum(rows.map((row) => row.monthlyPrevious));
  const dailyCurrent = sum(rows.map((row) => row.dailyCurrent));
  const dailyPrevious = sum(rows.map((row) => row.dailyPrevious));
  const topKiosk = rows[0];
  const dailyRisers = rows
    .map((row) => ({
      ...row,
      changePct: computePct(row.dailyCurrent, row.dailyPrevious)
    }))
    .filter((row) => row.changePct !== null)
    .sort((left, right) => (right.changePct ?? -Infinity) - (left.changePct ?? -Infinity))
    .slice(0, 3);

  return {
    brandId: "snapobox",
    section: {
      id: "snapobox",
      name: "Snapobox",
      source: "Photolab",
      state: "live",
      note: "28 kiosk aktif, dihitung dari export transaction per kiosk agar closed-day dan MTD tetap presisi.",
      summaryCards: [
        {
          label: "Omset MTD",
          value: formatCurrency(monthlyCurrent),
          note: "Semua kiosk Snapobox",
          changePct: computePct(monthlyCurrent, monthlyPrevious)
        },
        {
          label: "Omset Harian",
          value: formatCurrency(dailyCurrent),
          note: `${formatDateForHumans(basisDates.closedDay)} vs ${formatDateForHumans(basisDates.previousDay)}`,
          changePct: computePct(dailyCurrent, dailyPrevious)
        },
        {
          label: "Top Kiosk",
          value: topKiosk?.kiosk ?? "-",
          note: `MTD ${formatCurrency(topKiosk?.monthlyCurrent ?? 0)}`
        },
        {
          label: "Kiosk Live",
          value: `${rows.length} unit`,
          note: "Refresh harian berjalan langsung ke API Photolab"
        }
      ],
      table: {
        title: "Top kiosk bulan ini",
        description: "Kiosk dengan omset tertinggi dan laju perbandingan harian yang relevan.",
        columns: [
          { key: "kiosk", label: "Kiosk" },
          { key: "mtd", label: "Omset MTD", align: "right" },
          { key: "mtdChange", label: "Vs Bulan Lalu", align: "right" },
          { key: "daily", label: formatDateForShortColumn(basisDates.closedDay), align: "right" },
          { key: "dailyChange", label: `Vs ${formatDateForShortColumn(basisDates.previousDay)}`, align: "right" }
        ],
        rows: rows.slice(0, 6).map((row) => ({
          kiosk: row.kiosk,
          mtd: formatCurrency(row.monthlyCurrent),
          mtdChange: formatSignedPct(computePct(row.monthlyCurrent, row.monthlyPrevious)),
          daily: formatCurrency(row.dailyCurrent),
          dailyChange: formatSignedPct(computePct(row.dailyCurrent, row.dailyPrevious))
        }))
      },
      rankings: [
        {
          title: "Performa harian paling cepat naik",
          description: "Kiosk yang melonjak paling besar pada hari tertutup terakhir.",
          items: dailyRisers.map((row) => ({
            name: row.kiosk,
            value: formatSignedPct(row.changePct),
            detail: `${formatCurrency(row.dailyCurrent)} vs ${formatCurrency(row.dailyPrevious)}`
          }))
        }
      ],
      notes: [
        "Snapobox belum punya dimensi produk yang stabil di dashboard saat ini, jadi fokus utama dashboard adalah performa kiosk.",
        "Masalah frame popularity bulanan tetap perlu dibereskan oleh developer Snapobox karena API publik masih memakai lifetime count.",
        "Semua angka gross income dihitung dari transaksi sukses pada export range yang sama."
      ]
    },
    metrics: {
      monthlyCurrent,
      monthlyPrevious,
      dailyCurrent,
      dailyPrevious
    }
  };
}

async function loginSnapobox(email, password) {
  const response = await fetch("https://api.photolabtech.com/auth", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const json = await response.json();
  if (!response.ok || json.status !== "success") {
    throw new Error("Login Snapobox gagal.");
  }

  return json.data.token;
}

async function fetchSnapoboxKiosks(token) {
  const url = new URL("https://api.photolabtech.com/kiosk");
  url.searchParams.set("type", "transactions");
  url.searchParams.set("pageNumber", "1");
  url.searchParams.set("pageSize", "100");

  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` }
  });

  const json = await response.json();
  if (!response.ok || json.status !== "success") {
    throw new Error("Daftar kiosk Snapobox gagal diambil.");
  }

  return json.data.data;
}

async function fetchSnapoboxGrossIncome(token, kioskId, fromDate, toDate) {
  const url = new URL("https://api.photolabtech.com/kiosk/transactions/export");
  url.searchParams.set("fromDate", formatDateForApi(fromDate));
  url.searchParams.set("toDate", formatDateForApi(toDate));
  url.searchParams.set("startTime", "00:00");
  url.searchParams.set("endTime", "23:59");
  url.searchParams.set("kioskId", String(kioskId));
  url.searchParams.set("status", "");

  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` }
  });

  const json = await response.json();
  if (!response.ok || json.status !== "success") {
    throw new Error(`Export transaksi Snapobox gagal untuk kiosk ${kioskId}.`);
  }

  const rows = json.data?.data ?? [];
  return rows.reduce((total, row) => {
    const normalizedStatus = normalizeSnapoboxStatus(row);
    if (normalizedStatus !== "success") return total;
    return total + parseNumber(row.grossPrice);
  }, 0);
}

function normalizeSnapoboxStatus(row) {
  return row.status === "settlement" ? "success" : "failed";
}

async function buildZonaSection(basisDates) {
  const username = process.env.ZONA_USERNAME;
  const password = process.env.ZONA_PASSWORD;
  if (!username || !password) {
    throw Object.assign(new Error("Credential Zona belum diisi."), { brandId: "zona" });
  }

  const cookie = await loginZona(username, password);
  const monthlyBalcos = await fetchZonaPerformance(cookie, 1, basisDates.monthlyCurrentStart, basisDates.closedDay);
  const monthlyPlemburan = await fetchZonaPerformance(cookie, 3, basisDates.monthlyCurrentStart, basisDates.closedDay);
  const dailyBalcos = await fetchZonaPerformance(cookie, 1, basisDates.closedDay, basisDates.closedDay);
  const dailyPlemburan = await fetchZonaPerformance(cookie, 3, basisDates.closedDay, basisDates.closedDay);

  const outlets = [
    {
      outlet: "Balcos Compound",
      monthlyCurrent: monthlyBalcos.revenue.current,
      monthlyPrevious: monthlyBalcos.revenue.previous,
      appointmentsCurrent: monthlyBalcos.appointments.current,
      appointmentsPrevious: monthlyBalcos.appointments.previous,
      dailyCurrent: dailyBalcos.revenue.current,
      dailyPrevious: dailyBalcos.revenue.previous
    },
    {
      outlet: "Plemburan",
      monthlyCurrent: monthlyPlemburan.revenue.current,
      monthlyPrevious: monthlyPlemburan.revenue.previous,
      appointmentsCurrent: monthlyPlemburan.appointments.current,
      appointmentsPrevious: monthlyPlemburan.appointments.previous,
      dailyCurrent: dailyPlemburan.revenue.current,
      dailyPrevious: dailyPlemburan.revenue.previous
    }
  ];

  const monthlyCurrent = sum(outlets.map((item) => item.monthlyCurrent));
  const monthlyPrevious = sum(outlets.map((item) => item.monthlyPrevious));
  const monthlyAppointmentsCurrent = sum(outlets.map((item) => item.appointmentsCurrent));
  const monthlyAppointmentsPrevious = sum(outlets.map((item) => item.appointmentsPrevious));
  const dailyCurrent = sum(outlets.map((item) => item.dailyCurrent));
  const dailyPrevious = sum(outlets.map((item) => item.dailyPrevious));
  const dailyAppointmentsCurrent = dailyBalcos.appointments.current + dailyPlemburan.appointments.current;
  const dailyAppointmentsPrevious = dailyBalcos.appointments.previous + dailyPlemburan.appointments.previous;

  return {
    brandId: "zona",
    section: {
      id: "zona",
      name: "Zona Massage",
      source: "LatePoint",
      state: "live",
      note: "2 outlet aktif, progress ditarik langsung dari widget performance LatePoint.",
      summaryCards: [
        {
          label: "Omset MTD",
          value: formatCurrency(monthlyCurrent),
          note: "Balcos Compound + Plemburan",
          changePct: computePct(monthlyCurrent, monthlyPrevious)
        },
        {
          label: "Appointment MTD",
          value: formatCount(monthlyAppointmentsCurrent),
          note: "Total booking bulan berjalan",
          changePct: computePct(monthlyAppointmentsCurrent, monthlyAppointmentsPrevious)
        },
        {
          label: "Omset Harian",
          value: formatCurrency(dailyCurrent),
          note: `${formatDateForHumans(basisDates.closedDay)} vs ${formatDateForHumans(basisDates.previousDay)}`,
          changePct: computePct(dailyCurrent, dailyPrevious)
        },
        {
          label: "Appointment Harian",
          value: formatCount(dailyAppointmentsCurrent),
          note: `${formatDateForHumans(basisDates.closedDay)} vs ${formatDateForHumans(basisDates.previousDay)}`,
          changePct: computePct(dailyAppointmentsCurrent, dailyAppointmentsPrevious)
        }
      ],
      table: {
        title: "Performa outlet",
        description: "Omset, appointment, dan laju outlet Zona Massage.",
        columns: [
          { key: "outlet", label: "Outlet" },
          { key: "mtd", label: "Omset MTD", align: "right" },
          { key: "mtdChange", label: "Vs Bulan Lalu", align: "right" },
          { key: "appointments", label: "Appointment", align: "right" },
          { key: "daily", label: formatDateForShortColumn(basisDates.closedDay), align: "right" }
        ],
        rows: outlets.map((row) => ({
          outlet: row.outlet,
          mtd: formatCurrency(row.monthlyCurrent),
          mtdChange: formatSignedPct(computePct(row.monthlyCurrent, row.monthlyPrevious), 0),
          appointments: formatCount(row.appointmentsCurrent),
          daily: formatCurrency(row.dailyCurrent)
        }))
      },
      rankings: [STATIC_ZONA_RANKING],
      notes: [
        "Omset dan appointment sudah direfresh ke basis tertutup lewat widget performance LatePoint.",
        "Top service masih memakai snapshot Appointments terakhir yang terverifikasi sampai ranking service ikut diotomatisasi penuh."
      ]
    },
    metrics: {
      monthlyCurrent,
      monthlyPrevious,
      dailyCurrent,
      dailyPrevious
    }
  };
}

async function loginZona(username, password) {
  const body = new URLSearchParams({
    log: username,
    pwd: password,
    "wp-submit": "Log In",
    redirect_to: "https://zonaspa.id/wp-admin/",
    testcookie: "1"
  });

  const response = await fetch("https://zonaspa.id/wp-login.php", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    redirect: "manual"
  });

  const cookie = joinSetCookies(response.headers.get("set-cookie"));
  if (!cookie.includes("wordpress_sec_")) {
    throw new Error("Login Zona gagal.");
  }

  return cookie;
}

function joinSetCookies(setCookieHeader) {
  if (!setCookieHeader) return "";
  return setCookieHeader.split(/,(?=[^;]+=[^;]+)/).map((part) => part.split(";")[0]).join("; ");
}

async function fetchZonaPerformance(cookie, locationId, fromDate, toDate) {
  const body = new URLSearchParams({
    action: "latepoint_route_call",
    route_name: "dashboard__widget_daily_bookings_chart",
    params: `location_id=${locationId}&agent_id=&service_id=&date_from=${formatDateForApi(fromDate)}&date_to=${formatDateForApi(toDate)}`,
    return_format: "json"
  });

  const response = await fetch("https://zonaspa.id/wp-admin/admin-ajax.php", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-requested-with": "XMLHttpRequest",
      cookie
    },
    body
  });

  const json = await response.json();
  if (!response.ok || json.status !== "success") {
    throw new Error(`Widget Zona gagal untuk location ${locationId}.`);
  }

  return parseZonaPerformanceHtml(json.message);
}

function parseZonaPerformanceHtml(html) {
  const blocks = [...html.matchAll(/<div class="stats-tab">([\s\S]*?)<\/div>\s*<\/div>/g)].map((match) => match[1]);
  const parsedBlocks = blocks.map((block) => ({
    value: decodeHtml(matchFirst(block, /stats-tab-value-self">([^<]+)</)),
    previous: decodeHtml(matchFirst(block, /Previously:\s*<strong>([^<]+)</)),
    label: decodeHtml(matchFirst(block, /stats-tab-label">([^<]+)</))
  }));

  const appointments = parsedBlocks.find((item) => item.label === "Appointments");
  const revenue = parsedBlocks.find((item) => item.label === "Sales Revenue");

  if (!appointments || !revenue) {
    throw new Error("Widget Zona tidak memuat Appointments atau Sales Revenue.");
  }

  return {
    appointments: {
      current: parseNumber(appointments.value),
      previous: parseNumber(appointments.previous)
    },
    revenue: {
      current: parseCurrencyLike(revenue.value),
      previous: parseCurrencyLike(revenue.previous)
    }
  };
}

function decodeHtml(value) {
  return String(value ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function matchFirst(value, pattern) {
  return value.match(pattern)?.[1] ?? "";
}

async function buildSnapOSnapSection(basisDates) {
  const sheetId = process.env.SNAPOSNAP_SHEET_ID;
  if (!sheetId) {
    throw Object.assign(new Error("SNAPOSNAP_SHEET_ID belum diisi."), { brandId: "snaposnap" });
  }

  const branches = await Promise.all(
    SNAPOSNAP_SHEETS.map(async (sheet) => {
      const rows = await fetchSnapOSnapSheet(sheetId, sheet.sheetName);
      const normalizedRows = rows.map(normalizeSnapOSnapDataRow).filter(Boolean);
      const monthlyCurrentRows = filterRowsByRange(normalizedRows, basisDates.monthlyCurrentStart, basisDates.closedDay);
      const monthlyPreviousRows = filterRowsByRange(normalizedRows, basisDates.monthlyPreviousStart, basisDates.monthlyPreviousEnd);
      const dailyCurrentRows = filterRowsByExactDate(normalizedRows, basisDates.closedDay);
      const dailyPreviousRows = filterRowsByExactDate(normalizedRows, basisDates.previousDay);

      return {
        branch: sheet.key,
        monthlyCurrent: sum(monthlyCurrentRows.map((row) => row.actualTotalBayar)),
        monthlyPrevious: sum(monthlyPreviousRows.map((row) => row.actualTotalBayar)),
        dailyCurrent: sum(dailyCurrentRows.map((row) => row.actualTotalBayar)),
        dailyPrevious: sum(dailyPreviousRows.map((row) => row.actualTotalBayar)),
        monthlyRows: monthlyCurrentRows
      };
    })
  );

  const combinedMonthlyRows = branches.flatMap((branch) => branch.monthlyRows);
  const packageRanking = buildCategoryRanking(combinedMonthlyRows, "paket");
  const kategoriRanking = buildCategoryRanking(combinedMonthlyRows, "kategori");

  const monthlyCurrent = sum(branches.map((item) => item.monthlyCurrent));
  const monthlyPrevious = sum(branches.map((item) => item.monthlyPrevious));
  const dailyCurrent = sum(branches.map((item) => item.dailyCurrent));
  const dailyPrevious = sum(branches.map((item) => item.dailyPrevious));

  return {
    brandId: "snaposnap",
    section: {
      id: "snaposnap",
      name: "Snap O' Snap",
      source: "Google Sheet",
      state: "live",
      note: "4 cabang aktif, dibaca read-only dari Google Sheet sumber.",
      summaryCards: [
        {
          label: "Omset MTD",
          value: formatCurrency(monthlyCurrent),
          note: "4 cabang Snap O' Snap",
          changePct: computePct(monthlyCurrent, monthlyPrevious)
        },
        {
          label: "Omset Harian",
          value: formatCurrency(dailyCurrent),
          note: `${formatDateForHumans(basisDates.closedDay)} vs ${formatDateForHumans(basisDates.previousDay)}`,
          changePct: computePct(dailyCurrent, dailyPrevious)
        },
        {
          label: "Top Paket",
          value: packageRanking[0]?.name ?? "-",
          note: `${packageRanking[0]?.value ?? "0 transaksi"} • ${packageRanking[0]?.detail ?? "Rp0"}`
        },
        {
          label: "Top Kategori",
          value: kategoriRanking[0]?.name ?? "-",
          note: `${kategoriRanking[0]?.value ?? "0 transaksi"} • ${kategoriRanking[0]?.detail ?? "Rp0"}`
        }
      ],
      table: {
        title: "Omset per cabang",
        description: "Cabang Snap O' Snap dengan breakdown MTD dan daily tertutup terakhir.",
        columns: [
          { key: "cabang", label: "Cabang" },
          { key: "mtd", label: "Omset MTD", align: "right" },
          { key: "mtdChange", label: "Vs Bulan Lalu", align: "right" },
          { key: "daily", label: formatDateForShortColumn(basisDates.closedDay), align: "right" },
          { key: "dailyChange", label: `Vs ${formatDateForShortColumn(basisDates.previousDay)}`, align: "right" }
        ],
        rows: branches.map((branch) => ({
          cabang: branch.branch,
          mtd: formatCurrency(branch.monthlyCurrent),
          mtdChange: formatSignedPct(computePct(branch.monthlyCurrent, branch.monthlyPrevious)),
          daily: formatCurrency(branch.dailyCurrent),
          dailyChange: formatSignedPct(computePct(branch.dailyCurrent, branch.dailyPrevious))
        }))
      },
      rankings: [
        {
          title: "Top paket",
          description: "Ranking berdasarkan jumlah transaksi untuk periode April MTD.",
          items: packageRanking
        },
        {
          title: "Top kategori",
          description: "Kategori customer paling dominan di seluruh cabang.",
          items: kategoriRanking
        }
      ],
      notes: [
        "Spreadsheet dibaca read-only, tidak ada perubahan ke file sumber.",
        "Header dan sheet name dibaca langsung dari tab overview masing-masing cabang agar automation tidak bergantung pada klik browser."
      ]
    },
    metrics: {
      monthlyCurrent,
      monthlyPrevious,
      dailyCurrent,
      dailyPrevious
    }
  };
}

async function fetchSnapOSnapSheet(sheetId, sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Sheet ${sheetName} gagal dibaca.`);
  }

  const csv = await response.text();
  const rows = parseCsv(csv);
  return rows;
}

function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (quoted && next === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === "," && !quoted) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

function normalizeSnapOSnapDataRow(row, index, allRows) {
  const headerRowIndex = 0;
  if (index <= headerRowIndex) return null;

  const headers = allRows[headerRowIndex].map(normalizeSheetHeader);
  const record = {};
  for (let columnIndex = 0; columnIndex < headers.length; columnIndex += 1) {
    record[headers[columnIndex]] = row[columnIndex];
  }

  const rawDateKey = Object.keys(record).find((key) => key.includes("tanggal pelaksanaan"));
  const actualTotalBayarKey = Object.keys(record).find((key) => key.includes("actual total bayar"));
  const paketKey = Object.keys(record).find((key) => key === "paket");
  const kategoriKey = Object.keys(record).find((key) => key === "kategori");

  const rawDate = rawDateKey ? record[rawDateKey] : "";
  const parsedDate = parseSnapOSnapDate(rawDate);
  if (!parsedDate) return null;

  return {
    tanggalPelaksanaan: parsedDate,
    actualTotalBayar: parseCurrencyLike(actualTotalBayarKey ? record[actualTotalBayarKey] : 0),
    paket: normalizeCategoryValue(paketKey ? record[paketKey] : ""),
    kategori: normalizeCategoryValue(kategoriKey ? record[kategoriKey] : "")
  };
}

function normalizeSheetHeader(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/\n/g, " ")
    .trim()
    .toLowerCase();
}

function parseSnapOSnapDate(value) {
  const text = String(value ?? "").trim();
  const slashMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return new Date(`${year}-${pad2(month)}-${pad2(day)}T00:00:00${JAKARTA_OFFSET}`);
  }

  const dashMatch = text.match(/(\d{1,2})-([A-Za-z]+)-(\d{4})/);
  if (!dashMatch) return null;

  const [, day, monthNameRaw, year] = dashMatch;
  const monthIndex = [
    "januari",
    "februari",
    "maret",
    "april",
    "mei",
    "juni",
    "juli",
    "agustus",
    "september",
    "oktober",
    "november",
    "desember"
  ].indexOf(monthNameRaw.toLowerCase());
  if (monthIndex < 0) return null;

  return new Date(`${year}-${pad2(monthIndex + 1)}-${pad2(day)}T00:00:00${JAKARTA_OFFSET}`);
}

function normalizeCategoryValue(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed || "(Kosong)";
}

function filterRowsByRange(rows, startDate, endDate) {
  return rows.filter((row) => row.tanggalPelaksanaan >= startDate && row.tanggalPelaksanaan <= endDate);
}

function filterRowsByExactDate(rows, date) {
  return rows.filter((row) => sameDate(row.tanggalPelaksanaan, date));
}

function sameDate(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function buildCategoryRanking(rows, key) {
  const map = new Map();
  for (const row of rows) {
    const bucket = map.get(row[key]) ?? { count: 0, revenue: 0 };
    bucket.count += 1;
    bucket.revenue += row.actualTotalBayar;
    map.set(row[key], bucket);
  }

  return [...map.entries()]
    .map(([name, stats]) => ({
      name,
      value: `${formatCount(stats.count)} transaksi`,
      detail: formatCurrency(stats.revenue),
      count: stats.count,
      revenue: stats.revenue
    }))
    .sort((left, right) => right.count - left.count || right.revenue - left.revenue)
    .map(({ count, revenue, ...item }) => item)
    .slice(0, 3);
}

function buildPlaceholderSections() {
  return [
    {
      id: "tunas",
      name: "Tunas Mekar Dental",
      source: "Shopee Seller",
      state: "placeholder",
      note: "Placeholder tetap ditampilkan, menunggu integrasi data resmi dari Shopee.",
      summaryCards: [
        { label: "Omset MTD", value: "-", note: "Belum ada source data harian yang stabil" },
        { label: "Omset Harian", value: "-", note: "Menunggu strategi integrasi Shopee" },
        { label: "Top Product", value: "-", note: "Belum ada data order item" },
        { label: "Status Integrasi", value: "Pending", note: "Opsi terbaik tetap Open Platform / reauth flow" }
      ],
      notes: [
        "Tetap tampil untuk menjaga slot brand di dashboard.",
        "Nilai sengaja dikosongkan sampai pipeline Shopee diputuskan."
      ]
    },
    {
      id: "balcos",
      name: "Balcos Compound",
      source: "Manual / Pending Source",
      state: "placeholder",
      note: "Placeholder brand mandiri tetap muncul di dashboard, terpisah dari outlet Balcos Compound milik Zona Massage.",
      summaryCards: [
        { label: "Omset MTD", value: "-", note: "Belum ada source data resmi" },
        { label: "Omset Harian", value: "-", note: "Belum ada source data resmi" },
        { label: "Top Product", value: "-", note: "Belum ada data transaksi" },
        { label: "Status Integrasi", value: "Pending", note: "Menunggu sistem sumber ditentukan" }
      ],
      notes: [
        "Kartu ini sengaja kosong sebagai placeholder brand tersendiri.",
        "Jangan bingungkan dengan outlet Balcos Compound di dalam Zona Massage."
      ]
    }
  ];
}

function parseNumber(value) {
  if (typeof value === "number") return value;
  const normalized = String(value ?? "").replace(/[^0-9.-]/g, "");
  if (!normalized) return 0;
  return Number(normalized);
}

function formatDateForShortColumn(date) {
  return `${date.getDate()} ${monthName(date.getMonth()).slice(0, 3)}`;
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function run() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => run()));
  return results;
}
