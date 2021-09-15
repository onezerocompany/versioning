export interface RateLimitMock {
  rate: { limit: number; remaining: number; reset: number };
}
