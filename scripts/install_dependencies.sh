#!/bin/bash
if [ -d /var/www/html/app-deploy/dev/ ]; then
    rm -rf /var/www/html/app-deploy/dev/
fi
mkdir -vp /var/www/html/app-deploy/dev/

if ! [ -d /var/www/html/dev/ ]; then
    mkdir -vp /var/www/html/dev/
fi

if ! [ -d /var/www/html/dev/moonstar-tms/ ]; then
    mkdir -vp /var/www/html/dev/moonstar-tms/
fi