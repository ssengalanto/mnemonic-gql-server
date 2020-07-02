import httpMocks from 'node-mocks-http';

import { AppContext } from '@shared/interfaces';

export const reqMockData = httpMocks.createRequest();
export const resMockData = httpMocks.createResponse();

export const appContextMockData: AppContext = {
  req: reqMockData,
  res: resMockData,
};
