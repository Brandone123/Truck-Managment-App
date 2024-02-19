#!/bin/bash
if [ -d /var/www/html/app-deploy/non-prod/lms-student/ ]; then
    rm -rf /var/www/html/app-deploy/non-prod/lms-student/
fi
mkdir -vp /var/www/html/app-deploy/non-prod/lms-student

if ! [ -d /var/www/html/web-apps/non-prod/ ]; then
    mkdir -vp /var/www/html/web-apps/non-prod
fi

if ! [ -d /var/www/html/web-apps/non-prod/lms-student-qa/ ]; then
    mkdir -vp /var/www/html/web-apps/non-prod/lms-student-qa
fi

if ! [ -d /var/www/html/app-deploy/logs/non-prod/ ]; then
    mkdir -vp /var/www/html/app-deploy/logs/non-prod
fi

