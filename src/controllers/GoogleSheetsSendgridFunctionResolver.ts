import { SendgridApi } from '../_gateways/SendgridApi';
import type { HttpClient } from '../_gateways/_driver/HttpClient';

import { GoogleSheetsEntrance } from './_entrance/GoogleSheetsEntrance';
import { GoogleSheetsExit } from './_exit/GoogleSheetsExit';

export namespace GoogleSheetsSendgridFunctionResolver {
  export async function categoryStats(
    { sendgridApiKey, httpClient }: CategoryStatsDeps,
    [category, startDate, endDate, aggregatedBy = 'day']: CategoryStatsArgs
  ): Promise<GoogleSheetsExit.MatrixRange> {
    if (
      typeof category !== 'string' ||
      typeof startDate !== 'string' ||
      typeof endDate !== 'string' ||
      typeof aggregatedBy !== 'string'
    ) {
      throw new Error('input type error');
    }

    if (
      aggregatedBy !== 'day' &&
      aggregatedBy !== 'week' &&
      aggregatedBy !== 'month'
    ) {
      throw new Error('invalid aggregatedBy');
    }

    const deps = { apiKey: sendgridApiKey, httpClient };

    const data = await SendgridApi.retrieveCategoryStats(deps, {
      startDate: GoogleSheetsEntrance.toISO8601DateString(startDate),
      endDate: GoogleSheetsEntrance.toISO8601DateString(endDate),
      categories: [category],
      aggregatedBy,
    });

    const metricsNames: (keyof SendgridApi.StatsMetrics)[] = [
      'requests',
      'invalid_emails',
      'deferred',
      'processed',
      'delivered',
      'blocks',
      'bounces',
      'bounce_drops',
      'clicks',
      'unique_clicks',
      'opens',
      'unique_opens',
      'spam_reports',
      'spam_report_drops',
      'unsubscribes',
      'unsubscribe_drops',
    ];

    const schema: GoogleSheetsExit.ToMatrixRangeSchema<
      SendgridApi.RetrieveCategoryStatsOutput[number]
    > = [
      aggregatedBy === 'day'
        ? { columnName: 'day', valueAccessor: (obj) => (obj as SendgridApi.CategoriesStatsDaily).date }
        : aggregatedBy === 'week'
        ? { columnName: 'week', valueAccessor: (obj) => (obj as SendgridApi.CategoriesStatsWeekly).week }
        : { columnName: 'month', valueAccessor: (obj) => (obj as SendgridApi.CategoriesStatsMonthly).month },
      ...metricsNames.map((n) => ({
        columnName: n,
        valueAccessor: (obj: SendgridApi.RetrieveCategoryStatsOutput[number]) =>
          obj.stats[0].metrics[n],
      })),
    ];

    return GoogleSheetsExit.toMatrixRange<SendgridApi.RetrieveCategoryStatsOutput[number]>(
      data,
      schema
    );
  }

  export type CategoryStatsDeps = {
    sendgridApiKey: string;
    httpClient: HttpClient;
  };

  export type CategoryStatsArgs = [
    category: string,
    startDate: string,
    endDate: string,
    aggregatedBy?: string
  ];
}
