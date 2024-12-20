# Step 1: Build the Vite app
FROM node:16 AS build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 4173

# Build the app for production
RUN npm run build

RUN chmod a+x ./scripts/entrypoint.sh

ENTRYPOINT ["./scripts/entrypoint.sh"]
