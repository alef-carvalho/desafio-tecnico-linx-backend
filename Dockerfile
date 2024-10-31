#############################################################################################
##                                      BUILD STAGE                                        ##
#############################################################################################
FROM node:20-slim as build

# SET LABELS
LABEL stage="base"
LABEL author="Alef Carvalho <csilva.alef@gmail.com>"

# CHANGE TO APPLICATION DIRECTORY
WORKDIR /app

# COPY APPLICATION FILES
COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node . .

# INSTALL DEPENDENCIES
RUN yarn install

# BUILD APPLICATION
RUN yarn build

#############################################################################################
##                                     DEPLOY STAGE                                        ##
#############################################################################################
FROM node:20-slim as deploy

# SET LABELS
LABEL stage="production"

# CHANGE TO APPLICATION DIRECTORY
WORKDIR /app

# COPY APPLICATION FILES
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/node_modules /app/node_modules

# EXPOSE PORTS
EXPOSE 3000

# START APPLICATION
CMD ["node", "dist/main.js"]
