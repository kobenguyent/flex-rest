import BaseApi from '../BaseApi';
import axios from 'axios';
import { FlexRestError } from '../errors';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BaseApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make GET request', async () => {
    const api = new BaseApi();
    mockedAxios.request.mockResolvedValue({ status: 200, data: { id: 1 }, headers: {} });

    const res = await api.get('https://api.example.com/users');

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ id: 1 });
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: 'https://api.example.com/users',
        data: undefined,
        headers: {},
        httpsAgent: undefined,
        timeout: undefined
      })
    );
  });

  it('should include token in headers', async () => {
    const api = new BaseApi({ token: 'test-token' });
    mockedAxios.request.mockResolvedValue({ status: 200, data: {}, headers: {} });

    await api.get('https://api.example.com/users');

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: { Authorization: 'Bearer test-token' }
      })
    );
  });

  it('should make POST request with payload', async () => {
    const api = new BaseApi();
    mockedAxios.request.mockResolvedValue({ status: 201, data: { id: 2 }, headers: {} });

    const res = await api.post('https://api.example.com/users', { name: 'John' });

    expect(res.status).toBe(201);
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        data: { name: 'John' }
      })
    );
  });

  it('should make PUT request', async () => {
    const api = new BaseApi();
    mockedAxios.request.mockResolvedValue({ status: 200, data: { id: 1 }, headers: {} });

    await api.put('https://api.example.com/users/1', { name: 'Jane' });

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'put',
        data: { name: 'Jane' }
      })
    );
  });

  it('should make PATCH request', async () => {
    const api = new BaseApi();
    mockedAxios.request.mockResolvedValue({ status: 200, data: { id: 1, name: 'Jane' }, headers: {} });

    const res = await api.patch('https://api.example.com/users/1', { name: 'Jane' });

    expect(res.status).toBe(200);
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'patch',
        data: { name: 'Jane' }
      })
    );
  });

  it('should make DELETE request', async () => {
    const api = new BaseApi();
    mockedAxios.request.mockResolvedValue({ status: 204, data: null, headers: {} });

    await api.delete('https://api.example.com/users/1');

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'delete',
        data: undefined
      })
    );
  });

  it('should make HEAD request', async () => {
    const api = new BaseApi();
    mockedAxios.request.mockResolvedValue({ status: 200, data: null, headers: {} });

    await api.head('https://api.example.com/users');

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'head',
        data: undefined
      })
    );
  });

  it('should merge custom headers', async () => {
    const api = new BaseApi({ token: 'test-token' });
    mockedAxios.request.mockResolvedValue({ status: 200, data: {}, headers: {} });

    await api.get('https://api.example.com/users', { 'X-Custom': 'value' });

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: { Authorization: 'Bearer test-token', 'X-Custom': 'value' }
      })
    );
  });

  it('should configure insecure SSL', () => {
    const api = new BaseApi({ allowInsecureSSL: true });
    expect(api['httpsAgent']).toBeDefined();
  });

  it('should throw FlexRestError on server error', async () => {
    const api = new BaseApi();
    mockedAxios.request.mockResolvedValue({ status: 500, data: { error: 'Server error' }, headers: {} });

    await expect(api.get('https://api.example.com/users')).rejects.toThrow(FlexRestError);
  });

  // baseUrl tests
  it('should prepend baseUrl to relative paths', async () => {
    const api = new BaseApi({ baseUrl: 'https://api.example.com' });
    mockedAxios.request.mockResolvedValue({ status: 200, data: {}, headers: {} });

    await api.get('/users');

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://api.example.com/users'
      })
    );
  });

  it('should not prepend baseUrl to absolute URLs', async () => {
    const api = new BaseApi({ baseUrl: 'https://api.example.com' });
    mockedAxios.request.mockResolvedValue({ status: 200, data: {}, headers: {} });

    await api.get('https://other.api.com/data');

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://other.api.com/data'
      })
    );
  });

  // timeout test
  it('should pass timeout to axios', async () => {
    const api = new BaseApi({ timeout: 5000 });
    mockedAxios.request.mockResolvedValue({ status: 200, data: {}, headers: {} });

    await api.get('https://api.example.com/users');

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 5000
      })
    );
  });

  // retry tests
  it('should retry on failure', async () => {
    const api = new BaseApi({ retry: { count: 2, delay: 10 } });
    mockedAxios.request
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue({ status: 200, data: { ok: true }, headers: {} });

    const res = await api.get('https://api.example.com/users');

    expect(res.status).toBe(200);
    expect(mockedAxios.request).toHaveBeenCalledTimes(3);
  });

  it('should throw after all retries exhausted', async () => {
    const api = new BaseApi({ retry: { count: 1, delay: 10 } });
    mockedAxios.request.mockRejectedValue(new Error('Network error'));

    await expect(api.get('https://api.example.com/users')).rejects.toThrow('Network error');
    expect(mockedAxios.request).toHaveBeenCalledTimes(2);
  });

  // hooks tests
  it('should call onRequest hook', async () => {
    const onRequest = jest.fn();
    const api = new BaseApi({ onRequest });
    mockedAxios.request.mockResolvedValue({ status: 200, data: {}, headers: {} });

    await api.get('https://api.example.com/users');

    expect(onRequest).toHaveBeenCalledWith(
      'GetRequest',
      'https://api.example.com/users',
      {},
      undefined
    );
  });

  it('should call onResponse hook', async () => {
    const onResponse = jest.fn();
    const api = new BaseApi({ onResponse });
    mockedAxios.request.mockResolvedValue({ status: 200, data: { id: 1 }, headers: {} });

    await api.get('https://api.example.com/users');

    expect(onResponse).toHaveBeenCalledWith(
      'GetRequest',
      'https://api.example.com/users',
      expect.objectContaining({ status: 200, data: { id: 1 } })
    );
  });
});
