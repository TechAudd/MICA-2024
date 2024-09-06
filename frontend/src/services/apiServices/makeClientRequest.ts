interface RequestParams {
  [key: string]: string | number | boolean;
}

export class DataRequester {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    method: string,
    data?: any,
    params: RequestParams = {}
  ): Promise<T> {
    const url = new URL(`${this.baseURL}/${endpoint}`);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key].toString())
    );

    const options: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  public get<T>(endpoint: string, params: RequestParams = {}): Promise<T> {
    return this.request<T>(endpoint, "GET", null, params);
  }

  public post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, "POST", data);
  }

  public put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, "PUT", data);
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, "DELETE");
  }

  public patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, "PATCH", data);
  }

  public async head(endpoint: string): Promise<Headers> {
    const response = await fetch(`${this.baseURL}/${endpoint}`, {
      method: "HEAD",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.headers;
  }

  public async options(endpoint: string): Promise<Headers> {
    const response = await fetch(`${this.baseURL}/${endpoint}`, {
      method: "OPTIONS",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.headers;
  }
}
