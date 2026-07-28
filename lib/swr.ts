export const fetcher = <T>(url: string): Promise<T> => fetch(url).then(res => res.json() as Promise<T>);

export const UNREAD_KEY = '/api/notifications/unread';
