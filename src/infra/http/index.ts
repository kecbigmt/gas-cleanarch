import type { HttpClient, HttpRequestHeader, HttpRequestQueryParams } from '../../_gateways/_driver/HttpClient';

import util from './_util';

export namespace Http {
  export const httpClient: HttpClient = {
    get: async (
      url: string,
      queryParams: HttpRequestQueryParams = {},
      headers: HttpRequestHeader = {}
    ) => {
      const queryString = util.makeQueryString(queryParams);
      const response = UrlFetchApp.fetch(url + '?' + queryString, { headers });
      return {
        status: response.getResponseCode(),
        text: async () => response.getContentText(),
        json: async () => JSON.parse(response.getContentText()),
      };
    },
  };
}
