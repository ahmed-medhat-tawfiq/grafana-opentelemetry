# Use the official Node.js 16 image as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install any dependencies
RUN npm install

# If you're using Nodemon for development
RUN npm install --global nodemon

# Bundle your app's source code inside the Docker image
COPY . .

# Make port available to the world outside this container
EXPOSE 3000

# Run the app using nodemon
CMD [ "nodemon", "-r", "./tracing.js", "index.js" ]
