import googleSheetsFunctionResolver, {
  type SendgridCategoryStatsArgs,
} from './adapters/controllers/googleSheetsFunctionResolver';

import infra from './infra';

const scriptProperties = PropertiesService.getScriptProperties();
const sendgridApiKey = scriptProperties.getProperty('SENDGRID_API_KEY');

async function SENDGRID_CATEGORY_STATS(...args: SendgridCategoryStatsArgs) {
  return googleSheetsFunctionResolver.sendgrid.categoryStats(
    {
      sendgridApiKey,
      httpClient: infra.httpClient,
    },
    args
  );
}