# Building download latest.zip

Any time the configs, the Dockerfile or docker-compose.yml change, run this script to create a new latest.zip file.
This zip file contains only what is needed to run praeco for end users, and is linked to from documentation.

`./build_download.sh`

# Updating packages

Run `npm update` to install latest versions of packages per package.json.

# Checklist for new prod release

## Elastalert (if neccessary)

- Stash all changes in elastalert project
- `make build v=master`
- `docker tag id servercentral/elastalert`
- `docker push servercentral/elastalert`

## Praeco

- Run tests
- Bump version number in version.json, if not already done
- Stash all changes
- Push to master
- (Drone will create/push docker image)
- Tag release in github, add release notes
- Inform people about latest release
