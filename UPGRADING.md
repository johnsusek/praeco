# Upgrading

**To upgrade to the newest release of praeco, run the following commands:**

- `docker pull praecoapp/praeco && docker pull praecoapp/elastalert-server`
- `docker-compose up --force-recreate --build`

Some version upgrades require further configuration. Version specific upgrade instructions are below.

## -> 1.4.0

- New options for Exotel, GoogleChat added.


## -> 1.3.0

- New options for Twilio, PagerTree added.


## -> 1.2.0

- New options for Zabbix added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#zabbix for how to configure your `BaseRule.config`.
```yaml
zbx_sender_host: ''
zbx_sender_port: 10051
```
- New options for SNS added. 

**./praeco/aws/config**

For example:
```
[default]
region = ap-northeast-1
```

**./praeco/aws/credentials**

For example:
```
[default]
aws_access_key_id = xxxxxxxxxxxxxxxxx
aws_secret_access_key = xxxxxxxxxxxxxxxxxxxxxxxxx
```

**Part of docker-compose.yml**

For example:
```yaml
  elastalert:
    container_name: elastalert
    image: praecoapp/elastalert-server:latest
    ports:
      - 3030:3030
      - 3333:3333
    restart: always
    volumes:
      - ./elastalert/config/elastalert.yaml:/opt/elastalert/config.yaml
      - ./elastalert/config/api.config.json:/opt/elastalert-server/config/config.json
      - ./elastalert/rules:/opt/elastalert/rules
      - ./elastalert/rule_templates:/opt/elastalert/rule_templates
      - ./elastalert/aws/config:/home/node/.aws/config
      - ./elastalert/aws/credentials:/home/node/.aws/credentials
```


## -> 1.1.0

- New options for MS Teams added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#ms-teams for how to configure your `BaseRule.config`.
```yaml
ms_teams_alert_summary:
ms_teams_proxy:
ms_teams_alert_fixed_width:
```

- New options for Mattermost added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#mattermost for how to configure your `BaseRule.config`.
```yaml
mattermost_webhook_url: ''
mattermost_proxy:
mattermost_ignore_ssl_errors:
mattermost_icon_url_override:
mattermost_msg_pretext:
mattermost_msg_fields: 
```

- New options for Command added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#command for how to configure your `BaseRule.config`.
```yaml
pipe_match_json:
pipe_alert_text:
``` 

- New options for Gitter added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#gitter for how to configure your `BaseRule.config`.
```yaml
gitter_webhook_url: ''
```

- New options for Line Notify added.


## -> 1.0.0

- New options for JIRA added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#jira for how to configure your `BaseRule.config`.


## v0.3.9 -> v0.4.0

- New options for telegram added to `BaseRule.config`. Add these lines and customize as needed:
```yaml
telegram_bot_token: ''
telegram_proxy: ''
telegram_proxy_login: ''
telegram_proxy_pass: ''
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

```yaml
slack_webhook_url: ''
smtp_host: ''
smtp_port: 25
slack_emoji_override: ':postal_horn:'
```

