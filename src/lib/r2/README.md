# R2 Upload Library

This library provides reusable functions for uploading files to Cloudflare R2 storage.

## Setup

Make sure you have the following environment variables set:

```env
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_ACCOUNT_ID=your_account_id
R2_BUCKET=your_bucket_name
```

## Usage Examples

### Upload a File from a Form

```typescript
import { uploadFileToR2 } from '@/lib/r2';

// Upload a file with auto-generated filename
const url = await uploadFileToR2(file, 'images');

// Upload a file with custom filename
const url = await uploadFileToR2(file, 'avatars', 'user-123');
```

### Upload Base64 Image (API Routes)

```typescript
import { uploadBase64ImageToR2 } from '@/lib/r2';

// From API route
const imageUrl = await uploadBase64ImageToR2(
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...',
  'profile-pics',
  'user-456'
);
```

### Upload JSON Metadata

```typescript
import { uploadMetadataToR2 } from '@/lib/r2';

const metadata = {
  name: 'My Token',
  symbol: 'MTK',
  description: 'A sample token',
};

const metadataUrl = await uploadMetadataToR2(metadata, 'metadata', 'token-123');
```

### Upload Raw Buffer

```typescript
import { uploadToR2 } from '@/lib/r2';

const buffer = Buffer.from('Hello World');
await uploadToR2(buffer, 'text/plain', 'files/hello.txt');
```

## File Organization

The library organizes files in folders:

- `images/` - For general images
- `metadata/` - For JSON metadata files
- `profile-pics/` - For user profile pictures
- `avatars/` - For user avatars
- Custom folder paths as needed

## Error Handling

All functions throw errors on failure, so wrap them in try-catch blocks:

```typescript
try {
  const url = await uploadFileToR2(file, 'images');
  console.log('Upload successful:', url);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

## Available Functions

- `uploadFileToR2(file, folderPath, customFileName?)` - Upload File object
- `uploadBase64ImageToR2(base64Data, folderPath, customFileName?)` - Upload base64 image
- `uploadMetadataToR2(metadata, folderPath, fileName)` - Upload JSON metadata
- `uploadToR2(buffer, contentType, fileName)` - Upload raw buffer

## Constants

- `PUBLIC_R2_URL` - Public URL for accessing uploaded files
- `R2_BUCKET` - Bucket name (for advanced usage)
