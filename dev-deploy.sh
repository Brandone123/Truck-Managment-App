#!/bin/bash

## Delet Existing App Directories
echo "Deleting Existing App Directories"
sudo rm -rf .nuxt

sudo rm -rf .output 

sudo rm -rf node_modules

#Install packages 
echo "NPM Install Packages"
npm install

#Build  packages 
echo "NPM Build App"
npm run build

#Generate App Files  
echo "NPM Generate Static Files"
npm run generate 