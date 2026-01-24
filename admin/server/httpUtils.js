async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString('utf8');
  if (!body) {
    return {};
  }
  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error('Invalid JSON body.');
  }
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message });
}

function ensureMethod(req, res, allowedMethods) {
  if (!allowedMethods.includes(req.method)) {
    sendError(res, 405, `Method ${req.method} not allowed.`);
    return false;
  }
  return true;
}

module.exports = {
  readJsonBody,
  sendJson,
  sendError,
  ensureMethod,
};
