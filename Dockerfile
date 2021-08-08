###
# Builder stage
FROM node:8 AS builder
WORKDIR /usr/src/app

# Install dependencies
COPY ./package*.json ./
COPY ./bower.json ./
RUN npm install
RUN npm run post-install -- --allow-root

# Copy local code to the container image and build the app
COPY . .
RUN npm run build

# Remove devDependencies
RUN npm prune --production

###
# Production stage
FROM node:8-alpine
WORKDIR /usr/src/app

# Copy the built application to this image
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY ./app.js ./

# Workaround as the build is not working as expected
COPY --from=builder /usr/src/app/src ./src

# Run the application
CMD [ "node", "app.js" ]
