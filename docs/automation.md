# Report Automation

Daily refresh runs from GitHub Actions at 03:15 WIB and deploys the rebuilt static site to Vercel.

Required GitHub Actions secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `OLSERA_APP_ID` / `OLSERA_SECRET_KEY`, or per-outlet Open API app credentials once approved by Olsera
- `OLSERA_DASH_EMAIL`
- `OLSERA_DASH_PASSWORD`
- `SNAPOBOX_EMAIL`
- `SNAPOBOX_PASSWORD`
- `ZONA_USERNAME`
- `ZONA_PASSWORD`
- `SNAPOSNAP_SHEET_ID`
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

## Shopee Status

Tunas Mekar Dental is prepared for Shopee Open Platform. The report generator will switch the brand from placeholder to live automatically when these GitHub Actions secrets exist:

- `SHOPEE_PARTNER_ID`
- `SHOPEE_PARTNER_KEY`
- `SHOPEE_SHOP_ID`
- `SHOPEE_REFRESH_TOKEN`

`SHOPEE_ACCESS_TOKEN` is optional because the automation refreshes it from `SHOPEE_REFRESH_TOKEN` on each run. The generator reads:

- `GET /api/v2/order/get_order_list`
- `GET /api/v2/order/get_order_detail`

The current calculation excludes `UNPAID`, `CANCELLED`, and `IN_CANCEL`; MTD and daily revenue use Shopee `total_amount`, while top product ranking uses `item_list` quantity and item price from order detail.
