FROM node:alpine

USER node:node
WORKDIR /home/node
EXPOSE 3000/tcp

COPY --chown=node:node [ ".", "/home/node/" ]

RUN npm install --production

CMD [ "npm", "start" ]
