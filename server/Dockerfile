FROM node:alpine

RUN apk add --no-cache --update curl bash
#Specify a working directory
WORKDIR /usr/app

#Arguments
ARG NODE_ENV=development
ARG SERVER_PORT=8081
ARG CLIENT_PORT=3000
ARG SERVER_HOST_ADDRESS=localhost 
ARG CLIENT_HOST_ADDRESS=localhost 
ARG CLIENT_ID
ARG CLIENT_SECRET
ARG SESS_SECRET

#Environment variables
ENV SERVER_HOST_ADDRESS=${SERVER_HOST_ADDRESS}
ENV CLIENT_HOST_ADDRESS=${CLIENT_HOST_ADDRESS}
ENV REDIRECT_URI=http://${SERVER_HOST_ADDRESS}:${SERVER_PORT}/auth/reddit/callback
ENV SERVER_PORT=${SERVER_PORT}
ENV CLIENT_PORT=${CLIENT_PORT}
ENV REDIRECT_URI=${REDIRECT_URI}
ENV CLIENT_ID=${CLIENT_ID}
ENV CLIENT_SECRET=${CLIENT_SECRET}

#Copy the dependencies file
COPY ./package* ./

#Install dependencies
RUN npm install 

#Copy remaining files
COPY ./ ./

EXPOSE $PORT

#Default command
CMD ["npm", "run", "start"]