export interface JwtPayload {
  sub: string; // Subject: typically the user ID or identifier
  exp: number; // Expiration timestamp (UNIX timestamp)
  iat: number; // Issued at timestamp (UNIX timestamp)
  roles?: string[]; // Optional: User roles or permissions
  email?: string; // Optional: User email address
  name?: string; // Optional: User's name
  [key: string]: any; // Allows for additional dynamic claims
}
