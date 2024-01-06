import { HttpRequestQueryParams } from '../../_gateways/_driver/HttpClient';

const util = {
  makeQueryString: (obj: HttpRequestQueryParams): string => {
    return Object.keys(obj)
      .filter((key) => !!obj[key])
      .map((key) => {
        const value = obj[key]!;
        if (typeof value === 'string') {
          return `${key}=${encodeURIComponent(value)}`;
        } else if (typeof Array.isArray(value)) {
          return value.map((v) => `${key}=${encodeURIComponent(v)}`).join('&');
        } else {
          throw new Error('unexpected data type');
        }
      })
      .join('&');
  },
};

export default util;
