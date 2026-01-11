/**
 * S3 Service - S3-compatible storage using MinIO or AWS S3
 * 
 * Handles file upload, download, and delete operations
 * Falls back to local storage if S3 is not available
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as path from 'path';
import * as fs from 'fs';
import { Readable } from 'stream';

// S3 Configuration from environment variables
interface S3Config {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
  useSSL: boolean;
}

function getS3Config(): S3Config {
  return {
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin123',
    bucket: process.env.S3_BUCKET || 'uploads',
    region: process.env.S3_REGION || 'us-east-1',
    useSSL: process.env.S3_USE_SSL === 'true'
  };
}

// Lazy initialization of S3 client
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    const config = getS3Config();
    s3Client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      },
      forcePathStyle: true // Required for MinIO
    });
  }
  return s3Client;
}

/**
 * Check if S3 is configured and available
 * IMPORTANT: Returns FALSE if S3_ENDPOINT is not explicitly set!
 */
export async function isS3Available(): Promise<boolean> {
  // CRITICAL: S3_ENDPOINT must be explicitly set and non-empty
  const endpoint = process.env.S3_ENDPOINT;
  
  if (!endpoint || endpoint.trim() === '') {
    console.log('📁 S3_ENDPOINT not configured - using local storage');
    return false;
  }
  
  console.log(`🔍 Checking S3 availability at: ${endpoint}`);
  
  try {
    const config = getS3Config();
    const client = getS3Client();
    
    // Try to access the bucket
    await client.send(new HeadBucketCommand({ Bucket: config.bucket }));
    console.log('✅ S3 connection successful');
    return true;
  } catch (err: any) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      // Bucket doesn't exist, try to create it
      try {
        const config = getS3Config();
        await getS3Client().send(new CreateBucketCommand({ Bucket: config.bucket }));
        console.log(`✅ Created S3 bucket: ${config.bucket}`);
        return true;
      } catch (createErr) {
        console.error('❌ Failed to create S3 bucket:', createErr);
        return false;
      }
    }
    console.error('❌ S3 connection check failed:', err.message || err);
    console.log('📁 Falling back to local storage');
    return false;
  }
}

/**
 * Upload a file buffer to S3
 * @param buffer - File buffer to upload
 * @param filename - Name for the file
 * @param contentType - MIME type of the file
 * @returns Unique filename in S3
 */
export async function uploadToS3(buffer: Buffer, filename: string, contentType?: string): Promise<string> {
  const config = getS3Config();
  const client = getS3Client();
  
  // Generate unique filename
  const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${filename}`;
  
  await client.send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: uniqueFilename,
    Body: buffer,
    ContentType: contentType || 'application/octet-stream'
  }));
  
  console.log(`File uploaded to S3: ${uniqueFilename}`);
  return uniqueFilename;
}

/**
 * Download a file from S3
 * @param filename - Name of the file in S3
 * @returns File buffer
 */
export async function downloadFromS3(filename: string): Promise<Buffer> {
  const config = getS3Config();
  const client = getS3Client();
  
  const response = await client.send(new GetObjectCommand({
    Bucket: config.bucket,
    Key: filename
  }));
  
  // Convert readable stream to buffer
  const stream = response.Body as Readable;
  const chunks: Buffer[] = [];
  
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

/**
 * Delete a file from S3
 * @param filename - Name of the file to delete
 */
export async function deleteFromS3(filename: string): Promise<void> {
  const config = getS3Config();
  const client = getS3Client();
  
  await client.send(new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: filename
  }));
  
  console.log(`File deleted from S3: ${filename}`);
}

/**
 * Get a presigned URL for file download (browser-accessible)
 * @param filename - Name of the file
 * @param expiresIn - URL expiration in seconds (default: 3600 = 1 hour)
 * @returns Presigned URL
 */
export async function getPresignedUrl(filename: string, expiresIn: number = 3600): Promise<string> {
  const config = getS3Config();
  
  // CRITICAL FIX: Use localhost endpoint for browser-accessible URLs
  // Docker internal endpoint (minio:9000) won't work from browser
  const browserEndpoint = process.env.S3_BROWSER_ENDPOINT || 'http://localhost:9000';
  
  console.log(`🔗 Generating presigned URL with browser endpoint: ${browserEndpoint}`);
  
  // Create a separate client for browser-accessible URLs
  const browserClient = new S3Client({
    endpoint: browserEndpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    },
    forcePathStyle: true
  });
  
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: filename
  });
  
  const signedUrl = await getSignedUrl(browserClient, command, { expiresIn });
  console.log(`✅ Presigned URL generated: ${signedUrl.substring(0, 50)}...`);
  
  return signedUrl;
}

/**
 * Get the public URL for a file (through API)
 */
export function getFileUrl(filename: string): string {
  return `/api/uploads/download/${filename}`;
}

export default {
  isS3Available,
  uploadToS3,
  downloadFromS3,
  deleteFromS3,
  getPresignedUrl,
  getFileUrl
};
