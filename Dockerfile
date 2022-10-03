#  -------- Builder --------
FROM node:18-alpine as builder

# Install dependencies
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install --frozen-lockfile

# Copy project
COPY . .
RUN yarn build

# -------- END builder --------
FROM cimg/rust:1.45-node

# Copy files
WORKDIR /app
COPY --from=builder /dist /app
COPY --from=builder /yarn.lock /app
COPY --from=builder /package.json /app

# Dependencies
RUN yarn install --frozen-lockfile

# Execute
CMD yarn start:prod

# Port exposing
EXPOSE 3000