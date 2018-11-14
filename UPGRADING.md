# Upgrading

To upgrade to the newest release of praeco, run the following commands:

- `docker pull servercentral/praeco && docker pull servercentral/elastalert`
- `docker-compose up --force-recreate --build && docker image prune -f`

Some version upgrades require further configuration. Version specific upgrade instructions are below.

## v0.1 -> v0.2

- Create file rules/BaseRule.config and paste in contents from https://raw.githubusercontent.com/ServerCentral/praeco/develop/rules/BaseRule.config, change as neccessary.

## v0.2.1 -> v0.2.2

- Add the following lines to your `nginx/default.conf` file:

At the top:

```
# cache github api
proxy_cache_path /tmp/nginx_cache levels=1:2 keys_zone=github_api_cache:60m max_size=10g
                 inactive=60m use_temp_path=off;
```

and within the server {} section:

```
  location /api-app/releases {
      proxy_cache github_api_cache;
      proxy_pass https://api.github.com/repos/ServerCentral/praeco/releases;
  }
```

See [the default config file](https://github.com/ServerCentral/praeco/blob/master/nginx_config/default.conf) for exactly where to place these snippets.
