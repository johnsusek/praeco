# Checklist for new prod release

## ElastAlert Server (if neccessary)

- Stash all changes in elastalert-server project
- `nvm use "$(cat .nvmrc)"`
- `npm install`
- `npm run lint:fix`
- `make build v=<elastalert2 version>`
- `docker tag <image> praecoapp/elastalert-server:<yyyymmdd>`
- `docker push praecoapp/elastalert-server:latest`
- `docker push praecoapp/elastalert-server:<yyyymmdd>`

## Praeco

- `nvm use "$(cat .nvmrc)"`
- `npm install --legacy-peer-deps`
- `npm run lint:fix`
- `./run_tests.sh`
- Bump version number in package.json, if not already done
- Push to master
- `docker build . -t praecoapp/praeco`
- `docker tag <image> praecoapp/praeco:<version>`
- `docker push praecoapp/praeco:latest`
- `docker push praecoapp/praeco:<version>`
- Tag release in github, add release notes
