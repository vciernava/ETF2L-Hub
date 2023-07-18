FROM node:18
# Env
ENV TIME_ZONE=Europe/Prague
ENV ENV_NAME dev
ENV EGG_SERVER_ENV dev
ENV NODE_ENV dev
ENV NODE_CONFIG_ENV dev
# Create Directory for the Container
WORKDIR /usr/quinto
# Only copy the package.json file to work directory
COPY package.json .
# Install typescript Package
RUN npm install typescript -g
# Install all packages
RUN npm install
# Copy all other source code to work directory
ADD . /usr/quinto
# Start
CMD [ "npm", "start" ]
EXPOSE 3333
