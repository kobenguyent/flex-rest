import { SupertestApi } from '../SupertestApi';

describe('SupertestApi', () => {
  let mockAgent: any;
  let mockReq: any;

  beforeEach(() => {
    mockReq = {
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      then: undefined as any
    };

    // Make mockReq thenable so `await` resolves to the response
    const makeThenable = (response: any) => {
      const req = { ...mockReq };
      req.set = jest.fn().mockReturnValue(req);
      req.send = jest.fn().mockReturnValue(req);
      req.then = (resolve: any) => resolve(response);
      return req;
    };

    const okResponse = { status: 200, body: { id: 1 }, headers: { 'content-type': 'application/json' } };
    const createdResponse = { status: 201, body: { id: 2 }, headers: { 'content-type': 'application/json' } };
    const noContentResponse = { status: 204, body: null, headers: {} };
    const headResponse = { status: 200, body: {}, headers: { 'x-total-count': '42' } };

    mockAgent = {
      get: jest.fn(() => makeThenable(okResponse)),
      post: jest.fn(() => makeThenable(createdResponse)),
      put: jest.fn(() => makeThenable(okResponse)),
      delete: jest.fn(() => makeThenable(noContentResponse)),
      head: jest.fn(() => makeThenable(headResponse))
    };
  });

  it('should make GET request', async () => {
    const api = new SupertestApi(mockAgent);
    const res = await api.get('https://api.example.com/users');

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ id: 1 });
    expect(res.headers).toEqual({ 'content-type': 'application/json' });
    expect(mockAgent.get).toHaveBeenCalledWith('https://api.example.com/users');
  });

  it('should make POST request with payload', async () => {
    const api = new SupertestApi(mockAgent);
    const res = await api.post('https://api.example.com/users', { name: 'John' });

    expect(res.status).toBe(201);
    expect(res.data).toEqual({ id: 2 });
    expect(mockAgent.post).toHaveBeenCalledWith('https://api.example.com/users');
  });

  it('should make PUT request with payload', async () => {
    const api = new SupertestApi(mockAgent);
    const res = await api.put('https://api.example.com/users/1', { name: 'Jane' });

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ id: 1 });
    expect(mockAgent.put).toHaveBeenCalledWith('https://api.example.com/users/1');
  });

  it('should make DELETE request', async () => {
    const api = new SupertestApi(mockAgent);
    const res = await api.delete('https://api.example.com/users/1');

    expect(res.status).toBe(204);
    expect(mockAgent.delete).toHaveBeenCalledWith('https://api.example.com/users/1');
  });

  it('should make HEAD request', async () => {
    const api = new SupertestApi(mockAgent);
    const res = await api.head('https://api.example.com/users');

    expect(res.status).toBe(200);
    expect(res.headers).toEqual({ 'x-total-count': '42' });
    expect(mockAgent.head).toHaveBeenCalledWith('https://api.example.com/users');
  });

  it('should include token in headers', async () => {
    const api = new SupertestApi(mockAgent, 'test-token');
    await api.get('https://api.example.com/users');

    const req = mockAgent.get.mock.results[0].value;
    expect(req.set).toHaveBeenCalledWith('Authorization', 'Bearer test-token');
  });

  it('should apply extra headers', async () => {
    const api = new SupertestApi(mockAgent, 'test-token');
    await api.get('https://api.example.com/users', { 'X-Custom': 'value' });

    const req = mockAgent.get.mock.results[0].value;
    expect(req.set).toHaveBeenCalledWith('Authorization', 'Bearer test-token');
    expect(req.set).toHaveBeenCalledWith('X-Custom', 'value');
  });

  it('should throw on server error', async () => {
    const errorReq: any = {
      set: jest.fn().mockReturnThis(),
      then: (resolve: any) => resolve({ status: 500, body: {}, headers: {} })
    };
    mockAgent.get.mockReturnValue(errorReq);

    const api = new SupertestApi(mockAgent);
    await expect(api.get('https://api.example.com/fail')).rejects.toThrow('Server error 500');
  });
});
