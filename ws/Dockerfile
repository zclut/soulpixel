FROM node:23-slim

# Create app directory
WORKDIR /usrapp

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY index.js .

EXPOSE 3000

CMD [ "node", "index.js" ]