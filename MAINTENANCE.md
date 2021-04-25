# Checklist for new prod release

## ElastAlert Server (if neccessary)

- Stash all changes in elastalert-server project
- `nvm use "$(cat .nvmrc)"`
- `npm run precommit`
- `make build v=<elastalert2 version>`
- `docker build -t praecoapp/elastalert-server:<yyyymmdd>_es6 -f Dockerfile-es6 .`
- `docker tag <image> praecoapp/elastalert-server:<yyyymmdd>`
- `docker push praecoapp/elastalert-server:latest`
- `docker push praecoapp/elastalert-server:<yyyymmdd>`
- `docker push praecoapp/elastalert-server:<yyyymmdd>_es6`

## Praeco

- `nvm use "$(cat .nvmrc)"`
- `./run_tests.sh`
- Bump version number in package.json, if not already done
- Push to master
- `docker build . -t praecoapp/praeco`
- `docker tag <image> praecoapp/praeco:<version>`
- `docker push praecoapp/praeco:latest`
- `docker push praecoapp/praeco:<version>`
- Tag release in github, add release notes
