ARG app_base=node:18-alpine
ARG builder_base=node:18
# registry url supplied with `docker build --build-args builder_image=$BUILDER_IMAGE` 
ARG builder_image
FROM ${builder_base} AS prepare

# # The following prevents errors when cwebp is installing.
RUN apt-get -qq update && apt-get -qq -y install libglu1

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --loglevel error --cache ./cache
# RUN yarn install --silent --non-interactive --prefer-offline --cache-folder ./cache

# The builder image will be built targeting the "prepare" alias
# so we can prepare a cacheable build environment for the final build
# everything up to here will be tagged and pushed with the builder image

# The next stage will be run in the final build and will not be pushed 
# with the builder or app images
FROM ${builder_image} AS build
COPY ./ ./
RUN npm run build

FROM ${app_base} AS final
COPY manifest.json /
WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN npm config set cache .cache && npm install --production --loglevel error && npm cache clean --force
# RUN yarn config set cache-folder .cache && yarn install --production --link-duplicates --silent --non-interactive --prefer-offline && yarn cache clean
COPY .env* ./
# COPY webpack/define-config.js ./webpack/
COPY --from=build /usr/src/app/dist dist

# Start the server with launcher.js using docker environment variables. This is the preferred startup method when created via Blocks.
# If launcher.js cannot find an existing start script, it will generate one to start the server based on the supplied args
ENTRYPOINT node --max-http-header-size=800000 build/index.js --alias=$alias --projectId=$projectId --accessToken=$accessToken

EXPOSE 3001