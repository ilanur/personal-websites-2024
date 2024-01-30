#Dockerfile

# Use this image as the platform to build the app
FROM node:18-alpine AS eui-intranet-2024

# A small line inside the image to show who made it
LABEL Developers="Emanuele Strano"

ENV SECRET_CLIENT_ID="76c6f434-40c7-418f-ac99-45798540ad25"
ENV SECRET_CLIENT_SECRET="siZ8Q~3UvkNRXnHqhB6KL4WBDnCw0GU-1UVuTa.n"
ENV SECRET_TENANT_ID="d3f434ee-643c-409f-94aa-6db2f23545ce"
ENV SECRET_AUTH_SECRET="ca0020e632248ebe24b9c812ab14a9bf"
ENV PUBLIC_ALGOLIA_ID = "E2MU8FKW2W"
ENV PUBLIC_ALGOLIA_KEY = "6bc5cd451c16fa8b817e006c63ef660c"
ENV PUBLIC_EUI_WEB = "https://www.eui.eu/"
ENV SECRET_PINECONE_API_KEY="c600cf79-5fac-4acf-a755-e9fe123f55fa"
ENV SECRET_PINECONE_ENVIRONMENT="gcp-starter"
ENV SECRET_PINECONE_INDEX="eui-internal-knowledgebase"
ENV OPENAI_API_KEY="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"

# The WORKDIR instruction sets the working directory for everything that will happen next
WORKDIR /app

# Copy all local files into the image
COPY . .

# Clean install all node modules
RUN npm ci

# Build SvelteKit app
RUN npm run build

# Delete source code files that were used to build the app that are no longer needed
RUN rm -rf src/ static/ docker-compose.yml

# The USER instruction sets the user name to use as the default user for the remainder of the current stage
USER node:node

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["node","build/index.js"]
