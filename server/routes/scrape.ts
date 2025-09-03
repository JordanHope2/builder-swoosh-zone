import { Router } from "express";
import "dotenv/config";
import Parser from "rss-parser";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const parser = new Parser();

const scrapeSwissDevJobs = async () => {
  try {
    const feed = await parser.parseURL("https://swissdevjobs.ch/jobs/rss");
    return feed.items.map((item) => ({
      title: item.title,
      company: item.creator,
      location: item.location,
      description: item.contentSnippet,
      link: item.link,
      pubDate: item.pubDate,
      source: "SwissDevJobs",
    }));
  } catch (error) {
    console.error("Error scraping from SwissDevJobs:", error);
    return [];
  }
};

router.get("/", authMiddleware, async (req, res) => {
  const { search, location, page = 1, limit = 20 } = req.query;

  const adzunaPromise = (async () => {
    if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_API_KEY) {
      console.error("Adzuna API credentials not configured.");
      return [];
    }

    try {
      const adzunaApiUrl = new URL(
        `https://api.adzuna.com/v1/api/jobs/ch/search/${page}`,
      );
      adzunaApiUrl.searchParams.append("app_id", process.env.ADZUNA_APP_ID);
      adzunaApiUrl.searchParams.append("app_key", process.env.ADZUNA_API_KEY);
      adzunaApiUrl.searchParams.append("results_per_page", limit.toString());
      if (search) {
        adzunaApiUrl.searchParams.append("what", search as string);
      }
      if (location) {
        adzunaApiUrl.searchParams.append("where", location as string);
      }
      adzunaApiUrl.searchParams.append("content-type", "application/json");

      const response = await fetch(adzunaApiUrl.toString());
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch data from Adzuna", data);
        return [];
      }

      return data.results.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        description: job.description,
        link: job.redirect_url,
        created: job.created,
        source: "Adzuna",
      }));
    } catch (error) {
      console.error("Error scraping from Adzuna:", error);
      return [];
    }
  })();

  const swissDevJobsPromise = scrapeSwissDevJobs();

  try {
    const [adzunaJobs, swissDevJobs] = await Promise.all([
      adzunaPromise,
      swissDevJobsPromise,
    ]);

    // Simple merge, could be improved with deduplication
    const allJobs = [...adzunaJobs, ...swissDevJobs];

    res.json({ results: allJobs });
  } catch (error) {
    console.error("Error fetching or combining job data:", error);
    res
      .status(500)
      .json({ error: "An unexpected error occurred while scraping." });
  }
});

export default router;
