import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DEFAULT_SITE_DATA } from "@/lib/defaultSiteData";
import type { SiteDataResponse } from "@/types/content";

let cache: SiteDataResponse | null = null;
let inflight: Promise<SiteDataResponse> | null = null;

async function fetchSiteData(): Promise<SiteDataResponse> {
  if (!inflight) {
    inflight = api
      .get<SiteDataResponse>("/api/site-data")
      .then((data) => {
        cache = data;
        return data;
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
