FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle source code
COPY . .

# Build the app
RUN npm run build

# Expose the port the app listens on
EXPOSE 3400

# Start the app
CMD [ "npm", "start" ]