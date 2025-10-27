# Cloud Storage Setup Guide

This guide explains how to set up cloud storage integrations for your users to upload files directly to Google Drive, Dropbox, OneDrive, and Box.

## Overview

Users can upload files to their cloud storage accounts by clicking on the cloud storage service of their choice. The authentication happens in a popup window, and the connection is temporary - it's automatically closed when the user leaves your site.

## Setup Instructions

### 1. Google Drive

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Set Application type to "Web application"
6. Add your domain to "Authorized JavaScript origins": `https://yourdomain.com`
7. Add redirect URI: `https://yourdomain.com/download`
8. Copy the Client ID and API Key
9. Add to your `.env` file:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   VITE_GOOGLE_API_KEY=your_api_key_here
   ```

### 2. Dropbox

1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Click "Create app"
3. Choose "Scoped access"
4. Choose "Full Dropbox"
5. Name your app
6. In Settings, add your domain to "Chooser / Saver / Embedder domains"
7. Copy the App key
8. Add to your `.env` file:
   ```
   VITE_DROPBOX_APP_KEY=your_app_key_here
   ```

### 3. OneDrive

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "App registrations"
3. Click "New registration"
4. Set redirect URI to: `https://yourdomain.com/download`
5. Under "API permissions", add Microsoft Graph → `Files.ReadWrite`
6. Copy the Application (client) ID
7. Add to your `.env` file:
   ```
   VITE_ONEDRIVE_CLIENT_ID=your_client_id_here
   ```

### 4. Box

1. Go to [Box Developer Console](https://app.box.com/developers/console)
2. Create New App → Custom App
3. Choose "User Authentication (OAuth 2.0)"
4. Set redirect URI to: `https://yourdomain.com/download`
5. Enable scopes: "Read and write all files and folders"
6. Copy the Client ID
7. Add to your `.env` file:
   ```
   VITE_BOX_CLIENT_ID=your_client_id_here
   ```

## How It Works

1. User generates a file using any tool on your site
2. User navigates to the Download page
3. User clicks "Save to Cloud Storage" and selects their preferred service
4. A popup window opens for authentication
5. User logs in to their cloud storage account
6. File is uploaded directly to their cloud storage
7. User is automatically signed out after upload
8. Connection is closed when user leaves your site

## Security

- All authentication happens client-side via OAuth 2.0
- Access tokens are temporary and stored only in memory
- Users are automatically signed out after file upload
- No credentials or tokens are stored on your server
- Each session requires fresh authentication

## Testing

To test the cloud storage integration:

1. Set up at least one service using the instructions above
2. Generate a file using any tool (e.g., Word Counter)
3. Navigate to the Download page
4. Click "Save to Cloud Storage"
5. Select the service you configured
6. Complete the authentication in the popup
7. Verify the file appears in your cloud storage

## Important Notes

- Cloud storage uploads work only with valid API credentials
- Users must have accounts with the respective cloud storage services
- Popup blockers may prevent authentication windows from opening
- HTTPS is required for production OAuth flows
- Each service has its own rate limits and quotas
