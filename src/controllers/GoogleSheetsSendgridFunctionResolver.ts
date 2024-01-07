import { SendgridApi } from '../_gateways/SendgridApi';
import type { HttpClient } from '../_gateways/_driver/HttpClient';

import { GoogleSheetsEntrance } from './_entrance/GoogleSheetsEntrance';
import { GoogleSheetsExit } from './_exit/GoogleSheetsExit';

export namespace GoogleSheetsSendgridFunctionResolver {
  export type Dependencies = {
    sendgridApiKey: string;
    httpClient: HttpClient;
  };

  export type CategoryStatsArgs = [
    category: string,
    startDate: string | Date,
    endDate?: string | Date,
    aggregatedBy?: string
  ];

  export async function categoryStats(
    { sendgridApiKey, httpClient }: Dependencies,
    [category, startDate, endDate, aggregatedBy = 'day']: CategoryStatsArgs
  ): Promise<GoogleSheetsExit.MatrixRange> {
    if (
      typeof category !== 'string' ||
      (typeof startDate !== 'string' && !(startDate instanceof Date)) ||
      (typeof endDate !== 'string' && !(endDate instanceof Date)) ||
      typeof aggregatedBy !== 'string'
    ) {
      throw new Error('input type error');
    }

    SendgridApi.assertStatsAggregationUnit(aggregatedBy);

    const deps = { apiKey: sendgridApiKey, httpClient };

    const data = await SendgridApi.retrieveCategoryStats(deps, {
      startDate: GoogleSheetsEntrance.toISO8601DateString(startDate),
      endDate: GoogleSheetsEntrance.toISO8601DateString(endDate),
      categories: [category],
      aggregatedBy,
    });

    return GoogleSheetsExit.toMatrixRange<SendgridApi.StatsOnDate>(
      data,
      createStatsSchema(aggregatedBy)
    );
  }

  export type GlobalStatsArgs = [
    startDate: string | Date,
    endDate?: string | Date,
    aggregatedBy?: string
  ];

  export async function globalStats(
    { sendgridApiKey, httpClient }: Dependencies,
    [startDate, endDate, aggregatedBy = 'day']: GlobalStatsArgs
  ): Promise<GoogleSheetsExit.MatrixRange> {
    if (
      (typeof startDate !== 'string' && !(startDate instanceof Date)) ||
      (typeof endDate !== 'string' && !(endDate instanceof Date)) ||
      typeof aggregatedBy !== 'string'
    ) {
      throw new Error('input type error');
    }

    SendgridApi.assertStatsAggregationUnit(aggregatedBy);

    const deps = { apiKey: sendgridApiKey, httpClient };

    const data = await SendgridApi.retrieveGlobalStats(deps, {
      startDate: GoogleSheetsEntrance.toISO8601DateString(startDate),
      endDate: GoogleSheetsEntrance.toISO8601DateString(endDate),
      aggregatedBy,
    });

    return GoogleSheetsExit.toMatrixRange<SendgridApi.StatsOnDate>(
      data,
      createStatsSchema(aggregatedBy)
    );
  }

  const metricsColumnNames: (keyof SendgridApi.StatsMetrics)[] = [
    'requests',
    'invalid_emails',
    'deferred',
    'processed',
    'delivered',
    'blocks',
    'bounces',
    'bounce_drops',
    'opens',
    'unique_opens',
    'clicks',
    'unique_clicks',
    'spam_reports',
    'spam_report_drops',
    'unsubscribes',
    'unsubscribe_drops',
  ];

  const createStatsSchema = (
    statsAggregationUnit: SendgridApi.StatsAggregationUnit
  ): GoogleSheetsExit.ToMatrixRangeSchema<SendgridApi.StatsOnDate> => [
    {
      columnName: statsAggregationUnit,
      getValue: (obj) => GoogleSheetsExit.toDateCellValue(obj.date),
    },
    ...metricsColumnNames.map((columnName) => ({
      columnName,
      getValue: (obj: SendgridApi.StatsOnDate) =>
        obj.stats[0].metrics[columnName],
    })),
  ];
}
