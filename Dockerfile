FROM node:20-alpine
# RUN apt-get -y update
# && apt-get install -y default-jdk
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
COPY  ./ ./

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn

#SHELL ["/bin/bash", "-c"]
#RUN source set_vars.sh

# ENV NODE_ENV production
RUN npm install -g @babel/core @babel/cli @babel/preset-env @babel/node nodemon
RUN npm install -g nestjs
RUN npm install
RUN npm install pm2 -g

RUN npm run build
CMD [ "pm2-runtime", "start", "pm2/pm2.json" ]
