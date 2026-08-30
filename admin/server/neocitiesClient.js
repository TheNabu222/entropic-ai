const path = require('node:path');

const NEOCITIES_API_BASE = 'https://neocities.org/api';
const DEFAULT_PROTECTED_FILES = new Set(['index.html']);

function normalizePath(inputPath) {
  if (typeof inputPath !== 'string') {
    throw new Error('Path must be a string.');
  }

  const trimmed = inputPath.trim();
  if (!trimmed) {
    return '';
  }

  const withForwardSlashes = trimmed.replace(/\\/g, '/');
  const normalized = path.posix.normalize(withForwardSlashes);

  if (normalized.startsWith('..')) {
    throw new Error('Path traversal is not allowed.');
  }

  const withoutLeadingSlash = normalized.replace(/^\//, '').replace(/^\.\//, '');

  return withoutLeadingSlash === '.' ? '' : withoutLeadingSlash;
}

function normalizePaths(paths) {
  if (!Array.isArray(paths)) {
    throw new Error('Paths must be an array.');
  }

  return paths.map(normalizePath);
}

function isRootPath(normalizedPath) {
  return normalizedPath === '';
}

function isProtectedPath(normalizedPath, protectedFiles = DEFAULT_PROTECTED_FILES) {
  return protectedFiles.has(normalizedPath);
}

function assertFilePath(normalizedPath) {
  if (!normalizedPath || isRootPath(normalizedPath)) {
    throw new Error('File path must not be empty.');
  }
}

function assertDeletablePath(normalizedPath, protectedFiles = DEFAULT_PROTECTED_FILES) {
  if (isRootPath(normalizedPath)) {
    throw new Error('Refusing to delete the site root.');
  }

  if (isProtectedPath(normalizedPath, protectedFiles)) {
    throw new Error(`Refusing to delete protected file: ${normalizedPath}`);
  }
}

function getApiKey() {
  const apiKey = process.env.NEOCITIES_API_KEY;
  if (!apiKey) {
    throw new Error('Missing NEOCITIES_API_KEY environment variable.');
  }
  return apiKey;
}

async function apiRequest({ endpoint, method = 'GET', body }) {
  const apiKey = getApiKey();
  const url = `${NEOCITIES_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Neocities API error (${response.status}): ${message}`);
  }

  const data = await response.json();

  if (data.result !== 'success') {
    const errorMessage = data.message || data.error_type || 'Unknown Neocities API error.';
    throw new Error(errorMessage);
  }

  return data;
}

async function listFiles(listPath = '') {
  const normalizedPath = normalizePath(listPath);
  const query = normalizedPath ? `?path=${encodeURIComponent(normalizedPath)}` : '';
  return apiRequest({ endpoint: `/list${query}` });
}

async function uploadFile({ filePath, content, contentType }) {
  const normalizedPath = normalizePath(filePath);
  assertFilePath(normalizedPath);

  if (typeof content === 'undefined' || content === null) {
    throw new Error('Content is required for upload.');
  }

  const formData = new FormData();
  const blob = new Blob([content], { type: contentType || 'application/octet-stream' });
  formData.append(normalizedPath, blob, path.posix.basename(normalizedPath));

  return apiRequest({ endpoint: '/upload', method: 'POST', body: formData });
}

async function deleteFiles(paths, options = {}) {
  const normalizedPaths = normalizePaths(paths);
  const protectedFiles = options.protectedFiles || DEFAULT_PROTECTED_FILES;

  normalizedPaths.forEach((normalizedPath) => {
    assertDeletablePath(normalizedPath, protectedFiles);
  });

  const formData = new FormData();
  normalizedPaths.forEach((normalizedPath) => {
    formData.append('filenames[]', normalizedPath);
  });

  return apiRequest({ endpoint: '/delete', method: 'POST', body: formData });
}

async function renameFile({ from, to, content, contentType }) {
  const normalizedFrom = normalizePath(from);
  const normalizedTo = normalizePath(to);
  assertFilePath(normalizedFrom);
  assertFilePath(normalizedTo);

  if (typeof content === 'undefined' || content === null) {
    throw new Error('Content is required to rename a file.');
  }

  await uploadFile({ filePath: normalizedTo, content, contentType });
  await deleteFiles([normalizedFrom]);

  return { result: 'success', from: normalizedFrom, to: normalizedTo };
}

async function moveFile({ from, to, content, contentType }) {
  return renameFile({ from, to, content, contentType });
}

module.exports = {
  listFiles,
  uploadFile,
  deleteFiles,
  renameFile,
  moveFile,
  normalizePath,
  normalizePaths,
  isProtectedPath,
  assertDeletablePath,
  DEFAULT_PROTECTED_FILES,
};
