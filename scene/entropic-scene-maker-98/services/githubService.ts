
import { GithubAsset } from '../types';

const REPO_OWNER = 'TheNabu222';
const REPO_NAME = 'entropic-ai';
const BRANCH = 'main';

/**
 * Fetches assets from the GitHub repository tree recursively.
 * Ensures that folder paths are correctly converted to raw content URLs.
 */
export const fetchRepoAssets = async (): Promise<GithubAsset[]> => {
  try {
    // We use the Git Trees API with recursive=1 to get everything in one call
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${BRANCH}?recursive=1`
    );
    
    if (!response.ok) {
      console.error('GitHub API Error:', response.status);
      return [];
    }

    const data = await response.json();
    
    // Filter for files (blobs) and specific extensions
    return data.tree
      .filter((item: any) => {
        if (item.type !== 'blob') return false;
        const path = item.path.toLowerCase();
        return (
          path.endsWith('.png') || 
          path.endsWith('.jpg') || 
          path.endsWith('.jpeg') || 
          path.endsWith('.gif') || 
          path.endsWith('.webp') ||
          path.endsWith('.mp3') ||
          path.endsWith('.wav')
        );
      })
      .map((item: any) => {
        const fileName = item.path.split('/').pop() || item.path;
        return {
          path: item.path,
          type: 'blob',
          name: fileName,
          // Correct raw URL construction for GitHub content
          url: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${item.path}`
        };
      });
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    return [];
  }
};

export const isImage = (fileName: string): boolean => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '');
};

export const isAudio = (fileName: string): boolean => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ['mp3', 'wav', 'ogg'].includes(ext || '');
};
