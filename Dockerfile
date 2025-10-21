FROM node:18-alpine

# Small helper to reap processes (optional but useful)
RUN apk add --no-cache dumb-init

WORKDIR /usr/src/app

# Install dependencies (use npm ci for reproducible installs)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Ensure local node_modules bin is on PATH for tools (like vite, next, etc.)
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV NODE_ENV=development

# Expose a common dev port — adjust if your dev server uses a different port
EXPOSE 3003

# Default command: run the project's dev script
CMD ["npm", "run", "dev"]
