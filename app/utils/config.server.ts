export const SITE_TITLE = process.env.SITE_TITLE ?
  process.env.SITE_TITLE : "safarilive.org";
export const SESSION_SECRET = process.env.SESSION_SECRET ?? 'session_secret'
export const SESSION_NAME = process.env.SESSION_NAME ?? 'salior-session'
export const SALT = process.env.SALT ?? 12;