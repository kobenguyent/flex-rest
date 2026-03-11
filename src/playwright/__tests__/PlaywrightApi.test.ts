import { PlaywrightApi } from '../PlaywrightApi';
import { FlexRestError } from '../../core/errors';

describe('PlaywrightApi', () => {
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      get: jest.fn().mockResolvedValue({ status: () => 200, json: () => Promise.resolve({ id: 1 }), headers: () => ({ 'content-type': 'application/json' }) }),
      post: jest.fn().mockResolvedValue({ status: () => 201, json: () => Promise.resolve({ id: 2 }), headers: () => ({ 'content-type': 'application/json' }) }),
      put: jest.fn().mockResolvedValue({ status: () => 200, json: () => Promise.resolve({ id: 1, updated: true }), headers: () => ({ 'content-type': 'application/json' }) }),
      patch: jest.fn().mockResolvedValue({ status: () => 200, json: () => Promise.resolve({ id: 1, patched: true }), headers: () => ({ 'content-type': 'application/json' }) }),
      delete: jest.fn().mockResolvedValue({ status: () => 204, json: () => Promise.resolve(null), headers: () => ({}) }),
      head: jest.fn().mockResolvedValue({ status: () => 200, headers: () => ({ 'x-total-count': '42' }) })
    };
  });

  it('should make GET request', async () => {
    const api = new PlaywrightApi(mockRequest);
    const res = await api.get('https://api.example.com/users');

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ id: 1 });
    expect(res.headers).toEqual({ 'content-type': 'application/json' });
    expect(mockRequest.get).toHaveBeenCalledWith('https://api.example.com/users', expect.any(Object));
  });

  it('should make POST request', async () => {
    const api = new PlaywrightApi(mockRequest);
    const res = await api.post('https://api.example.com/users', { name: 'John' });

    expect(res.status).toBe(201);
    expect(res.data).toEqual({ id: 2 });
    expect(mockRequest.post).toHaveBeenCalledWith('https://api.example.com/users', expect.any(Object));
  });

  it('should make PUT request', async () => {
    const api = new PlaywrightApi(mockRequest);
    const res = await api.put('https://api.example.com/users/1', { name: 'Jane' });

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ id: 1, updated: true });
    expect(mockRequest.put).toHaveBeenCalledWith('https://api.example.com/users/1', expect.any(Object));
  });

  it('should make PATCH request', async () => {
    const api = new PlaywrightApi(mockRequest);
    const res = await api.patch('https://api.example.com/users/1', { name: 'Jane' });

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ id: 1, patched: true });
    expect(mockRequest.patch).toHaveBeenCalledWith('https://api.example.com/users/1', expect.any(Object));
  });

  it('should make DELETE request', async () => {
    const api = new PlaywrightApi(mockRequest);
    const res = await api.delete('https://api.example.com/users/1');

    expect(res.status).toBe(204);
    expect(mockRequest.delete).toHaveBeenCalledWith('https://api.example.com/users/1', expect.any(Object));
  });

  it('should make HEAD request', async () => {
    const api = new PlaywrightApi(mockRequest);
    const res = await api.head('https://api.example.com/users');

    expect(res.status).toBe(200);
    expect(res.headers).toEqual({ 'x-total-count': '42' });
    expect(mockRequest.head).toHaveBeenCalledWith('https://api.example.com/users', expect.any(Object));
  });

  it('should include token in headers', async () => {
    const api = new PlaywrightApi(mockRequest, 'test-token');
    await api.get('https://api.example.com/users');

    expect(mockRequest.get).toHaveBeenCalledWith(
      'https://api.example.com/users',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' })
      })
    );
  });

  it('should handle non-JSON responses gracefully', async () => {
    mockRequest.get.mockResolvedValue({
      status: () => 204,
      json: () => { throw new Error('No body') },
      headers: () => ({})
    });

    const api = new PlaywrightApi(mockRequest);
    const res = await api.get('https://api.example.com/empty');

    expect(res.status).toBe(204);
    expect(res.data).toBeNull();
  });

  it('should throw FlexRestError on server error', async () => {
    mockRequest.get.mockResolvedValue({
      status: () => 500,
      json: () => Promise.resolve({ error: 'down' }),
      headers: () => ({})
    });

    const api = new PlaywrightApi(mockRequest);
    await expect(api.get('https://api.example.com/fail')).rejects.toThrow(FlexRestError);
  });
});
