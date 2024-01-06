import { HttpClient } from '@/_network/_modules/httpClient';
import util from './_util';

export namespace Http {
  export const httpClient: HttpClient = {
    get: async (
      url: string,
      queryParams: { [key: string]: string | string[] } = {},
      headers: { [key: string]: string } = {}
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
