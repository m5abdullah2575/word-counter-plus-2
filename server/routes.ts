import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUploadSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Domain separation: Add 301 redirects for legacy routes
  // Redirect /text-case-converter paths to the case subdomain
  const CASE_ORIGIN = 'https://textcase.wordcounterplusapp.com';
  
  // Only redirect on main domain (avoid infinite redirects on case domain)
  app.get('/text-case-converter', (req, res) => {
    const queryString = Object.keys(req.query).length > 0 ? 
      '?' + new URLSearchParams(req.query as Record<string, string>).toString() : '';
    res.redirect(301, `${CASE_ORIGIN}/${queryString}`);
  });

  app.get('/text-case-converter/', (req, res) => {
    const queryString = Object.keys(req.query).length > 0 ? 
      '?' + new URLSearchParams(req.query as Record<string, string>).toString() : '';
    res.redirect(301, `${CASE_ORIGIN}/${queryString}`);
  });

  // Additional legacy route variations
  app.get('/text-case', (req, res) => {
    const queryString = Object.keys(req.query).length > 0 ? 
      '?' + new URLSearchParams(req.query as Record<string, string>).toString() : '';
    res.redirect(301, `${CASE_ORIGIN}/${queryString}`);
  });

  // put application routes here
  // prefix all routes with /api

  // Upload routes for QR code file/photo storage
  app.post('/api/uploads', async (req, res) => {
    try {
      // Validate request body with zod
      const validation = insertUploadSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid upload data', 
          details: validation.error.errors 
        });
      }

      const { filename, originalName, mimeType, size, data } = validation.data;

      // Server-side file size limits (enforce what frontend should check)
      const maxSizes: Record<string, number> = {
        'image/': 10 * 1024 * 1024, // 10MB for images (photos)
        'text/': 5 * 1024 * 1024,   // 5MB for text files
        'application/json': 5 * 1024 * 1024,
        'application/xml': 5 * 1024 * 1024,
        'text/csv': 5 * 1024 * 1024,
      };

      // For logo uploads, apply stricter limit if filename indicates it's a logo
      const isLogo = filename.includes('logo') || originalName.toLowerCase().includes('logo');
      const maxSize = isLogo && mimeType.startsWith('image/') 
        ? 2 * 1024 * 1024 // 2MB for logo images
        : Object.entries(maxSizes).find(([prefix]) => mimeType.startsWith(prefix))?.[1] 
          || 5 * 1024 * 1024; // Default 5MB

      if (size > maxSize) {
        return res.status(413).json({ 
          error: 'File too large', 
          maxSize: maxSize,
          receivedSize: size 
        });
      }

      // Validate allowed mime types
      const allowedTypes = [
        'text/', 'application/json', 'application/xml', 'text/csv', // Text files
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml' // Images
      ];
      
      const isAllowedType = allowedTypes.some(type => mimeType.startsWith(type) || mimeType === type);
      if (!isAllowedType) {
        return res.status(400).json({ 
          error: 'Unsupported file type', 
          mimeType,
          allowedTypes: allowedTypes 
        });
      }

      const upload = await storage.createUpload(validation.data);

      res.json({ 
        id: upload.id, 
        url: `/api/uploads/${upload.id}` 
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to save upload' });
    }
  });

  app.get('/api/uploads/:id', async (req, res) => {
    try {
      const upload = await storage.getUpload(req.params.id);
      
      if (!upload) {
        return res.status(404).json({ error: 'Upload not found' });
      }

      // For images, serve directly (except SVG for security)
      if (upload.mimeType.startsWith('image/')) {
        const buffer = Buffer.from(upload.data, 'base64');
        res.set('Content-Type', upload.mimeType);
        
        // Force SVG downloads to prevent XSS
        if (upload.mimeType === 'image/svg+xml') {
          res.set('Content-Disposition', `attachment; filename="${upload.originalName}"`);
        } else {
          res.set('Content-Disposition', `inline; filename="${upload.originalName}"`);
        }
        
        return res.send(buffer);
      }

      // For text files, serve as downloadable
      const buffer = Buffer.from(upload.data, 'base64');
      res.set('Content-Type', upload.mimeType);
      res.set('Content-Disposition', `attachment; filename="${upload.originalName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Failed to retrieve upload' });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
