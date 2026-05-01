# Report Automation

Daily refresh runs from GitHub Actions at 03:15 WIB and commits only the refreshed report JSON. The live dashboard fetches that JSON from GitHub raw at runtime, so daily data updates do not need a full Vercel rebuild/deploy.

Required GitHub Actions secrets:

- `OLSERA_APP_ID` / `OLSERA_SECRET_KEY`, or per-outlet Open API app credentials once approved by Olsera
- `OLSERA_DASH_EMAIL`
- `OLSERA_DASH_PASSWORD`
- `SNAPOBOX_EMAIL`
- `SNAPOBOX_PASSWORD`
- `ZONA_USERNAME`
- `ZONA_PASSWORD`
- `SNAPOSNAP_SHEET_ID`
- `TMD_SHEET_ID` (optional, default points to the shared TMD Google Sheet)
- `TMD_SHEET_GID` (optional, default points to `DAILY REPORT & SALES OVERVIEW`)
- `TMD_SHEET_RANGE` (optional, default `B1:CJ411`)
- `SHOPEE_PARTNER_ID`
- `SHOPEE_PARTNER_KEY`
- `SHOPEE_SHOP_ID`
- `SHOPEE_REFRESH_TOKEN`

Alternative Olsera secrets if the session export is easier to provide:

- `OLSERA_CONTEXT_JSON`
- `OLSERA_CONTEXT_BASE64`

Use `OLSERA_ACCESS_TOKEN` and `OLSERA_STORE_URL_ID` for stable automation whenever possible. `OLSERA_CONTEXT_PATH` is still supported for local testing, but it should not point to `/tmp` in production because that file can disappear between runs.

## Olsera Status

The Olsera store account is connected to the Open API console. Seven Sebelas Coffee outlet apps were created for:

- `sebelascoffeegejayan`
- `sebelascoffeemonjali`
- `sebelascoffeeconcat`
- `sebelascoffeeveteran`
- `sebelascoffeenologaten`
- `sebelascoffeehos`
- `sebelascoffeeaurigajakal`

All apps are currently `Pending`, so the token endpoint returns `401 Not Authorized`. While waiting for approval, the report can use `OLSERA_DASH_EMAIL` and `OLSERA_DASH_PASSWORD` to log in to Olsera Backoffice and read the internal dashboard sales summary per outlet. This is a working fallback, but Open API is still the preferred long-term path.

After approval, the report should use the official Open API endpoints:

- `GET /api/open-api/v1/en/report/salesdetails`
- `GET /api/open-api/v1/en/report/productsalesbysku`
- `GET /api/open-api/v1/en/report/salesitemspergroup`

## Tunas Mekar Dental Status

Tunas Mekar Dental now uses Google Sheets as the primary source because the onsite admin updates it close to real time:

- Spreadsheet: `SUMBER DATA TMD 2026`
- Tab: `DAILY REPORT & SALES OVERVIEW`
- Date column: `B` / `Tanggal ORDERAN MASUK`
- Revenue column: `CJ` / `TOTAL DAILY REVENUE`

The generator reads the sheet as CSV and calculates daily revenue, MTD revenue, previous-day comparison, previous-month MTD comparison, and a 7-day daily table.

The dashboard reads `src/data/markarta-report.json` from the `main` branch at:

`https://raw.githubusercontent.com/aditwinas/markarta-web/main/src/data/markarta-report.json`

If GitHub raw is unavailable, the dashboard falls back to the JSON bundled in the latest Vercel deployment.

## Shopee Status

Shopee Open Platform remains available as a secondary implementation path if direct marketplace item detail is needed later. The report generator can use Shopee when these GitHub Actions secrets exist and the Google Sheet path is disabled:

- `SHOPEE_PARTNER_ID`
- `SHOPEE_PARTNER_KEY`
- `SHOPEE_SHOP_ID`
- `SHOPEE_REFRESH_TOKEN`

`SHOPEE_ACCESS_TOKEN` is optional because the automation refreshes it from `SHOPEE_REFRESH_TOKEN` on each run. The generator reads:

- `GET /api/v2/order/get_order_list`
- `GET /api/v2/order/get_order_detail`

The current calculation excludes `UNPAID`, `CANCELLED`, and `IN_CANCEL`; MTD and daily revenue use Shopee `total_amount`, while top product ranking uses `item_list` quantity and item price from order detail.
