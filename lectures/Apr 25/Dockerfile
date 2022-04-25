# Start with a clean docker image that contains node already installed and ready to use
FROM node:16-alpine

# Install a couple of dependencies. 
RUN apk add --no-cache python3 make g++ vim

# Our workdir specifies where in the container our app will live. In this case, a directory called app.
WORKDIR /app

# Copy everything from our OS file system into the container file system
COPY . .

# Install the dependencies
RUN npm install

# Anyone that downloads this container will run npm start upon initialization
CMD ["npm", "start"]

# Expose port 3000 from the container
EXPOSE 3000

