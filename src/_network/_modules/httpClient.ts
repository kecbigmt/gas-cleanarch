export type HttpClient = {
  get: (
    url: string,
    queryParams?: { [key: string]: string | string[] },
    headers?: { [key: string]: string }
  ) => Promise<{
    status: number;
    text: () => Promise<string>;
    json: <T = object>() => Promise<T>;
  }>;
};
