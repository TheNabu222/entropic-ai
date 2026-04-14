import { NeocitiesFile } from '../types';
import { MOCK_FILES } from '../constants';

export class NeocitiesService {
  private apiKey: string;
  private useMock: boolean;
  private useProxy: boolean;
  private proxyUrl: string;
  
  // Local state for simulation/offline mode
  private localFiles: NeocitiesFile[] = [...MOCK_FILES];

  // List of public CORS proxies to try in order if one fails
  private readonly PROXY_LIST = [
    "https://corsproxy.io/?url=",
    "https://api.allorigins.win/raw?url=",
    "https://thingproxy.freeboard.io/fetch/"
  ];

  constructor(apiKey: string, useMock: boolean = false, useProxy: boolean = false, proxyUrl: string = "") {
    this.apiKey = apiKey;
    this.useMock = useMock;
    this.useProxy = useProxy;
    this.proxyUrl = proxyUrl;
  }

  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json'
    };
  }

  // Robust fetcher that tries multiple proxies if enabled
  private async fetchWithFallback(targetUrl: string, options: RequestInit): Promise<Response> {
    if (!this.useProxy) {
        return fetch(targetUrl, options);
    }

    // Try user defined proxy first if exists
    const proxies = this.proxyUrl ? [this.proxyUrl, ...this.PROXY_LIST] : this.PROXY_LIST;
    let lastError;

    for (const proxy of proxies) {
        try {
            // Some proxies handle encoding differently, but standard encodeURIComponent is safest
            const finalUrl = `${proxy}${encodeURIComponent(targetUrl)}`;
            const response = await fetch(finalUrl, options);
            
            if (response.ok || response.status === 401 || response.status === 404) {
                // If we got a real HTTP response (even an error like 401), the proxy worked.
                return response;
            }
        } catch (e) {
            console.warn(`Proxy ${proxy} failed, trying next...`, e);
            lastError = e;
        }
    }
    
    throw lastError || new Error("All proxies failed to connect.");
  }

  async listFiles(): Promise<NeocitiesFile[]> {
    if (this.useMock) {
      return new Promise(resolve => setTimeout(() => resolve([...this.localFiles]), 400));
    }

    try {
      const response = await this.fetchWithFallback('https://neocities.org/api/list', {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Neocities API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.result === 'success') {
        this.localFiles = data.files; // Cache for fallback
        return data.files;
      }
      throw new Error(data.message || 'Unknown API error');
    } catch (error: any) {
      if (!this.useProxy && (error.name === 'TypeError' || error.message.includes('Failed to fetch'))) {
          throw new Error('CORS Blocked: Enable "Use CORS Proxy" in Settings to go Live.');
      }
      throw error;
    }
  }

  async getFileContent(path: string): Promise<string> {
    if (this.useMock) {
       // Mock Nav/Index with actual links to simulate site structure for Orphan Scanner
       if (path === 'nav.html' || path === 'index.html' || path.includes('nav.html')) {
           return `
             <!-- SIMULATED NAV CONTENT -->
             <nav>
               <a href="/index.html">Home</a>
               <a href="/admin/admin-panel-v2.html">Admin</a>
               <a href="/play/cavebot.html">Cavebot</a>
               <a href="/hd_tv/hdtv.html">HDTV</a>
               <a href="/bc7f2a/bc7f2a-index.html">BC7F2A</a>
               <a href="/nexus/index.html">Nexus</a>
               <a href="/nabu222/index.html">Nabu</a>
               <a href="/maps/void_explorer.html">Maps</a>
               <a href="/pea/pod.html">Pea Pod</a>
               <a href="/assets/sounds/DreamwalkerSEP2.mp3">Sound</a>
             </nav>
           `;
       }
       if (path.endsWith('.html')) return `<!-- SIMULATION MODE -->\n<html><body><h1>${path}</h1><p>Offline Content</p></body></html>`;
       return `[Binary/Text content simulation for ${path}]`;
    }

    try {
        const liveUrl = `https://coaiexist.wtf/${path}`; 
        
        // We use fetchWithFallback here too because fetching HTML from a different domain 
        // can sometimes trigger CORS depending on server config, though usually less strict than API.
        // Using the proxy ensures we get the raw HTML text reliably.
        const response = await this.fetchWithFallback(liveUrl, { method: 'GET' });
        
        if (response.ok) return await response.text();
        throw new Error("Could not fetch file content.");
    } catch (e) {
        throw e;
    }
  }

  async uploadFile(path: string, content: string | Blob): Promise<void> {
    if (this.useMock) {
        const existingIndex = this.localFiles.findIndex(f => f.path === path);
        const fileEntry = {
            path,
            is_directory: false,
            size: typeof content === 'string' ? content.length : content.size,
            updated_at: new Date().toISOString()
        };

        if (existingIndex >= 0) this.localFiles[existingIndex] = fileEntry;
        else this.localFiles.push(fileEntry);
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    const formData = new FormData();
    const blob = typeof content === 'string' ? new Blob([content], { type: 'text/plain' }) : content;
    formData.append(path, blob, path);

    const response = await this.fetchWithFallback('https://neocities.org/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        body: formData
    });

    if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Upload failed: ${response.status} ${txt}`);
    }
  }

  async deleteFile(path: string): Promise<void> {
    if (this.useMock) {
        this.localFiles = this.localFiles.filter(f => f.path !== path);
        return new Promise(resolve => setTimeout(resolve, 300));
    }
    
    const params = new URLSearchParams();
    params.append('filenames[]', path);

    const response = await this.fetchWithFallback('https://neocities.org/api/delete', {
        method: 'POST',
        headers: {
             ...this.getAuthHeaders(),
             'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    });

    if (!response.ok) throw new Error('Delete failed via Proxy');
  }

  async renameFile(oldPath: string, newPath: string, content: string): Promise<void> {
      await this.uploadFile(newPath, content);
      await this.deleteFile(oldPath);
  }
}