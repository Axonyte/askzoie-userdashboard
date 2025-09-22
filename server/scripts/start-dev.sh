#!/bin/sh

# Exit on any error
set -e

echo "Starting database migration..."
npx prisma db push

echo "Starting NestJS development server..."
npm run start:dev
