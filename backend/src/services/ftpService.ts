/**
 * FTP Service - Handles FTP file operations using basic-ftp
 * 
 * This service provides upload, download, and delete functionality
 * for file attachments stored on an FTP server.
 */

import { Client, FTPResponse } from 'basic-ftp';
import * as path from 'path';
import * as fs from 'fs';
import { Readable } from 'stream';

// FTP Configuration from environment variables
interface FTPConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
  remotePath: string;
}

function getFTPConfig(): FTPConfig {
  return {
    host: process.env.FTP_HOST || 'localhost',
    port: parseInt(process.env.FTP_PORT || '21'),
    user: process.env.FTP_USER || 'anonymous',
    password: process.env.FTP_PASSWORD || 'anonymous@',
    secure: process.env.FTP_SECURE === 'true',
    remotePath: process.env.FTP_REMOTE_PATH || '/uploads'
  };
}

/**
 * Create and connect an FTP client
 */
async function getClient(): Promise<Client> {
  const config = getFTPConfig();
  const client = new Client();
  client.ftp.verbose = process.env.FTP_VERBOSE === 'true';
  
  try {
    await client.access({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      secure: config.secure
    });
    
    // Ensure remote directory exists
    await client.ensureDir(config.remotePath);
    
    return client;
  } catch (err) {
    client.close();
    throw err;
  }
}

/**
 * Upload a file buffer to FTP server
 * @param buffer - File buffer to upload
 * @param filename - Name for the file on FTP server
 * @returns Remote file path
 */
export async function uploadToFTP(buffer: Buffer, filename: string): Promise<string> {
  const config = getFTPConfig();
  const client = await getClient();
  
  try {
    // Create a readable stream from buffer
    const stream = Readable.from(buffer);
    
    // Generate unique filename
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${filename}`;
    const remotePath = `${config.remotePath}/${uniqueFilename}`;
    
    // Upload file
    await client.uploadFrom(stream, remotePath);
    
    console.log(`File uploaded to FTP: ${remotePath}`);
    return uniqueFilename;
  } finally {
    client.close();
  }
}

/**
 * Download a file from FTP server
 * @param filename - Name of the file on FTP server
 * @returns File buffer
 */
export async function downloadFromFTP(filename: string): Promise<Buffer> {
  const config = getFTPConfig();
  const client = await getClient();
  
  try {
    const remotePath = `${config.remotePath}/${filename}`;
    
    // Create a temporary file to download to
    const tempPath = path.join('/tmp', `ftp-download-${Date.now()}-${filename}`);
    
    await client.downloadTo(tempPath, remotePath);
    
    // Read the file and delete temp
    const buffer = fs.readFileSync(tempPath);
    fs.unlinkSync(tempPath);
    
    return buffer;
  } finally {
    client.close();
  }
}

/**
 * Delete a file from FTP server
 * @param filename - Name of the file to delete
 */
export async function deleteFromFTP(filename: string): Promise<void> {
  const config = getFTPConfig();
  const client = await getClient();
  
  try {
    const remotePath = `${config.remotePath}/${filename}`;
    await client.remove(remotePath);
    console.log(`File deleted from FTP: ${remotePath}`);
  } finally {
    client.close();
  }
}

/**
 * Check if FTP server is available
 */
export async function checkFTPConnection(): Promise<boolean> {
  const config = getFTPConfig();
  const client = new Client();
  
  try {
    await client.access({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      secure: config.secure
    });
    
    console.log('FTP connection successful');
    return true;
  } catch (err) {
    console.error('FTP connection failed:', err);
    return false;
  } finally {
    client.close();
  }
}

/**
 * List files in FTP directory
 */
export async function listFTPFiles(): Promise<string[]> {
  const config = getFTPConfig();
  const client = await getClient();
  
  try {
    const files = await client.list(config.remotePath);
    return files.map(f => f.name);
  } finally {
    client.close();
  }
}

/**
 * Get the public URL for a file
 * For FTP, this returns the API download endpoint
 */
export function getFileUrl(filename: string): string {
  return `/api/uploads/download/${filename}`;
}

export default {
  uploadToFTP,
  downloadFromFTP,
  deleteFromFTP,
  checkFTPConnection,
  listFTPFiles,
  getFileUrl
};
