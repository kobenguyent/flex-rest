import { PlaywrightApi } from '../PlaywrightApi';

describe('PlaywrightApi', () => {
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      get: jest.fn().mockResolvedValue({ status: () => 200, json: () => Promise.resolve({ id: 1 }), headers: () => ({}) }),
      post: jest.fn().mockResolvedValue({ status: () => 201, json: () => Promise.resolve({ id: 2 }), headers: () => ({}) }),
      put: jest.fn().mockResolvedValue({ status: () => 200, json: () => Promise.resolve({ id: 1 }), headers: () => ({}) }),
      delete: jest.fn().mockResolvedValue({ status: () => 204, json: () => Promise.resolve(null), headers: () => ({}) }),
      head: jest.fn().mockResolvedValue({ status: () => 200, headers: () => ({}) })
    };
  });

  it('should make GET request', async () => {
    const api = new PlaywrightApi(mockRequest);
    const res = await api.get('https://api.example.com/users');

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ id: 1 });
    expect(mockRequest.get).toHaveBeenCalledWith('https://api.example.com/users', expect.any(Object));
  });

  it('should make POST request', async () => {
    const api = new PlaywrightApi(mockRequest);
    await api.post('https://api.example.com/users', { name: 'John' });

    expect(mockRequest.post).toHaveBeenCalledWith('https://api.example.com/users', expect.any(Object));
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
});
