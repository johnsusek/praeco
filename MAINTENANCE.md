# Checklist for new prod release

## Elastalert (if neccessary)

- Stash all changes in elastalert project
- `make build v=master`
- `docker tag id johnsusek/elastalert`
- `docker push johnsusek/elastalert`

## Praeco

- `npm run test:unit`
- Bump version number in package.json, if not already done
- Push to master
- (Create/push docker image)
- Tag release in github, add release notes
