# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Define environment variables
ENV DB_URI = "mongodb+srv://adnandzindo1507:VffPpplYzi4fGBlz@listifycluster.wtscpza.mongodb.net/?retryWrites=true&w=majority"

# Command to run your application
CMD ["node", "index.js"]