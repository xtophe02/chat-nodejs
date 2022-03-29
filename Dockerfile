FROM node:lts-alpine

ENV PORT 7000

# Create app directory
# RUN mkdir -p /usr/src/app
WORKDIR /app

COPY package*.json ./

RUN npm install --only=production 

COPY . /app

EXPOSE 7000

USER node

# Running the app
CMD ["npm", "start"]