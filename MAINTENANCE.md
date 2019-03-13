# Checklist for new prod release

## Elastalert (if neccessary)

- Stash all changes in elastalert project
- `make build v=master`
- `docker tag id servercentral/elastalert`
- `docker push servercentral/elastalert`

## Praeco

- Run tests
- Bump version number in package.json, if not already done
- Push to master
- (Drone will create/push docker image)
- Tag release in github, add release notes
