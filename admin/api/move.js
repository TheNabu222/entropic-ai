const { moveFile } = require('../server/neocitiesClient');
const { decodeContent } = require('../server/contentUtils');
const { readJsonBody, sendJson, sendError, ensureMethod } = require('../server/httpUtils');

module.exports = async function handler(req, res) {
  if (!ensureMethod(req, res, ['POST'])) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const { from, to, content, contentEncoding, contentType } = body;

    if (!from || !to) {
      sendError(res, 400, 'from and to are required.');
      return;
    }

    const decodedContent = decodeContent({ content, contentEncoding });
    const data = await moveFile({ from, to, content: decodedContent, contentType });
    sendJson(res, 200, data);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};
