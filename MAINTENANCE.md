# Checklist for new prod release

## Elastalert (if neccessary)

- Stash all changes in elastalert-server project
- `make build v=master`
- `docker tag <id> johnsusek/elastalert-server:<timestamp for tag>`
- `docker push johnsusek/elastalert-server`

## Praeco

- `npm run test:unit`
- Bump version number in package.json, if not already done
- Push to master
- (Create/push docker image)
- Tag release in github, add release notes
