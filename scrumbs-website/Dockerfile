# Base image
FROM node:10

# Work directory
WORKDIR /usr/scrumbs

# Install dependencies
COPY ./package*.json ./

RUN npm install

# Copy app source code
COPY ./ ./

# Set environment variables
ENV ENV_DOCKER='true'

ENV DEFAULT_TIMEZONE='Europe/Bucharest'

ENV DATETIME_FORMAT='YYYY-MM-DDTHH:mm:ssZ'
ENV DATE_FORMAT='YYYY-MM-DD'
ENV TIME_FORMAT='HH:mm:ss'

# Start command
CMD [ "npm", "run", "start-server" ]

