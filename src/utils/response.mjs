// src/utils/response.mjs

// Helper for standard HTML string responses
export const html = (content, status = 200, headers = {}) => {
  return new Response(content, {
    status,
    headers: { ...headers, 'Content-Type': 'text/html;charset=UTF-8' },
  });
};

/**
 * Helper for streaming HTML responses.
 * @param {ReadableStream} stream - The stream to send as the response body.
 * @param {number} [status=200] - The HTTP status code.
 * @param {object} [headers={}] - Additional headers.
 * @returns {Response}
 */
export const streamHtml = (stream, status = 200, headers = {}) => {
    return new Response(stream, {
      status,
      headers: { ...headers, 'Content-Type': 'text/html;charset=UTF-8' },
    });
};

// Helper for JSON responses
export const json = (data, status = 200, headers = {}) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json;charset=UTF-8' },
  });
};

// ... other helpers (xml, text) ...

// 404 Not Found handler
export const handleNotFound = () => {
  return new Response('Not Found', { status: 404 });
};

// Generic error handler
export const handleError = (error) => {
  console.error(error);
  return new Response('Internal Server Error', { status: 500 });
};
