import { z } from 'zod';

export const CityEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  description: z.string(),
  venue: z.string().optional(),
  category: z.enum([
    "cultural",
    "sports",
    "business",
    "music",
    "arts",
    "festival",
    "other",
  ]),
  url: z.string().optional(),
});

export const CityOverviewSchema = z.object({
  name: z.string(),
  country: z.string(),
  population: z.number(),
  highlights: z.array(z.string()),
  description: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

export const CityEventsDataSchema = z.object({
  id: z.string(),
  cityName: z.string(),
  overview: CityOverviewSchema,
  events: z.array(CityEventSchema),
  quickLinks: z.object({
    tourism: z.string(),
    events: z.string(),
    official: z.string(),
  }),
  lastUpdated: z.string(),
  expiresAt: z.string(),
});
