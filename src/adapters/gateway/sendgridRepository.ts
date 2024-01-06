import type { ISO8601DateString } from '@/domain';

import type { HttpClient } from './httpClient';

export type SendgridDeps = {
  apiKey: string;
  httpClient: HttpClient;
};

export type SendgridStatsMetrics = {
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

export type SendgridCategoryStats = {
  type: 'category';
  name: string;
  metrics: SendgridStatsMetrics;
};

export type RetrieveCategoryStatsInput = {
  startDate: ISO8601DateString;
  endDate: ISO8601DateString;
  categories: string[];
  aggregatedBy?: 'day' | 'week' | 'month';
};

export type RetrieveCategoryStatsOutput = (
  | {
      date: string;
      stats: SendgridCategoryStats;
    }
  | {
      week: string;
      stats: SendgridCategoryStats;
    }
  | {
      month: string;
      stats: SendgridCategoryStats;
    }
)[];

const retrieveCategoryStats = async (
  { apiKey, httpClient }: SendgridDeps,
  { startDate, endDate, categories, aggregatedBy }: RetrieveCategoryStatsInput
): Promise<RetrieveCategoryStatsOutput> => {
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

const sendgridRepository = {
  stats: {
    categories: retrieveCategoryStats,
  },
};

export default sendgridRepository;
