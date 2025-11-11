import { describe, it, expect, vi, beforeEach } from 'vitest';
import { serveWithCache } from '../../src/utils/cache.mjs';

// --- Mocks ---

// A constructible Headers mock
class HeadersMock {
    constructor(init) {
        if (init instanceof HeadersMock) {
            this.headers = new Map(init.headers);
        } else {
            this.headers = new Map(init);
        }
    }
    set(key, value) { this.headers.set(key.toLowerCase(), value); }
    get(key) { return this.headers.get(key.toLowerCase()); }
}
global.Headers = HeadersMock;

// A constructible Request mock
global.Request = class RequestMock {
    constructor(url, options) {
        this.url = url;
        Object.assign(this, options);
    }
};

// A constructible Response mock
global.Response = class ResponseMock {
    constructor(body, options) {
        this.body = body;
        this.headers = new HeadersMock(options?.headers);
    }
    clone() {
        return new ResponseMock(this.body, { headers: new HeadersMock(this.headers) });
    }
};

// Mock the Cache API
const cache = {
  match: vi.fn(),
  put: vi.fn(),
};
global.caches = { default: cache };

// --- Tests ---

beforeEach(() => {
    vi.clearAllMocks();
});

describe('Cache utils', () => {

  it('should return cached response and revalidate in background (Cache HIT)', async () => {
    const request = new Request('https://example.com/');
    const cachedResponse = new Response('cached content');
    cache.match.mockResolvedValue(cachedResponse);

    // This handler will be called by the background revalidation
    const handler = vi.fn().mockResolvedValue(new Response('fresh content'));
    const ctx = { waitUntil: vi.fn() };

    const response = await serveWithCache(request, ctx, handler, { browserCacheTtl: 60, staleWhileRevalidate: 300 });

    // Assert that the INSTANTLY returned response is the CACHED one
    expect(response.body).toBe('cached content');
    expect(response.headers.get('X-Cache-Status')).toBe('HIT');

    // Assert that a revalidation was dispatched to the background
    expect(ctx.waitUntil).toHaveBeenCalledTimes(1);
  });

  it('should generate a new response if not in cache (Cache MISS)', async () => {
    const request = new Request('https://example.com/new');
    cache.match.mockResolvedValue(undefined);

    const freshResponse = new Response('new content');
    const handler = vi.fn().mockResolvedValue(freshResponse);
    const ctx = { waitUntil: vi.fn() };

    const response = await serveWithCache(request, ctx, handler, { browserCacheTtl: 60, staleWhileRevalidate: 300 });

    // Assert that the new response is returned
    expect(response.body).toBe('new content');
    expect(response.headers.get('X-Cache-Status')).toBe('MISS');

    // Assert that the handler was called to generate the response
    expect(handler).toHaveBeenCalledTimes(1);

    // Assert that the new response was cached
    expect(cache.put).toHaveBeenCalledWith(expect.any(Request), expect.any(Response));
  });
});
