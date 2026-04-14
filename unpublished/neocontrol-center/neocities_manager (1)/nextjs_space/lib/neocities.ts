// Neocities API client

const NEOCITIES_API_BASE = 'https://neocities.org/api';

export interface NeocitiesFile {
  path: string;
  is_directory: boolean;
  size?: number;
  updated_at?: string;
  sha1_hash?: string;
}

export interface NeocitiesListResponse {
  result: string;
  files: NeocitiesFile[];
}

export interface NeocitiesInfoResponse {
  result: string;
  info: {
    sitename: string;
    views: number;
    hits: number;
    created_at: string;
    last_updated: string;
    domain?: string;
    tags: string[];
  };
}

export class NeocitiesClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getAuthHeader(): string {
    // Neocities supports Basic auth with api_key as password (empty username)
    const credentials = Buffer.from(`:${this.apiKey}`).toString('base64');
    return `Basic ${credentials}`;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${NEOCITIES_API_BASE}${endpoint}`;
    
    const res = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        ...(options?.headers ?? {}),
      },
    });

    const text = await res.text();
    
    if (!res.ok) {
      // For 500 errors, throw a specific error that can be caught and handled
      if (res.status === 500) {
        throw new Error(`NEOCITIES_SERVER_ERROR: ${endpoint}`);
      }
      throw new Error(`Neocities API error: ${res.status} - ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON response: ${text}`);
    }
  }

  async list(path?: string): Promise<NeocitiesFile[]> {
    const query = path ? `?path=${encodeURIComponent(path)}` : '';
    const response = await this.request<NeocitiesListResponse>(`/list${query}`);
    return response?.files ?? [];
  }

  async info(): Promise<NeocitiesInfoResponse['info']> {
    const response = await this.request<NeocitiesInfoResponse>('/info');
    return response?.info;
  }

  async upload(files: { path: string; content: string }[]): Promise<{ result: string }> {
    const formData = new FormData();
    
    for (const file of files) {
      const blob = new Blob([file.content], { type: 'text/html' });
      formData.append(file.path, blob, file.path);
    }

    // Try Bearer first
    let res = await fetch(`${NEOCITIES_API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    // Fallback to Basic auth if 500
    if (res.status === 500) {
      const formData2 = new FormData();
      for (const file of files) {
        const blob = new Blob([file.content], { type: 'text/html' });
        formData2.append(file.path, blob, file.path);
      }
      res = await fetch(`${NEOCITIES_API_BASE}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
        },
        body: formData2,
      });
    }

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status} - ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Invalid upload response: ${text}`);
    }
  }

  async delete(filenames: string[]): Promise<{ result: string }> {
    const formData = new FormData();
    for (const filename of filenames) {
      formData.append('filenames[]', filename);
    }

    let res = await fetch(`${NEOCITIES_API_BASE}/delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (res.status === 500) {
      const formData2 = new FormData();
      for (const filename of filenames) {
        formData2.append('filenames[]', filename);
      }
      res = await fetch(`${NEOCITIES_API_BASE}/delete`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
        },
        body: formData2,
      });
    }

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status} - ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Invalid delete response: ${text}`);
    }
  }

  async rename(oldPath: string, newPath: string): Promise<{ result: string }> {
    // Neocities doesn't have a native rename - we'll need to download, re-upload, delete
    throw new Error('Rename requires download/upload/delete workflow');
  }
}

import { prisma } from '@/lib/db';

export function getNeocitiesClient(apiKey: string): NeocitiesClient {
  if (!apiKey) {
    throw new Error('Neocities API key not provided');
  }
  return new NeocitiesClient(apiKey);
}

export async function getNeocitiesClientFromDb(): Promise<NeocitiesClient> {
  // First try database
  const settings = await prisma.appSettings.findUnique({ where: { id: 'default' } });
  
  if (settings?.neocitiesApiKey) {
    return new NeocitiesClient(settings.neocitiesApiKey);
  }
  
  // Fallback to env var
  const envKey = process.env.NEOCITIES_API_KEY;
  if (envKey) {
    return new NeocitiesClient(envKey);
  }
  
  throw new Error('Neocities API key not configured. Go to Settings to add your API key.');
}
