#  -------- Builder --------
FROM node:18-alpine as builder

# Install dependencies
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install 

# Copy project
COPY . .
RUN npm run build

# -------- END builder --------
FROM rust:1.64-alpine3.16

# Install Rust, Cargo and Git
RUN apk add --update nodejs npm git

# Copy files
WORKDIR /app
COPY --from=builder /dist /app
COPY --from=builder /package-lock.json /app
COPY --from=builder /package.json /app

# Dependencies
RUN npm install

# Execute
CMD npm run start:prod

# Port exposing
EXPOSE 3000