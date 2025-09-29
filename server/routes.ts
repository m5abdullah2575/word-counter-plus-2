import type { Express } from "express";
import { createServer, type Server } from "http";
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// GitHub client setup using the integration
let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Legacy route redirects - redirect to local routes instead of external subdomains
  app.get('/text-case-converter', (req, res) => {
    const queryString = Object.keys(req.query).length > 0 ? 
      '?' + new URLSearchParams(req.query as Record<string, string>).toString() : '';
    res.redirect(301, `/text-case-convert${queryString}`);
  });

  app.get('/text-case-converter/', (req, res) => {
    const queryString = Object.keys(req.query).length > 0 ? 
      '?' + new URLSearchParams(req.query as Record<string, string>).toString() : '';
    res.redirect(301, `/text-case-convert${queryString}`);
  });

  // Additional legacy route variations
  app.get('/text-case', (req, res) => {
    const queryString = Object.keys(req.query).length > 0 ? 
      '?' + new URLSearchParams(req.query as Record<string, string>).toString() : '';
    res.redirect(301, `/text-case-convert${queryString}`);
  });

  // put application routes here
  // prefix all routes with /api

  // Helper function to get all files recursively, excluding certain directories/files
  function getAllFiles(dirPath: string, arrayOfFiles: string[] = [], basePath: string = ''): string[] {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      const relativePath = basePath ? path.join(basePath, file) : file;
      
      // Skip certain directories and files
      if ([
        'node_modules', '.git', 'dist', '.replit', '.env', '.env.local', 
        'attached_assets', '.next', 'coverage', '.nyc_output', 'logs',
        '.cache', 'tmp', 'temp', '.npm', '.pnpm'
      ].includes(file)) {
        return;
      }

      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles, relativePath);
      } else {
        arrayOfFiles.push(relativePath);
      }
    });

    return arrayOfFiles;
  }

  // GitHub upload route with authentication
  app.post('/api/upload-to-github', async (req, res) => {
    try {
      // Authentication check - require special header for security
      const authHeader = req.headers['x-replit-upload-auth'];
      const expectedAuth = process.env.REPL_IDENTITY || process.env.WEB_REPL_RENEWAL;
      
      if (!authHeader || !expectedAuth || authHeader !== expectedAuth) {
        return res.status(401).json({ 
          success: false, 
          message: 'Unauthorized: Invalid authentication token' 
        });
      }

      const octokit = await getUncachableGitHubClient();
      
      // Get the authenticated user's information
      const { data: user } = await octokit.rest.users.getAuthenticated();
      const owner = user.login;
      const repo = 'word-counter-plus-2';
      
      // Check if repository exists, create if it doesn't
      let repository;
      try {
        const { data } = await octokit.rest.repos.get({ owner, repo });
        repository = data;
      } catch (error: any) {
        if (error.status === 404) {
          // Repository doesn't exist, create it
          const { data } = await octokit.rest.repos.createForAuthenticatedUser({
            name: repo,
            description: 'Word Counter Plus - Advanced text analysis tool',
            private: false,
            auto_init: true
          });
          repository = data;
        } else {
          throw error;
        }
      }

      // Get the current commit SHA for the main branch
      let currentCommitSha;
      try {
        const { data: refData } = await octokit.rest.git.getRef({
          owner,
          repo,
          ref: 'heads/main'
        });
        currentCommitSha = refData.object.sha;
      } catch (error: any) {
        if (error.status === 409) {
          // Branch doesn't exist, we'll create it
          currentCommitSha = null;
        } else {
          throw error;
        }
      }

      // Get all project files
      const projectRoot = path.resolve(__dirname, '..');
      const files = getAllFiles(projectRoot);
      
      // Create blobs for each file
      const blobs: { path: string; sha: string; mode: "100644" }[] = [];
      
      for (const filePath of files) {
        const fullPath = path.join(projectRoot, filePath);
        const content = fs.readFileSync(fullPath);
        
        const { data: blob } = await octokit.rest.git.createBlob({
          owner,
          repo,
          content: content.toString('base64'),
          encoding: 'base64'
        });
        
        blobs.push({
          path: filePath.replace(/\\/g, '/'), // Ensure forward slashes for GitHub
          sha: blob.sha,
          mode: '100644'
        });
      }

      // Create a tree
      const { data: tree } = await octokit.rest.git.createTree({
        owner,
        repo,
        tree: blobs,
        base_tree: currentCommitSha ? undefined : undefined
      });

      // Create a commit
      const { data: commit } = await octokit.rest.git.createCommit({
        owner,
        repo,
        message: 'Upload Word Counter Plus website from Replit',
        tree: tree.sha,
        parents: currentCommitSha ? [currentCommitSha] : []
      });

      // Update the reference
      if (currentCommitSha) {
        await octokit.rest.git.updateRef({
          owner,
          repo,
          ref: 'heads/main',
          sha: commit.sha
        });
      } else {
        await octokit.rest.git.createRef({
          owner,
          repo,
          ref: 'refs/heads/main',
          sha: commit.sha
        });
      }

      res.json({ 
        success: true, 
        message: 'Code successfully uploaded to GitHub!',
        repository_url: repository.html_url,
        commit_sha: commit.sha,
        files_uploaded: files.length
      });

    } catch (error: any) {
      console.error('GitHub upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to upload to GitHub', 
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
