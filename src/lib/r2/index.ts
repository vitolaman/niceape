import AWS from 'aws-sdk';

// Public R2 URL (static)
const PUBLIC_R2_URL = 'https://pub-85c7f5f0dc104dc784e656b623d999e5.r2.dev';

// Function to get environment variables (lazy access)
function getR2Config() {
  const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
  const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
  const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
  const R2_BUCKET = process.env.R2_BUCKET;

  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ACCOUNT_ID || !R2_BUCKET) {
    throw new Error(
      'Missing required R2 environment variables: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID, R2_BUCKET'
    );
  }

  return {
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_ACCOUNT_ID,
    R2_BUCKET,
    PRIVATE_R2_URL: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  };
}

// Function to get R2 client (lazy initialization)
function getR2Client() {
  const config = getR2Config();

  return new AWS.S3({
    endpoint: config.PRIVATE_R2_URL,
    accessKeyId: config.R2_ACCESS_KEY_ID,
    secretAccessKey: config.R2_SECRET_ACCESS_KEY,
    region: 'auto',
    signatureVersion: 'v4',
  });
}

/**
 * Upload buffer to R2 storage
 */
export async function uploadToR2(
  fileBuffer: Buffer,
  contentType: string,
  fileName: string
): Promise<AWS.S3.PutObjectOutput> {
  const r2 = getR2Client();
  const config = getR2Config();

  return new Promise((resolve, reject) => {
    r2.putObject(
      {
        Bucket: config.R2_BUCKET,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

/**
 * Upload file to R2 cloud storage and return public URL
 */
export async function uploadFileToR2(
  file: File,
  folderPath: string,
  customFileName?: string
): Promise<string> {
  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  // Get file extension
  const fileExtension = file.name.split('.').pop() || 'jpg';

  // Generate filename
  const fileName = customFileName
    ? `${folderPath}/${customFileName}.${fileExtension}`
    : `${folderPath}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  try {
    await uploadToR2(fileBuffer, file.type, fileName);
    return `${PUBLIC_R2_URL}/${fileName}`;
  } catch (error) {
    console.error(`Error uploading file to ${folderPath}:`, error);
    throw new Error(`Failed to upload file to ${folderPath}`);
  }
}

/**
 * Upload base64 image to R2 (useful for API routes)
 */
export async function uploadBase64ImageToR2(
  base64Data: string,
  folderPath: string,
  customFileName?: string
): Promise<string> {
  const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image format');
  }

  const [, contentType, base64Content] = matches;
  const fileBuffer = Buffer.from(base64Content, 'base64');
  const fileExtension = contentType.split('/')[1];

  // Generate filename
  const fileName = customFileName
    ? `${folderPath}/${customFileName}.${fileExtension}`
    : `${folderPath}/${Date.now()}.${fileExtension}`;

  try {
    await uploadToR2(fileBuffer, contentType, fileName);
    return `${PUBLIC_R2_URL}/${fileName}`;
  } catch (error) {
    console.error(`Error uploading base64 image to ${folderPath}:`, error);
    throw new Error(`Failed to upload base64 image to ${folderPath}`);
  }
}

/**
 * Upload JSON metadata to R2
 */
export async function uploadMetadataToR2(
  metadata: Record<string, any>,
  folderPath: string,
  fileName: string
): Promise<string> {
  const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2));
  const fullFileName = `${folderPath}/${fileName}.json`;

  try {
    await uploadToR2(metadataBuffer, 'application/json', fullFileName);
    return `${PUBLIC_R2_URL}/${fullFileName}`;
  } catch (error) {
    console.error(`Error uploading metadata to ${folderPath}:`, error);
    throw new Error(`Failed to upload metadata to ${folderPath}`);
  }
}

// Export constants and functions for external use
export { PUBLIC_R2_URL };

// Export function to get R2 bucket name
export function getR2Bucket(): string {
  const config = getR2Config();
  return config.R2_BUCKET;
}
