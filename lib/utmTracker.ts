export interface UtmParameters {
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_medium?: string;
  utm_term?: string;
}

export function parseUtmsFromUrl(searchParams: URLSearchParams): UtmParameters {
  return {
    utm_source: searchParams.get('utm_source') || 'facebook',
    utm_campaign: searchParams.get('utm_campaign') || 'cbo_escala',
    utm_content: searchParams.get('utm_content') || 'criativo_video_1',
    utm_medium: searchParams.get('utm_medium') || 'cpc',
    utm_term: searchParams.get('utm_term') || undefined,
  };
}
