#!/usr/bin/env sh

export DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

npm run migrate:reset
npm run start