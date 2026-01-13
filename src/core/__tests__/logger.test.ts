import { logRequest } from '../logger';
import * as fs from 'fs';

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('logRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFs.appendFile.mockImplementation((path, data, callback: any) => callback());
  });

  it('should log request details', () => {
    logRequest('GET', 'https://api.example.com', {}, null, { status: 200, data: {} });
    expect(mockedFs.appendFile).toHaveBeenCalled();
  });
});
