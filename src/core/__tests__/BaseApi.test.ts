import BaseApi from '../BaseApi';
import axios from 'axios';

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
    expect(mockedAxios.request).toHaveBeenCalledWith({
      method: 'get',
      url: 'https://api.example.com/users',
      data: undefined,
      headers: {},
      httpsAgent: undefined
    });
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

  it('should throw on server error', async () => {
    const api = new BaseApi();
    mockedAxios.request.mockResolvedValue({ status: 500, data: { error: 'Server error' }, headers: {} });

    await expect(api.get('https://api.example.com/users')).rejects.toThrow();
  });
});
