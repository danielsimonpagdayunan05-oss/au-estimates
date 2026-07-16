import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DEFAULT_SITE_DATA } from "@/lib/defaultSiteData";
import type { SiteDataResponse } from "@/types/content";

let cache: SiteDataResponse | null = null;
let inflight: Promise<SiteDataResponse> | null = null;

function sameContent(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Admin editor components resync their local draft state from these props via
 * `useEffect(() => setDraft(values), [values])`. A plain `GET /api/site-data` refetch
 * (triggered after ANY single card's save, anywhere on the page) used to hand back a
 * brand-new object/array for every key, which reset that effect — and silently wiped
 * out unsaved edits the admin was mid-typing in every OTHER card on the page. Preserving
 * the previous reference for anything whose content didn't actually change keeps those
 * effects from re-firing at all for unrelated cards.
 */
function preserveUnchangedReferences(previous: SiteDataResponse | null, next: SiteDataResponse): SiteDataResponse {
  if (!previous) return next;

  const settings = { ...next.settings };
  for (const key of Object.keys(settings) as (keyof typeof settings)[]) {
    if (key in previous.settings && sameContent(previous.settings[key], settings[key])) {
      (settings as Record<string, unknown>)[key] = previous.settings[key];
    }
  }

  return {
    settings,
    stats: sameContent(previous.stats, next.stats) ? previous.stats : next.stats,
    provinces: sameContent(previous.provinces, next.provinces) ? previous.provinces : next.provinces,
    services: sameContent(previous.services, next.services) ? previous.services : next.services,
    portfolio: sameContent(previous.portfolio, next.portfolio) ? previous.portfolio : next.portfolio,
  };
}

async function fetchSiteData(): Promise<SiteDataResponse> {
  if (!inflight) {
    inflight = api
      .get<SiteDataResponse>("/api/site-data")
      .then((data) => {
        const merged = preserveUnchangedReferences(cache, data);
        cache = merged;
        return merged;
      })
      .catch(() => DEFAULT_SITE_DATA)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useSiteData() {
  const [data, setData] = useState<SiteDataResponse>(cache ?? DEFAULT_SITE_DATA);
  const [isLoading, setIsLoading] = useState(!cache);

  useEffect(() => {
    let active = true;
    fetchSiteData().then((d) => {
      if (active) {
        setData(d);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const refetch = async () => {
    cache = null;
    const fresh = await fetchSiteData();
    setData(fresh);
    return fresh;
  };

  return { data, isLoading, refetch };
}
