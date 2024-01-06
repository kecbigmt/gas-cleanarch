import type { ISO8601DateString } from '../_application/_domain/_model/_entities/valueObjects';

import type { HttpClient, HttpRequestHeader } from './_driver/HttpClient';

export namespace SendgridApi {
  export type Dependencies = {
    apiKey: string;
    httpClient: HttpClient;
  };

  export type statsAggregationUnit = 'day' | 'week' | 'month';
  export function assertStatsAggregationUnit(unit: string): asserts unit is statsAggregationUnit {
    if (unit !== 'day' && unit !== 'week' && unit !== 'month') {
      throw new Error('invalid aggregation unit: ' + unit);
    }
  }

  export type RetrieveCategoryStatsInput = {
    categories: string[];
    startDate: ISO8601DateString;
    endDate?: ISO8601DateString;
    aggregatedBy?: statsAggregationUnit;
  };

  export async function retrieveCategoryStats(
    { apiKey, httpClient }: Dependencies,
    { startDate, endDate, categories, aggregatedBy }: RetrieveCategoryStatsInput
  ): Promise<CategoriesStatsOnDate[]> {
    const queryParams = {
      start_date: startDate,
      end_date: endDate,
      categories: categories,
      aggregated_by: aggregatedBy,
    };
    const headers = constructHeader(apiKey);

    return httpClient
      .get('https://api.sendgrid.com/v3/categories/stats', queryParams, headers)
      .then((r) => r.json<CategoriesStatsOnDate[]>());
  }

  export type RetrieveGlobalStatsInput = {
    startDate: ISO8601DateString;
    endDate?: ISO8601DateString;
    aggregatedBy?: statsAggregationUnit;
  };

  export async function retrieveGlobalStats(
    { apiKey, httpClient }: Dependencies,
    { startDate, endDate, aggregatedBy }: RetrieveGlobalStatsInput
  ): Promise<StatsOnDate[]> {
    const queryParams = {
      start_date: startDate,
      end_date: endDate,
      aggregated_by: aggregatedBy,
    };
    const headers = constructHeader(apiKey);

    return httpClient
      .get('https://api.sendgrid.com/v3/stats', queryParams, headers)
      .then((r) => r.json<StatsOnDate[]>());
  }

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

  export type Stats = {
    metrics: StatsMetrics;
  };

  export type CategoryStats = Stats & {
    type: 'category';
    name: string;
  };

  export type StatsOnDate = {
    date: string;
    stats: Stats[];
  }

  export type CategoriesStatsOnDate = StatsOnDate & {
    stats: CategoryStats[];
  };

  const constructHeader = (apiKey: string): HttpRequestHeader => ({
    Authorization: 'Bearer ' + apiKey,
  });
}
