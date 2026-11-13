const { deleteFiles } = require('../server/neocitiesClient');
const { readJsonBody, sendJson, sendError, ensureMethod } = require('../server/httpUtils');

module.exports = async function handler(req, res) {
  if (!ensureMethod(req, res, ['POST'])) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const paths = body.paths || (body.path ? [body.path] : []);

    if (!paths.length) {
      sendError(res, 400, 'paths is required.');
      return;
    }

    const data = await deleteFiles(paths);
    sendJson(res, 200, data);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};
