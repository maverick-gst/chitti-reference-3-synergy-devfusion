import { Storage } from '@google-cloud/storage';
import { getStorage } from './gcsClient';

// List buckets in the project
export async function listBuckets(): Promise<string[]> {
  const storage = getStorage();
  const [buckets] = await storage.getBuckets();
  const bucketNames = buckets.map(bucket => bucket.name);
  console.log('Buckets:', bucketNames);
  return bucketNames;
}

// Create (Upload) a file to Google Cloud Storage
export async function uploadFile(bucketName: string, fileName: string, fileContent: Buffer | string): Promise<void> {
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  await file.save(fileContent);
  console.log(`File ${fileName} uploaded to ${bucketName}`);
}

// Read (Download) a file from Google Cloud Storage
export async function downloadFile(bucketName: string, fileName: string): Promise<Buffer> {
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const [fileContent] = await file.download();
  console.log(`File ${fileName} downloaded from ${bucketName}`);
  return fileContent;
}

// Update (Replace) a file in Google Cloud Storage
export async function updateFile(bucketName: string, fileName: string, newContent: Buffer | string): Promise<void> {
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  await file.save(newContent);
  console.log(`File ${fileName} updated in ${bucketName}`);
}

// Delete a file from Google Cloud Storage
export async function deleteFile(bucketName: string, fileName: string): Promise<void> {
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  await file.delete();
  console.log(`File ${fileName} deleted from ${bucketName}`);
}

// List files in a Google Cloud Storage bucket
export async function listFiles(bucketName: string): Promise<string[]> {
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  const [files] = await bucket.getFiles();

  const fileNames = files.map(file => file.name);
  console.log(`Files in ${bucketName}:`, fileNames);
  return fileNames;
}

// Check if a file exists in Google Cloud Storage
export async function fileExists(bucketName: string, fileName: string): Promise<boolean> {
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const [exists] = await file.exists();
  console.log(`File ${fileName} exists in ${bucketName}: ${exists}`);
  return exists;
}

// Generate a pre-signed URL for uploading
export async function generateUploadUrl(bucketName: string, fileName: string, contentType: string, expirationMinutes: number = 15): Promise<string> {
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + expirationMinutes * 60 * 1000, // Convert minutes to milliseconds
    contentType: contentType,
  });

  console.log(`Generated upload URL for ${fileName} in ${bucketName}`);
  return url;
}

export async function getFileMetadata(bucketName: string, fileName: string): Promise<{
  size: number;
  contentType: string;
  updated: string;
}> {
  const storage = getStorage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const [metadata] = await file.getMetadata();

  return {
    size: metadata.size as number,
    contentType: metadata.contentType as string,
    updated: metadata.updated as string,
  };
}
