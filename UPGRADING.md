# Upgrading

**To upgrade to the newest release of praeco, run the following commands:**

- `docker pull praecoapp/praeco && docker pull praecoapp/elastalert-server`
- `docker-compose up --force-recreate --build`

Some version upgrades require further configuration. Version specific upgrade instructions are below.

## -> 1.8.0

- New options for Alerta added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#alerta for how to configure your
- Limit execution support

## -> 1.7.0

- New options for TheHive added. Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#thehive for how to configure your

hive_alert_config is set on the Praeco screen.<br>
hive_connection is set in BaseRule.config.
```yaml
 hive_connection:
   hive_host: http://localhost
   hive_port: <hive_port>
   hive_apikey: <hive_apikey>
   hive_verify: false
   hive_proxies:
     http: ''
     https: ''
```
## -> 1.6.0

- kibana discover support
  - kibana 5.6, 6.0～6.8, 7.0～7.11 

- Addition of items that can be set on the slack screen
  - generate_kibana_discover_url
  - slack_kibana_discover_color
  - slack_kibana_discover_title

- Change yaml output settings. single quotes to double quotes.

- New options for Chatwork added.
https://elastalert2.readthedocs.io/en/latest/ruletypes.html#chatwork

- New options for Discord added.
https://elastalert2.readthedocs.io/en/latest/ruletypes.html#discord
`BaseRule.config`.
```yaml
discord_embed_color: 0xE24D42
```

## -> 1.5.1

- New options for ServiceNow added.

## -> 1.5.0

- New options for VictorOps added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#victorops for how to configure your `BaseRule.config`.
```yaml
victorops_proxy:
```

- New options for Stomp added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#stomp for how to configure your `BaseRule.config`.
```yaml
stomp_ssl: True # default False
```

## -> 1.4.0

- New options for Exotel added.

- New options for GoogleChat added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#googlechat for how to configure your `BaseRule.config`.
```yaml
googlechat_header_subtitle:
googlechat_header_image:
googlechat_footer_kibanalink:
```

## -> 1.3.0

- New options for Twilio, PagerTree added.


## -> 1.2.0

- New options for Zabbix added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#zabbix for how to configure your `BaseRule.config`.
```yaml
zbx_sender_host: 'hostname'
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
mattermost_webhook_url: 'https://xxxxxx/hooks/xxxxxxxxxxxxxxxx'
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
gitter_webhook_url: 'https://webhooks.gitter.im/e/xxxxxxxxxxxxxxxx'
```

- New options for Line Notify added.


## -> 1.0.0

- New options for JIRA added. Please see https://elastalert.readthedocs.io/en/latest/ruletypes.html#jira for how to configure your `BaseRule.config`.


## v0.3.9 -> v0.4.0

- New options for telegram added to `BaseRule.config`. Add these lines and customize as needed:
```yaml
telegram_bot_token: 'xxxxxxxxxxxxxxxxx'
telegram_proxy:
telegram_proxy_login:
telegram_proxy_pass:
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
slack_webhook_url: 'https://hooks.slack.com/services/xxxxxx/xxxxxx/xxxxxx'
smtp_host: ''
smtp_port: 25
slack_emoji_override: ':postal_horn:'
```

