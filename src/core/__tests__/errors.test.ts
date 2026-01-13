import { throwOnServerError } from '../errors';

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

  it('should throw on 5xx status', () => {
    expect(() => throwOnServerError({ status: 500 }, 'https://api.example.com')).toThrow('Server error');
  });
});
