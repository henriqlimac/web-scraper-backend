import { scrapeByDomain } from "../trusted-domains/domains";

import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeAndSave(url: string) {
  const domain = new URL(url).hostname;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const scraped = scrapeByDomain(domain, $);

    const result = { url, ...scraped };

    return result;
  } catch (err) {
    throw new Error("Failed to scrape: " + err);
  }
}
