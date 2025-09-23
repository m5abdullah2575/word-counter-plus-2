import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertUploadSchema } from '../shared/schema';

// Export handler for Vercel - handling all API routes in a single function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for production
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  
  try {
    // Handle upload routes
    if (url?.startsWith('/api/uploads') && method === 'POST') {
      // Validate request body
      const validation = insertUploadSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid upload data', 
          details: validation.error.errors 
        });
      }

      const { filename, originalName, mimeType, size, data } = validation.data;

      // Server-side file size limits
      const maxSizes: Record<string, number> = {
        'image/': 10 * 1024 * 1024, // 10MB for images
        'text/': 5 * 1024 * 1024,   // 5MB for text files
        'application/json': 5 * 1024 * 1024,
        'application/xml': 5 * 1024 * 1024,
        'text/csv': 5 * 1024 * 1024,
      };

      const isLogo = filename.includes('logo') || originalName.toLowerCase().includes('logo');
      const maxSize = isLogo && mimeType.startsWith('image/') 
        ? 2 * 1024 * 1024 // 2MB for logos
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
        'text/', 'application/json', 'application/xml', 'text/csv',
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'
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
      return res.json({ 
        id: upload.id, 
        url: `/api/uploads/${upload.id}` 
      });
    }

    // Handle upload retrieval
    if (url?.match(/^\/api\/uploads\/(.+)$/) && method === 'GET') {
      const matches = url.match(/^\/api\/uploads\/(.+)$/);
      if (!matches) {
        return res.status(404).json({ error: 'Upload not found' });
      }

      const upload = await storage.getUpload(matches[1]);
      
      if (!upload) {
        return res.status(404).json({ error: 'Upload not found' });
      }

      // For images, serve directly (except SVG for security)
      if (upload.mimeType.startsWith('image/')) {
        const buffer = Buffer.from(upload.data, 'base64');
        res.setHeader('Content-Type', upload.mimeType);
        
        if (upload.mimeType === 'image/svg+xml') {
          res.setHeader('Content-Disposition', `attachment; filename="${upload.originalName}"`);
        } else {
          res.setHeader('Content-Disposition', `inline; filename="${upload.originalName}"`);
        }
        
        return res.send(buffer);
      }

      // For text files, serve as downloadable
      const buffer = Buffer.from(upload.data, 'base64');
      res.setHeader('Content-Type', upload.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${upload.originalName}"`);
      return res.send(buffer);
    }

    // Default response for other API routes
    res.status(404).json({ error: 'API endpoint not found' });
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}