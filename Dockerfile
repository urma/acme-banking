FROM node:alpine

ARG token

USER node:node
WORKDIR /home/node
EXPOSE 3000/tcp

COPY --chown=node:node [ ".", "/home/node/" ]

RUN npm install --only=production

# HACK: Aqua microscanner needs to be run as root
USER root
ADD https://get.aquasec.com/microscanner .
RUN chmod +x microscanner
RUN apk add --no-cache ca-certificates && \
  update-ca-certificates && \
  ./microscanner ${token} && \
  rm microscanner

USER node:node

CMD [ "npm", "start" ]
