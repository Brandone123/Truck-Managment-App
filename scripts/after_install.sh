#!/bin/bash
sudo rsync --archive --verbose --recursive /var/www/html/sources/moonstar-tms/ /var/www/html/web-apps/moonstar-tms/

#################### Non Prod ##############################3
# Build Nuxt SSR for Production Environment
sudo cd /var/www/html/web-apps/moonstar-tms/
sudo rm -rf .nuxt
sudo rm -rf node_modules
sudo npm install 
sudo npx nuxi generate
pm2 start
pm2 save
#################### Update File Permission #######################

sudo chmod -R 2775 /var/www/html/

sudo chown ubuntu:www-data -R /var/www/html/web-apps/

sudo rm -rf /var/www/html/sources/moonstar-tms/