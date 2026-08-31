import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATASET = path.resolve(__dirname, "../../Dataset");
const OUT_DIR = path.resolve(__dirname, "../public/data");

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      const v = values[i];
      row[h.trim()] =
        h === "cell_id" || h === "MU_GLOBAL" || h === "source"
          ? v
          : parseFloat(v);
    });
    return row;
  });
}

function computeDegradationRisk(row) {
  const oc = row.OC_D1 ?? 1.4;
  const bulk = row.BULK_D1 ?? 1.4;
  const ph = row.PHAQ_D1 ?? 6.5;
  const cn = row.CN_D1 ?? 10;

  let risk = 0;
  if (oc < 1.0) risk += 35;
  else if (oc < 1.3) risk += 20;
  else if (oc < 1.5) risk += 8;

  if (bulk > 1.55) risk += 25;
  else if (bulk > 1.45) risk += 12;

  if (ph < 5.5 || ph > 8.0) risk += 15;
  if (cn < 8) risk += 12;

  return Math.min(100, Math.round(risk + (row.cell_id % 17) * 1.2));
}

function riskLevel(risk) {
  if (risk >= 70) return "critical";
  if (risk >= 50) return "high";
  if (risk >= 30) return "moderate";
  return "low";
}

const mergedPath = path.join(DATASET, "merged_soil_embeddings.csv");
if (!fs.existsSync(mergedPath)) {
  console.error("Missing merged_soil_embeddings.csv in Dataset folder");
  process.exit(1);
}

const rows = parseCSV(fs.readFileSync(mergedPath, "utf-8"));

const cells = rows.map((row) => {
  const risk = computeDegradationRisk(row);
  return {
    id: row.cell_id,
    lat: row.latitude,
    lon: row.longitude,
    soc: row.OC_D1 > 0 ? row.OC_D1 : null,
    nitrogen: row.TOTN_D1 > 0 ? row.TOTN_D1 : null,
    bulkDensity: row.BULK_D1 > 0 ? row.BULK_D1 : null,
    cnRatio: row.CN_D1 > 0 ? row.CN_D1 : null,
    ph: row.PHAQ_D1 > 0 ? row.PHAQ_D1 : null,
    sand: row.SAND_D1 > 0 ? row.SAND_D1 : null,
    silt: row.SILT_D1 > 0 ? row.SILT_D1 : null,
    clay: row.CLAY_D1 > 0 ? row.CLAY_D1 : null,
    degradationRisk: risk,
    riskLevel: riskLevel(risk),
  };
});

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "cells.json"), JSON.stringify(cells));

const meta = {
  region: "Po Valley, Northern Italy",
  cellCount: cells.length,
  latRange: [44.5045, 45.4945],
  lonRange: [10.5063, 11.4875],
  center: [10.997, 45.0],
  generatedAt: new Date().toISOString(),
};

fs.writeFileSync(path.join(OUT_DIR, "meta.json"), JSON.stringify(meta, null, 2));
console.log(`Processed ${cells.length} cells → public/data/cells.json`);
