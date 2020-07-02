import { CookieOptions } from 'express';

export enum Cookie {
  REFRESH_TOKEN = 'refresh-token',
}

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
};
