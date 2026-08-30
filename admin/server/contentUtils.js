function decodeContent({ content, contentEncoding }) {
  if (typeof content === 'undefined' || content === null) {
    throw new Error('Content is required.');
  }

  if (!contentEncoding || contentEncoding === 'utf8') {
    return content;
  }

  if (contentEncoding === 'base64') {
    return Buffer.from(content, 'base64');
  }

  throw new Error(`Unsupported content encoding: ${contentEncoding}`);
}

module.exports = {
  decodeContent,
};
