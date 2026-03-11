import { throwOnServerError, FlexRestError } from '../errors';

describe('throwOnServerError', () => {
  it('should not throw on 2xx status', () => {
    expect(() => throwOnServerError({ status: 200 }, 'https://api.example.com')).not.toThrow();
    expect(() => throwOnServerError({ status: 201 }, 'https://api.example.com')).not.toThrow();
  });

  it('should not throw on 3xx status', () => {
    expect(() => throwOnServerError({ status: 301 }, 'https://api.example.com')).not.toThrow();
  });

  it('should not throw on 4xx status', () => {
    expect(() => throwOnServerError({ status: 404 }, 'https://api.example.com')).not.toThrow();
  });

  it('should throw FlexRestError on 5xx status', () => {
    expect(() => throwOnServerError({ status: 500 }, 'https://api.example.com')).toThrow(FlexRestError);
    expect(() => throwOnServerError({ status: 500 }, 'https://api.example.com')).toThrow('Server error');
  });

  it('should support status as a function (Playwright-style)', () => {
    expect(() => throwOnServerError({ status: () => 502 }, 'https://api.example.com')).toThrow(FlexRestError);
  });

  it('should include status, url, and data on FlexRestError', () => {
    try {
      throwOnServerError({ status: 503 }, 'https://api.example.com/fail', { error: 'down' });
    } catch (e: any) {
      expect(e).toBeInstanceOf(FlexRestError);
      expect(e.status).toBe(503);
      expect(e.url).toBe('https://api.example.com/fail');
      expect(e.data).toEqual({ error: 'down' });
      expect(e.name).toBe('FlexRestError');
    }
  });
});
