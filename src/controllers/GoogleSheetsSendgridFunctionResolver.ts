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
    startDate: string,
    endDate?: string,
    aggregatedBy?: string
  ];

  export async function categoryStats(
    { sendgridApiKey, httpClient }: Dependencies,
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
    startDate: string,
    endDate?: string,
    aggregatedBy?: string
  ];

  export async function globalStats(
    { sendgridApiKey, httpClient }: Dependencies,
    [startDate, endDate, aggregatedBy = 'day']: GlobalStatsArgs
  ): Promise<GoogleSheetsExit.MatrixRange> {
    if (
      typeof startDate !== 'string' ||
      typeof endDate !== 'string' ||
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
    'clicks',
    'unique_clicks',
    'opens',
    'unique_opens',
    'spam_reports',
    'spam_report_drops',
    'unsubscribes',
    'unsubscribe_drops',
  ];

  const createStatsSchema = (
    statsAggregationUnit: SendgridApi.StatsAggregationUnit
  ): GoogleSheetsExit.ToMatrixRangeSchema<SendgridApi.StatsOnDate> => [
    { columnName: statsAggregationUnit, valueAccessor: (obj) => obj.date, convertTo: 'date' },
    ...metricsColumnNames.map((columnName) => ({
      columnName,
      valueAccessor: (obj: SendgridApi.StatsOnDate) =>
        obj.stats[0].metrics[columnName],
    })),
  ];
}
