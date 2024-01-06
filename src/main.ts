import { GoogleSheetsSendgridFunctionResolver } from './controllers/GoogleSheetsSendgridFunctionResolver';

import { Http } from './infra/http';

const scriptProperties = PropertiesService.getScriptProperties();
const sendgridApiKey = scriptProperties.getProperty('SENDGRID_API_KEY');

async function SENDGRID_CATEGORY_STATS(...args: GoogleSheetsSendgridFunctionResolver.CategoryStatsArgs) {
  return GoogleSheetsSendgridFunctionResolver.categoryStats(
    {
      sendgridApiKey,
      httpClient: Http.httpClient,
    },
    args
  );
}
