FROM node

# Install Dockerize
ADD https://github.com/jwilder/dockerize/releases/download/v0.2.0/dockerize-linux-amd64-v0.2.0.tar.gz /tmp/dockerize.tar.gz
RUN tar -C /usr/local/bin -xzvf /tmp/dockerize.tar.gz \
    && rm -f /tmp/dockerize.tar.gz

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Setup the environment
EXPOSE 4444

# Bundle app source
COPY . /usr/src/app
COPY /assets /assets

CMD [ "dockerize", "-template", "/assets/config.json.tmpl:/usr/src/app/config.json",  "npm", "start", "server" ]
