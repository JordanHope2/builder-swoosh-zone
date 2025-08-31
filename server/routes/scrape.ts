import { Router, type Request, type Response } from "express";
import "dotenv/config";
import Parser from "rss-parser";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const parser = new Parser();

interface Job {
  id?: string;
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  link?: string;
  pubDate?: string;
  created?: string;
  source: string;
}

const scrapeSwissDevJobs = async (): Promise<Job[]> => {
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
  } catch (error: unknown) {
    console.error("Error scraping from SwissDevJobs:", error);
    return [];
  }
};

router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const { search, location, page = 1, limit = 20 } = req.query;

  const adzunaPromise = (async (): Promise<Job[]> => {
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch data from Adzuna", data);
        return [];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
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
    } catch (error: unknown) {
      console.error("Error scraping from Adzuna:", error);
      return [];
    }
  })();

  const swissDevJobsPromise = scrapeSwissDevJobs();

  const [adzunaJobs, swissDevJobs] = await Promise.all([
    adzunaPromise,
    swissDevJobsPromise,
  ]);

  // Simple merge, could be improved with deduplication
  const allJobs = [...adzunaJobs, ...swissDevJobs];

  res.json({ results: allJobs });
}));

export default router;
