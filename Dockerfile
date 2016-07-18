FROM node:slim
RUN mkdir -p /usr/src/app && \
    apt-get update && \
    apt-get install -y bzip2 wget --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
ADD . /usr/src/app
WORKDIR /usr/src/app
RUN npm install && \
	npm install pm2 -g

ENV DOCKERIZE_VERSION v0.2.0
RUN wget -q https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm -f dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

EXPOSE 4444
CMD [ "dockerize",  "npm", "config", "set", "strict-ssl", "false" ]
CMD [ "dockerize",  "npm", "run", "server" ]
