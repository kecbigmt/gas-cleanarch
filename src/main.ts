import { GoogleSheetsSendgridFunctionResolver } from './controllers/GoogleSheetsSendgridFunctionResolver';

import { Http } from './infra/http';

const scriptProperties = PropertiesService.getScriptProperties();

async function SENDGRID_CATEGORY_STATS(...args: GoogleSheetsSendgridFunctionResolver.CategoryStatsArgs) {
  const sendgridApiKey = scriptProperties.getProperty('SENDGRID_API_KEY');
  if (sendgridApiKey == null) throw new Error('SENDGRID_API_KEY is not set');

  return GoogleSheetsSendgridFunctionResolver.categoryStats(
    {
      sendgridApiKey,
      httpClient: Http.httpClient,
    },
    args
  );
}
