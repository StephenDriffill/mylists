# base node image
FROM node:18.18.2-bookworm-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json package-lock.json .npmrc ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json package-lock.json .npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

# Disable Prisma ERD generation
ENV DISABLE_ERD=true

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json package-lock.json .npmrc ./

# Generate the prisma client
ADD prisma .
RUN npm run generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public

# required to run prisma migrations and seed
COPY --from=build /myapp/prisma /myapp/prisma
COPY --from=build /myapp/tsconfig.json /myapp/tsconfig.json
COPY --from=build /myapp/scripts/start.sh /myapp/scripts/start.sh

ADD . .

CMD ["./scripts/start.sh"]
