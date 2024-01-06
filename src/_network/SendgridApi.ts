import type { ISO8601DateString } from '../_application/_domain/_model/_entities/valueObjects';

import type { HttpClient } from './_modules/httpClient';

export namespace SendgridApi {
  export type Dependencies = {
    apiKey: string;
    httpClient: HttpClient;
  };

  export async function retrieveCategoryStats (
    { apiKey, httpClient }: Dependencies,
    { startDate, endDate, categories, aggregatedBy }: RetrieveCategoryStatsInput
  ): Promise<RetrieveCategoryStatsOutput> {
    const queryParams = {
      start_date: startDate,
      end_date: endDate,
      categories: categories,
      aggregated_by: aggregatedBy,
    };
    const headers = {
      Authorization: 'Bearer ' + apiKey,
    };
  
    return httpClient
      .get('https://api.sendgrid.com/v3/categories/stats', queryParams, headers)
      .then((r) => r.json<RetrieveCategoryStatsOutput>());
  };

  export type RetrieveCategoryStatsInput = {
    startDate: ISO8601DateString;
    endDate: ISO8601DateString;
    categories: string[];
    aggregatedBy?: 'day' | 'week' | 'month';
  };


  export type StatsMetrics = {
    blocks: number;
    bounce_drops: number;
    bounces: number;
    clicks: number;
    deferred: number;
    delivered: number;
    invalid_emails: number;
    opens: number;
    processed: number;
    requests: number;
    spam_report_drops: number;
    spam_reports: number;
    unique_clicks: number;
    unique_opens: number;
    unsubscribe_drops: number;
    unsubscribes: number;
  };
  
  export type CategoryStats = {
    type: 'category';
    name: string;
    metrics: StatsMetrics;
  };
  
  export type RetrieveCategoryStatsOutput = (
    | {
        date: string;
        stats: StatsMetrics;
      }
    | {
        week: string;
        stats: StatsMetrics;
      }
    | {
        month: string;
        stats: StatsMetrics;
      }
  )[];
};
