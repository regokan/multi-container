# Pulling official base image
FROM node:14.7.0-alpine3.10 as base

# Setting working directory
WORKDIR /app

# Copying package.json
COPY package.json ./

# Installing app
RUN npm install

# Copying all the files
COPY . ./

# Starting app
RUN npm run build

FROM nginx:1.19.1-alpine
# COPY ./default.conf ./etc/nginx/conf.d/defaut.conf
COPY --from=base /app/build /usr/share/nginx/html
COPY ./nginx/default.conf etc/nginx/conf.d/default.conf
EXPOSE 3000
