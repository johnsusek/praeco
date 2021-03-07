# Checklist for new prod release

## Elastalert (if neccessary)

- Stash all changes in elastalert-server project
- `nvm use "$(cat .nvmrc)"`
- `npm run precommit`
- `make build v=master`
- `docker tag <image> praecoapp/elastalert-server:<yyyymmdd>`
- `docker push praecoapp/elastalert-server`

## Praeco

- `nvm use "$(cat .nvmrc)"`
- `./run_tests.sh`
- Bump version number in package.json, if not already done
- Push to master
- `docker build . -t praecoapp/praeco`
- `docker tag <image> praecoapp/praeco:<version>`
- `docker push praecoapp/praeco`
- Tag release in github, add release notes
