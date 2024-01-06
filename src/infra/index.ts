import util from './_util';

const infra = {
  httpClient: {
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
  },
};

export default infra;
