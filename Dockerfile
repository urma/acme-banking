FROM node:alpine

USER node:node
WORKDIR /home/node
EXPOSE 3000/tcp

COPY --chown=node:node [ ".", "/home/node/" ]

RUN npm install && \
    node /home/node/bin/bootstrap-db.js

CMD [ "npm", "start" ]
