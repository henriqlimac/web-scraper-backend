import cheerio from "cheerio";

export interface ScrapeResult {
  title: string;
  price: string;
  rating?: string;
  image?: string;
}

type Scraper = ($: cheerio.Root) => ScrapeResult;

const domainScrapers: { pattern: RegExp; scraper: Scraper }[] = [
  {
    // Steam
    pattern: /steampowered\.com/,
    scraper: ($) => ({
      title:
        $("#appHubAppName").first().text().trim() ||
        $("#appHubAppName_responsive").first().text().trim() ||
        $(".apphub_AppName").first().text().trim(),
      price:
        $(".game_purchase_price").first().text().trim() ||
        $(".discount_final_price").first().text().trim() ||
        $(".price").first().text().trim(),
      rating:
        $(".game_review_summary").eq(1).text().trim() ||
        $(".user_reviews_summary_row .game_review_summary")
          .first()
          .text()
          .trim(),
      image: $(".game_header_image_full").attr("src") || "",
    }),
  },
  {
    // Amazon Brazil
    pattern: /amazon\.com\.br/,
    scraper: ($) => ({
      title: $("#title").first().text().trim(),
      price:
        "R$ " + $(".a-price-whole").first().text().trim().replace(/\D/g, ""),
      rating:
        $("#acrPopover").attr("title")?.split(" ")[0].trim() ||
        $("span.a-icon-alt").first().text().split(" ")[0].trim() ||
        "",
      image: $(".a-dynamic-image").attr("src") || "",
    }),
  },
  {
    // Artwalk
    pattern: /artwalk\.com\.br/,
    scraper: ($) => ({
      title: $("span.vtex-store-components-3-x-productBrand")
        .first()
        .text()
        .trim(),

      price: $("span.vtex-product-price-1-x-currencyContainer")
        .first()
        .text()
        .replace(/\u00a0|\s+/g, "")
        .trim(),

      image:
        $("img.vtex-store-components-3-x-productImageTag").attr("src") || "",
    }),
  },
  {
    // Nike
    pattern: /nike\.com/,
    scraper: ($) => ({
      title: $("h1.product-title").first().text().trim(),
      price: $("div.product-price").first().text().trim(),
      image: $("img.hero-image-image").attr("src") || "",
    }),
  },
  {
    // Walmart
    pattern: /walmart\.com/,
    scraper: ($) => ({
      title: $("h1.prod-ProductTitle").first().text().trim(),
      price:
        $("span.price-characteristic").attr("content") +
        "," +
        $("span.price-mantissa").attr("content"),
      image: $("img.prod-hero-image-image").attr("src") || "",
    }),
  },
  {
    // AliExpress
    pattern: /aliexpress\.com/,
    scraper: ($) => ({
      title: $(".pdp-comp-price-current").first().text().trim(),
      price: $(".product-price-value").first().text().trim(),
      image: $("img.magnifier--image--*").attr("src") || "",
    }),
  },
  {
    // Etsy
    pattern: /etsy\.com/,
    scraper: ($) => ({
      title: $("h1[data-buy-box-listing-title]").first().text().trim(),
      price: $("p[data-buy-box-listing-price]").first().text().trim(),
      image: $("ul.wt-list-unstyled li img").first().attr("src") || "",
    }),
  },
  {
    // Target
    pattern: /target\.com/,
    scraper: ($) => ({
      title: $("h1").first().text().trim(),
      price: $('div[data-test="product-price"]')
        .find("span")
        .first()
        .text()
        .trim(),
      image: $('img[data-test="product-image"]').attr("src") || "",
    }),
  },
];

export function scrapeByDomain(domain: string, $: cheerio.Root): ScrapeResult {
  const entry = domainScrapers.find(({ pattern }) => pattern.test(domain));
  if (entry) {
    return entry.scraper($);
  }
  throw new Error(`Unsupported domain: ${domain}`);
}
