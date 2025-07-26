import { Env } from '../types';

// Public R2 URLs based on environment
function getPublicR2URL(env?: Env): string {
  const isDevelopment = env?.ENVIRONMENT === 'development';
  return isDevelopment ? 'https://r2-storage-dev.niceape.app' : 'https://r2-storage.niceape.app';
}

/**
 * Upload base64 image to R2 using Cloudflare Worker R2 bindings
 */
export async function uploadBase64ImageToR2(
  base64Data: string,
  folderPath: string,
  customFileName?: string,
  env?: Env
): Promise<string> {
  if (!env?.R2_BUCKET) {
    throw new Error('R2_BUCKET binding not available');
  }

  const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image format');
  }

  const [, contentType, base64Content] = matches;
  const fileBuffer = Uint8Array.from(atob(base64Content), (c) => c.charCodeAt(0));
  const fileExtension = contentType.split('/')[1];

  // Generate filename
  const fileName = customFileName
    ? `${folderPath}/${customFileName}.${fileExtension}`
    : `${folderPath}/${Date.now()}.${fileExtension}`;

  try {
    await env.R2_BUCKET.put(fileName, fileBuffer, {
      httpMetadata: {
        contentType: contentType,
      },
    });

    return `${getPublicR2URL(env)}/${fileName}`;
  } catch (error) {
    console.error(`Error uploading base64 image to ${folderPath}:`, error);
    throw new Error(`Failed to upload base64 image to ${folderPath}`);
  }
}

/**
 * Upload JSON metadata to R2 using Cloudflare Worker R2 bindings
 */
export async function uploadMetadataToR2(
  metadata: Record<string, any>,
  folderPath: string,
  fileName: string,
  env?: Env
): Promise<string> {
  if (!env?.R2_BUCKET) {
    throw new Error('R2_BUCKET binding not available');
  }

  const metadataString = JSON.stringify(metadata, null, 2);
  const fullFileName = `${folderPath}/${fileName}.json`;

  try {
    await env.R2_BUCKET.put(fullFileName, metadataString, {
      httpMetadata: {
        contentType: 'application/json',
      },
    });

    return `${getPublicR2URL(env)}/${fullFileName}`;
  } catch (error) {
    console.error(`Error uploading metadata to ${folderPath}:`, error);
    throw new Error(`Failed to upload metadata to ${folderPath}`);
  }
}

/**
 * Upload buffer to R2 using Cloudflare Worker R2 bindings
 */
export async function uploadToR2(
  data: string | ArrayBuffer | Uint8Array,
  fileName: string,
  contentType: string,
  env: Env
): Promise<string> {
  if (!env.R2_BUCKET) {
    throw new Error('R2_BUCKET binding not available');
  }

  try {
    await env.R2_BUCKET.put(fileName, data, {
      httpMetadata: {
        contentType: contentType,
      },
    });

    return `${getPublicR2URL(env)}/${fileName}`;
  } catch (error) {
    console.error(`Error uploading to R2:`, error);
    throw new Error(`Failed to upload to R2`);
  }
}

// Export function to get R2 URL based on environment
export { getPublicR2URL };
