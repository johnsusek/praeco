# Upgrading

**To upgrade to the newest release of praeco, run the following commands:**

- `docker pull praecoapp/praeco && docker pull praecoapp/elastalert-server`
- `docker-compose up --force-recreate --build`

Some version upgrades require further configuration. Version specific upgrade instructions are below.

## -> 1.0.0

- New options for JIRA added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#jira for how to configure your `BaseRule.config`.


## v0.3.9 -> v0.4.0

- New options for telegram added to `BaseRule.config`. Add these lines and customize as needed:
```yaml
telegram_bot_token: ''
telegram_api_url: ''
telegram_proxy: ''
```
[Here are](https://elastalert.readthedocs.io/en/latest/ruletypes.html#telegram) the elastalert docs on these options.

## v0.3.0 -> v0.3.1

- New options `es_username` and `es_password` added to `config/api.config.json`. Add these to your config if you need this capability.

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
      proxy_pass https://api.github.com/repos/johnsusek/praeco/releases;
  }
```

See [the default config file](https://github.com/johnsusek/praeco/blob/master/nginx_config/default.conf) for exactly where to place these snippets.

## v0.1 -> v0.2

- Create file rules/BaseRule.config and paste in contents from https://raw.githubusercontent.com/johnsusek/praeco/develop/rules/BaseRule.config, change as neccessary.

