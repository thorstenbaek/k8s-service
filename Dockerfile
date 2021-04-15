FROM node:14-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 80

ENV TZ=Europe/Oslo
ENV IN_CONTAINER=1
ENV ManifestTemplateURL=https://raw.githubusercontent.com/thorstenbaek/k8sSandBox/master/helm/SandBox/sandbox.release.yaml
ENV TARGET_DOMAIN=localhost

CMD [ "node", "index.js" ]
