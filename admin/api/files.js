const { listFiles } = require('../server/neocitiesClient');
const { sendJson, sendError, ensureMethod } = require('../server/httpUtils');

module.exports = async function handler(req, res) {
  if (!ensureMethod(req, res, ['GET'])) {
    return;
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const listPath = url.searchParams.get('path') || '';
    const data = await listFiles(listPath);
    sendJson(res, 200, data);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};
