# Base image
FROM node:16.18.0

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json yarn.lock ./

# Install app dependencies
RUN yarn install

# run migration
Run yarn migration:run

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN yarn build:prod

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
