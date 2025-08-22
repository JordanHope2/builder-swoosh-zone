import { supabase } from "../lib/supabase";

export interface CityEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  venue?: string;
  category:
    | "cultural"
    | "sports"
    | "business"
    | "music"
    | "arts"
    | "festival"
    | "other";
  url?: string;
}

export interface CityOverview {
  name: string;
  country: string;
  population: number;
  highlights: string[];
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CityEventsData {
  id: string;
  cityName: string;
  overview: CityOverview;
  events: CityEvent[];
  quickLinks: {
    tourism: string;
    events: string;
    official: string;
  };
  lastUpdated: string;
  expiresAt: string;
}

class CityEventsService {
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

  async getCityEvents(cityName: string): Promise<CityEventsData> {
    try {
      // Check cache first (non-blocking)
      let cachedData: CityEventsData | null = null;
      try {
        cachedData = await this.getCachedCityData(cityName);
        if (cachedData && !this.isCacheExpired(cachedData)) {
          return cachedData;
        }
      } catch (cacheError) {
        console.debug(
          "Cache check failed, proceeding without cache:",
          cacheError,
        );
      }

      // Fetch fresh data
      const cityData = await this.fetchCityData(cityName);

      // Cache the result (non-blocking)
      this.cacheCityData(cityData).catch((err) => {
        console.debug("Caching failed but continuing:", err);
      });

      return cityData;
    } catch (error) {
      console.warn(
        "Error getting city events, using fallback:",
        error instanceof Error ? error.message : "Unknown error",
      );
      return this.getFallbackCityData(cityName);
    }
  }

  private async getCachedCityData(
    cityName: string,
  ): Promise<CityEventsData | null> {
    try {
      const { data, error } = await supabase
        .from("city_events")
        .select("*")
        .eq("city_name", cityName.toLowerCase())
        .single();

      if (error) {
        // If table doesn't exist or other DB errors, just return null (no cache)
        console.debug("No cached city data available:", error.message);
        return null;
      }

      if (!data) {
        return null;
      }

      return this.transformDatabaseRecord(data);
    } catch (error) {
      console.debug(
        "Cache lookup failed (non-critical):",
        error instanceof Error ? error.message : "Unknown error",
      );
      return null;
    }
  }

  private isCacheExpired(cityData: CityEventsData): boolean {
    return new Date(cityData.expiresAt) < new Date();
  }

  private async fetchCityData(cityName: string): Promise<CityEventsData> {
    try {
      // Get city overview from Wikipedia/OpenAI
      const overview = await this.fetchCityOverview(cityName);

      // Get events from multiple sources
      const events = await this.fetchCityEvents(cityName);

      // Generate quick links
      const quickLinks = this.generateQuickLinks(cityName);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.CACHE_DURATION);

      return {
        id: `${cityName.toLowerCase()}_${now.getTime()}`,
        cityName: cityName.toLowerCase(),
        overview,
        events,
        quickLinks,
        lastUpdated: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      };
    } catch (error) {
      console.error("Error fetching city data:", error);
      return this.getFallbackCityData(cityName);
    }
  }

  private async fetchCityOverview(cityName: string): Promise<CityOverview> {
    try {
      // Try to get basic info from a free API or use AI to generate
      if (this.OPENAI_API_KEY) {
        return await this.generateCityOverviewWithAI(cityName);
      } else {
        return this.getFallbackCityOverview(cityName);
      }
    } catch (error) {
      console.error("Error fetching city overview:", error);
      return this.getFallbackCityOverview(cityName);
    }
  }

  private async generateCityOverviewWithAI(
    cityName: string,
  ): Promise<CityOverview> {
    try {
      const prompt = `
        Provide a brief overview of ${cityName} for job seekers. Include:
        - Population (approximate)
        - 3-4 key cultural/social highlights
        - Brief description (2-3 sentences)
        - Coordinates (lat, lng)

        Format as JSON:
        {
          "name": "${cityName}",
          "country": "Country name",
          "population": number,
          "highlights": ["highlight1", "highlight2", "highlight3"],
          "description": "Brief description",
          "coordinates": {"lat": number, "lng": number}
        }
      `;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a travel and city information expert. Provide accurate, concise information about cities.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.3,
            max_tokens: 500,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("OpenAI API request failed");
      }

      const result = await response.json();
      const cityInfo = JSON.parse(result.choices[0].message.content);

      return cityInfo;
    } catch (error) {
      console.warn("AI city overview generation failed:", error);
      return this.getFallbackCityOverview(cityName);
    }
  }

  private getFallbackCityOverview(cityName: string): CityOverview {
    // Predefined data for major Swiss cities
    const cityData: Record<string, CityOverview> = {
      zurich: {
        name: "Zurich",
        country: "Switzerland",
        population: 434000,
        highlights: [
          "Global financial center",
          "ETH Zurich university",
          "Lake Zurich recreation",
          "Vibrant tech scene",
        ],
        description:
          "Switzerland's largest city and economic powerhouse, Zurich combines world-class business opportunities with exceptional quality of life.",
        coordinates: { lat: 47.3769, lng: 8.5417 },
      },
      geneva: {
        name: "Geneva",
        country: "Switzerland",
        population: 201000,
        highlights: [
          "International organizations hub",
          "UN headquarters",
          "Lake Geneva beauty",
          "Luxury watch industry",
        ],
        description:
          "An international city hosting numerous global organizations, Geneva offers a cosmopolitan lifestyle with stunning Alpine views.",
        coordinates: { lat: 46.2044, lng: 6.1432 },
      },
      basel: {
        name: "Basel",
        country: "Switzerland",
        population: 177000,
        highlights: [
          "Pharmaceutical industry leader",
          "Art Basel fair",
          "Rhine River culture",
          "Chemical research hub",
        ],
        description:
          "A cultural and pharmaceutical powerhouse on the Rhine, Basel blends innovation with rich artistic heritage.",
        coordinates: { lat: 47.5596, lng: 7.5886 },
      },
      bern: {
        name: "Bern",
        country: "Switzerland",
        population: 144000,
        highlights: [
          "Swiss capital",
          "UNESCO World Heritage",
          "Government seat",
          "Medieval old town",
        ],
        description:
          "Switzerland's charming capital city, featuring a UNESCO-listed medieval old town and serving as the political center.",
        coordinates: { lat: 46.9481, lng: 7.4474 },
      },
      lausanne: {
        name: "Lausanne",
        country: "Switzerland",
        population: 140000,
        highlights: [
          "Olympic capital",
          "Lake Geneva shores",
          "University town",
          "Wine region nearby",
        ],
        description:
          "The Olympic capital situated on Lake Geneva, Lausanne combines academic excellence with sports heritage and scenic beauty.",
        coordinates: { lat: 46.5197, lng: 6.6323 },
      },
    };

    return (
      cityData[cityName.toLowerCase()] || {
        name: cityName,
        country: "Switzerland",
        population: 50000,
        highlights: [
          "Scenic Swiss location",
          "Quality of life",
          "Business opportunities",
          "Cultural attractions",
        ],
        description: `${cityName} offers the perfect blend of Swiss quality of life, business opportunities, and natural beauty.`,
        coordinates: { lat: 46.8182, lng: 8.2275 },
      }
    );
  }

  private async fetchCityEvents(cityName: string): Promise<CityEvent[]> {
    try {
      // In a real implementation, you would integrate with event APIs
      // For now, we'll generate realistic mock events
      return this.generateMockEvents(cityName);
    } catch (error) {
      console.error("Error fetching city events:", error);
      return this.generateMockEvents(cityName);
    }
  }

  private generateMockEvents(cityName: string): CityEvent[] {
    const now = new Date();
    const events: CityEvent[] = [];

    // Generate realistic events based on the city
    const eventTemplates = [
      {
        title: `${cityName} Tech Conference 2024`,
        category: "business" as const,
        description:
          "Annual technology conference featuring industry leaders and innovation showcases",
        venue: `${cityName} Convention Center`,
      },
      {
        title: `${cityName} Music Festival`,
        category: "music" as const,
        description:
          "Three-day outdoor music festival featuring local and international artists",
        venue: `${cityName} Park`,
      },
      {
        title: "Art Basel Switzerland",
        category: "arts" as const,
        description:
          "Premier international art fair showcasing contemporary and modern art",
        venue: "Messe Basel",
      },
      {
        title: `${cityName} Marathon`,
        category: "sports" as const,
        description:
          "Annual international marathon through the city's most scenic routes",
        venue: "City Center",
      },
      {
        title: "Swiss National Day Celebration",
        category: "cultural" as const,
        description:
          "Traditional Swiss national day festivities with fireworks and local culture",
        venue: "City Square",
      },
    ];

    // Add 4-5 events with future dates
    for (let i = 0; i < Math.min(5, eventTemplates.length); i++) {
      const template = eventTemplates[i];
      const eventDate = new Date(
        now.getTime() + (i + 1) * 7 * 24 * 60 * 60 * 1000,
      ); // 1-5 weeks from now

      events.push({
        id: `${cityName.toLowerCase()}_event_${i + 1}`,
        title: template.title,
        date: eventDate.toISOString(),
        description: template.description,
        venue: template.venue,
        category: template.category,
        url: `https://example.com/events/${cityName.toLowerCase()}-${template.category}`,
      });
    }

    return events;
  }

  private generateQuickLinks(cityName: string): {
    tourism: string;
    events: string;
    official: string;
  } {
    const cityLower = cityName.toLowerCase();

    return {
      tourism: `https://www.${cityLower}tourism.com`,
      events: `https://www.eventbrite.com/d/switzerland--${cityLower}/events/`,
      official: `https://www.${cityLower}.ch`,
    };
  }

  private async cacheCityData(cityData: CityEventsData): Promise<void> {
    try {
      const { error } = await supabase.from("city_events").upsert({
        city_name: cityData.cityName,
        overview: cityData.overview,
        events: cityData.events,
        quick_links: cityData.quickLinks,
        last_updated: cityData.lastUpdated,
        expires_at: cityData.expiresAt,
      });

      if (error) {
        console.warn("Failed to cache city data to database:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        // Don't throw error - caching failure shouldn't break the feature
      }
    } catch (error) {
      console.warn("Error caching city data (non-critical):", {
        error: error instanceof Error ? error.message : "Unknown error",
        cityName: cityData.cityName,
      });
      // Gracefully handle caching failures - the feature should still work without caching
    }
  }

  private getFallbackCityData(cityName: string): CityEventsData {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.CACHE_DURATION);

    return {
      id: `${cityName.toLowerCase()}_fallback_${now.getTime()}`,
      cityName: cityName.toLowerCase(),
      overview: this.getFallbackCityOverview(cityName),
      events: this.generateMockEvents(cityName),
      quickLinks: this.generateQuickLinks(cityName),
      lastUpdated: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
  }

  private transformDatabaseRecord(record: any): CityEventsData {
    return {
      id: `${record.city_name}_${record.last_updated}`,
      cityName: record.city_name,
      overview: record.overview,
      events: record.events,
      quickLinks: record.quick_links,
      lastUpdated: record.last_updated,
      expiresAt: record.expires_at,
    };
  }
}

export const cityEventsService = new CityEventsService();
