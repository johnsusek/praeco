# Checklist for new prod release

## Elastalert (if neccessary)

- Stash all changes in elastalert-server project
- `make build v=master`
- `docker tag <image> praecoapp/elastalert-server:<version>`
- `docker push praecoapp/elastalert-server`

## Praeco

- `npm run test:unit`
- Bump version number in package.json, if not already done
- Push to master
- `docker build . -t praecoapp/praeco`
- `docker tag <image> praecoapp/praeco:<version>`
- `docker push praecoapp/praeco`
- Tag release in github, add release notes
