export type HttpRequestQueryParams = { [key: string]: string | string[] | undefined };

export type HttpRequestHeader = { [key: string]: string };

export type HttpClient = {
  get: (
    url: string,
    queryParams?: HttpRequestQueryParams,
    headers?: HttpRequestHeader
  ) => Promise<{
    status: number;
    text: () => Promise<string>;
    json: <T = object>() => Promise<T>;
  }>;
};
