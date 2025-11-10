// src/utils/response.mjs

// Helper for HTML responses
export const html = (content, status = 200, headers = {}) => {
  return new Response(content, {
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

// Helper for XML responses
export const xml = (content, status = 200, headers = {}) => {
  return new Response(content, {
    status,
    headers: { ...headers, 'Content-Type': 'application/xml;charset=UTF-8' },
  });
};

// Helper for Text responses
export const text = (content, status = 200, headers = {}) => {
    return new Response(content, {
      status,
      headers: { ...headers, 'Content-Type': 'text/plain;charset=UTF-8' },
    });
  };

// 404 Not Found handler
export const handleNotFound = () => {
  return new Response('Not Found', { status: 404 });
};

// Generic error handler
export const handleError = (error) => {
  console.error(error);
  return new Response('Internal Server Error', { status: 500 });
};
