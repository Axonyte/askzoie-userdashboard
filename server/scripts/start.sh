#!/bin/sh

# Exit on any error
set -e

echo "Starting database migration..."
npx prisma db push

echo "Starting NestJS server..."
npm run start:prod
