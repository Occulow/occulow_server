#!/bin/bash

# Copy prod settings
cp occulow_server/settings.prod.py occulow_server/settings.py

# Build occulow js
cd occulow/
npm run build
cd ..

# Collect static files
python manage.py collectstatic --no-input

# Restart apache
sudo systemctl restart apache2
