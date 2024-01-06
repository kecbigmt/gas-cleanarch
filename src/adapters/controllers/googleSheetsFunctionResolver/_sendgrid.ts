import sendgridRepository, {
  type RetrieveCategoryStatsOutput,
  type SendgridStatsMetrics,
} from '@/adapters/gateway/sendgridRepository';
import type { HttpClient } from '@/adapters/gateway/httpClient';

import googleSheetsEntrance from './_entrance';
import googleSheetsExit, { ToMatrixRangeSchema, type MatrixRange } from './_exit';

const googleSheetsFunctionResolverSendgrid = {
  categoryStats: async (
    { sendgridApiKey, httpClient }: SendgridCategoryStatsDeps,
    [
      category,
      startDate,
      endDate,
      aggregatedBy = 'day',
    ]: SendgridCategoryStatsArgs
  ): Promise<MatrixRange> => {
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

    const data = await sendgridRepository.stats.categories(deps, {
      startDate: googleSheetsEntrance.toISO8601DateString(startDate),
      endDate: googleSheetsEntrance.toISO8601DateString(endDate),
      categories: [category],
      aggregatedBy,
    });

    const metricsNames: (keyof SendgridStatsMetrics)[] = [
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

    const schema: ToMatrixRangeSchema<RetrieveCategoryStatsOutput[number]> = [
      aggregatedBy === 'day'
      // @ts-ignore
        ? { columnName: 'day', valueAccessor: (obj) => obj['date'] }
        : aggregatedBy === 'week'
      // @ts-ignore
        ? { columnName: 'week', valueAccessor: (obj) => obj['week'] }
      // @ts-ignore
        : { columnName: 'month', valueAccessor: (obj) => obj['month'] },
      ...metricsNames.map((n) => ({
        columnName: n,
        valueAccessor: (obj: RetrieveCategoryStatsOutput[number]) =>
          obj.stats[0].metrics[n],
      })),
    ];

    return googleSheetsExit.toMatrixRange<RetrieveCategoryStatsOutput[number]>(
      data,
      schema
    );
  },
};

export default googleSheetsFunctionResolverSendgrid;

export type SendgridCategoryStatsDeps = {
  sendgridApiKey: string;
  httpClient: HttpClient;
};

export type SendgridCategoryStatsArgs = [
  category: string,
  startDate: string,
  endDate: string,
  aggregatedBy?: string
];
