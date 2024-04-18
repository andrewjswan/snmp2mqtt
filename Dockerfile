FROM node:lts-alpine3.15 AS base
FROM base as builder

WORKDIR /app

COPY package.json /app
COPY tsconfig.json /app
COPY yarn.lock /app
COPY src /app/src

RUN yarn install --frozen-lockfile
RUN yarn build

RUN mv /app/node_modules /app/node_modules_dev
RUN yarn install --frozen-lockfile --production

FROM base
STOPSIGNAL SIGINT
WORKDIR /app

# Add Label
LABEL \
  description="Expose SNMP sensors to MQTT" \
  maintainer="Andrew J.Swan" \
  org.opencontainers.image.title=snmp2mqtt \
  org.opencontainers.image.description="Expose SNMP sensors to MQTT"

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

CMD [ "node", "/app/dist/index.js" ]
