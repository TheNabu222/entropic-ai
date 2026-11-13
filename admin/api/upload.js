const { uploadFile } = require('../server/neocitiesClient');
const { decodeContent } = require('../server/contentUtils');
const { readJsonBody, sendJson, sendError, ensureMethod } = require('../server/httpUtils');

module.exports = async function handler(req, res) {
  if (!ensureMethod(req, res, ['POST'])) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const { path, content, contentEncoding, contentType } = body;

    if (!path) {
      sendError(res, 400, 'path is required.');
      return;
    }

    const decodedContent = decodeContent({ content, contentEncoding });
    const data = await uploadFile({ filePath: path, content: decodedContent, contentType });
    sendJson(res, 200, data);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};
