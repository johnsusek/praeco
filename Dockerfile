FROM node:lts AS base
ARG LABEL_COMMIT=unknown
ARG LABEL_COMMIT_LINK=unknown
ARG LABEL_COMMIT_BRANCH=unknown
ARG LABEL_REPO=unkown
ARG LABEL_REPO_LINK=unknown
ARG LABEL_PROJECT_NAME=unknown
ARG LABEL_BUILD_CREATED=unknown

LABEL "commit"="${LABEL_COMMIT}" \
  "commit_link"="${LABEL_COMMIT_LINK}" \
  "commit_branch"="${LABEL_COMMIT_BRANCH}" \
  "repo"="${LABEL_REPO}" \
  "repo_link"="${LABEL_REPO_LINK}" \
  "project_name"="${LABEL_PROJECT_NAME}" \
  "build_created"="${LABEL_BUILD_CREATED}" \
  "maintainer"="ServerCentral"
RUN apt-get update
RUN apt-get install -y nginx

RUN mkdir -p /tmp/nginx/praeco
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/www/html
RUN chown www-data:www-data /var/www/html
WORKDIR /tmp/nginx/praeco
COPY package.json .

FROM base AS dependencies
RUN npm install --loglevel error

FROM base AS release
COPY --from=dependencies /tmp/nginx/praeco/node_modules ./node_modules
COPY . .

RUN npm run build
RUN cp -r dist/* /var/www/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
