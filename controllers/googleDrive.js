import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';

// Define the required scopes for the Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Load the client secrets from a local file
export const authorize = (credentials, callback, file) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token
  const tokenPath = path.join(__dirname, 'token.json');
  fs.readFile(tokenPath, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback, file);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, file);
  });
};

const getNewToken = (oAuth2Client, callback, file) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this URL:', authUrl);

  // Here, you would typically have a process to retrieve the authorization code and exchange it for a token.
  // For now, we assume you manually obtain the token and store it.

  // After getting the token, store it for later use
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    oAuth2Client.setCredentials(token);

    // Store the token to disk for later program executions
    const tokenPath = path.join(__dirname, 'token.json');
    fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
      if (err) console.error(err);
      console.log('Token stored to', tokenPath);
    });

    callback(oAuth2Client, file);
  });
};

// Upload a file to Google Drive
export const uploadZipToDrive = (auth, file) => {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: file.originalname,
    mimeType: file.mimetype,
  };
  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: 'id',
    },
    (err, file) => {
      if (err) {
        // Handle error
        console.error('Error uploading file:', err);
      } else {
        console.log('File uploaded successfully, File ID:', file.data.id);
      }
    }
  );
};
