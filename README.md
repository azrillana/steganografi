# Install Stegano NodeJS Application Non Container

## Install NPM
### Linux
1. Install `npm` with this command :
   ```sh
   sudo apt install npm

### Windows
1. Install `npm` with this link :
   ```sh
   `https://nodejs.org/dist/v20.13.1/node-v20.13.1-x64.msi`

Reference tutorial install link : `https://phoenixnap.com/kb/install-node-js-npm-on-windows`

## Install ffmpeg
### Linux
2. Install `ffmpeg` with this command :
   ```sh
   sudo apt install ffmpeg

### Windows
2. Download Package `ffmpeg` with this link :
   ```sh
   https://ffmpeg.org/download.html

## Install Required NodeJS Package

3. Run this command for Linux & Windows :
   ```sh
   npm install express multer fluent-ffmpeg

## Start The Server

4. Run this command for Linux & Windows :
   ```sh
   node server.js


# Install Stegano NodeJS Application Docker Container

## Modify & Adjust For Domain In docker-compose File
1. Edit with this command :
   ```sh
   vi docker-compose.yaml

## Start The Container
2. Run this command :
   ```sh
   docker compose up -d
