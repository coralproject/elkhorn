FROM node:slim
RUN mkdir -p /usr/src/app && \
    apt-get update && \
    apt-get install -y bzip2 --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
ADD . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
RUN npm install pm2 -g

EXPOSE 4444
CMD [ "npm", "run", "server" ]
CMD [ "pm2", "start", "server/index.js" ]
