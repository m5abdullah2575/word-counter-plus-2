# Running Word Counter Plus on Your Laptop

## Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Create `.env` file** in the root directory with your Firebase credentials (see format below)

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser** to `http://localhost:5000`

---

## Firebase Environment Variables Setup

### ⚠️ IMPORTANT: Correct `.env` File Format

Your `.env` file needs to be formatted exactly like this:

```env
FIREBASE_PROJECT_ID=word-counter-plus-app
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@word-counter-plus-app.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

### Critical Points:

1. **The private key must be on ONE single line**
2. **Use `\n` (backslash-n) instead of actual line breaks**
3. **Wrap the entire key in double quotes**
4. **No spaces around the `=` sign**

### How to Format Your Private Key:

#### Option 1: Manual Formatting (Easiest)
1. Open your Firebase JSON file
2. Find the `private_key` value
3. Copy the ENTIRE value including the quotes
4. Paste it into your `.env` file after `FIREBASE_PRIVATE_KEY=`

**Example from your JSON:**
```json
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----"
```

**Copy this ENTIRE value** (including the quotes) and paste it like this:
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----"
```

#### Option 2: Using a Script
Create this file and run it to generate the correct `.env` format:

**create-env.js:**
```javascript
const fs = require('fs');

// Read your Firebase JSON file
const firebaseConfig = JSON.parse(fs.readFileSync('./attached_assets/word-counter-plus-app-firebase-adminsdk-fbsvc-6258760568.json', 'utf8'));

// Create .env content
const envContent = `FIREBASE_PROJECT_ID=${firebaseConfig.project_id}
FIREBASE_CLIENT_EMAIL=${firebaseConfig.client_email}
FIREBASE_PRIVATE_KEY="${firebaseConfig.private_key}"
`;

// Write .env file
fs.writeFileSync('.env', envContent);
console.log('✅ .env file created successfully!');
```

Then run:
```bash
node create-env.js
```

---

## Verifying It Works

After creating your `.env` file correctly, run:

```bash
npm run dev
```

You should see:
```
✅ Server is running successfully!
🌐 URL: http://localhost:5000
✅ Firebase Firestore initialized successfully
```

**If you see** `⚠️ Firebase credentials not configured`, your `.env` file is not formatted correctly.

---

## Testing the Contact Form

1. Go to `http://localhost:5000/contact`
2. Fill out and submit the form
3. Check your terminal - you should see:
   ```
   POST /api/contact 200
   ```
4. Verify in Firebase Console that the message was saved

---

## Common Issues

### Issue: "Firebase credentials not configured"
**Solution:** Your `.env` file is not formatted correctly. The private key must be on ONE line with `\n` for newlines.

### Issue: "Cannot find module"
**Solution:** Run `npm install` again

### Issue: Port 5000 already in use
**Solution:** Edit `server/index.ts` and change `DEFAULT_PORT` to 5005 or another port

---

## Deploying to Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Add Environment Variables in Vercel Dashboard**:
   - Go to your project settings
   - Click "Environment Variables"
   - Add all three Firebase variables (same values as your `.env` file)

4. **Redeploy**:
```bash
vercel --prod
```

Your contact form will work automatically in production!

---

## Security Notes

- ✅ `.env` is already in `.gitignore` - it won't be committed to Git
- ✅ Never share your `.env` file or Firebase JSON file publicly
- ✅ The Firebase private key should be kept secret
- ✅ All environment variables are loaded securely at runtime
