import { Storage, StorageOptions } from '@google-cloud/storage';
import fs from 'fs';

let storage: Storage | null = null;

export function getStorage(): Storage {
  if (!storage) {
    const credentialsEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    let credentials;

    if (credentialsEnv) {
      try {
        // First, try to parse it as JSON
        credentials = JSON.parse(credentialsEnv);
      } catch (error) {
        // If parsing fails, assume it's a file path and read the file
        try {
          const credentialsFile = fs.readFileSync(credentialsEnv, 'utf8');
          credentials = JSON.parse(credentialsFile);
        } catch (fileError) {
          console.error('Error reading credentials file:', fileError);
          throw new Error('Invalid GOOGLE_APPLICATION_CREDENTIALS');
        }
      }
    } else {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not set');
    }

    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    });
  }
  return storage;
}
