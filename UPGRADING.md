# Upgrading

**To upgrade to the newest release of praeco, run the following commands:**

- `docker pull praecoapp/praeco && docker pull praecoapp/elastalert-server`
- `docker-compose up --force-recreate --build`

Some version upgrades require further configuration. Version specific upgrade instructions are below.

## -> 1.8.21

**Remove options**

**LINE Notify**

## -> 1.8.20

**New options**

**Microsoft Power Automate**  
**WorkWechat**  
**Matrix Hookshot**  

**dingtalk**

add settings.

- dingtalk_sign

**PagerDuty**

add settings.

- pagerduty_ca_certs
- pagerduty_ignore_ssl_errors

**kibana discover**

- kibana 8.12 - 8.17 support

## -> 1.8.18

**New options**

**IRIS**

**Telegram**

add settings.

- telegram_thread_id

## -> 1.8.17

**New options**

**Lark**

**kibana discover**

- kibana 8.9 - 8.11 support

## -> 1.8.16

**Chage UI**

Setting screen of limitExcecutionn
```
vue-cron-editor-buefy to vue-js-cron
```

**New options**

  - Remove required webhook_url
    - alerta_api_url
    - discord_webhook_url
    - gitter_webhook_url
    - googlechat_webhook_url
    - http_post_url
    - http_post2_url
    - mattermost_webhook_url
    - ms_teams_webhook_url
    - pagertree_integration_url
    - rocket_chat_webhook_url
    - slack_webhook_url

**bug fix**

 - MS Teams
   - ms_teams_theme_color

## -> 1.8.15

**bug fix**

- Alerta
- TheHive

## -> 1.8.14

**kibana discover**

- kibana 8.7, 8.8 support

**Opsgenie**

add settings.

- opsgenie_priority

**multiple settigs**

- slack_webhook_url
- mattermost_webhook_url
- mattermost_channel_override
- rocket_chat_webhook_url
- rocket_chat_channel_override
- ms_teams_webhook_url
- googlechat_webhook_url
- http_post_url
- http_post2_url

**bug fix**

- Alerta

## -> 1.8.13

**New options**

**Graylog GELF**

**kibana discover**

- kibana 8.6 support

**Remove option**

**Jira**

- jira_label
- jira_labels
- jira_description
- jira_assignee
- jira_max_age
- jira_priority
- jira_bump_tickets
- jira_bump_not_in_statuses
- jira_bump_in_statuses
- jira_bump_after_inactivity
- jira_bump_only
- jira_transition_to
- jira_watchers

## -> 1.8.12

**New options**

**Alerta**

add settings.

- alerta_timeout
- alerta_use_match_timestamp
- alerta_use_qk_as_resource
- alerta_api_skip_ssl
- alerta_origin
- alerta_service
- alerta_type
- alerta_correlate
- alerta_attributes_keys
- alerta_attributes_values
- alerta_value

**GoogleChat**

add settings.

- googlechat_proxy

**Jira**

add settings.

- jira_label
- jira_labels
- jira_description
- jira_assignee
- jira_max_age
- jira_priority
- jira_bump_tickets
- jira_bump_not_in_statuses
- jira_bump_in_statuses
- jira_bump_after_inactivity
- jira_bump_only
- jira_transition_to
- jira_watchers

**Mattermost**

add settings.

- mattermost_emoji_override

**OpsGenie**

https://elastalert2.readthedocs.io/en/latest/ruletypes.html#opsgenie
- opsgenie_key
- opsgenie_account
- opsgenie_message
- opsgenie_subject
- opsgenie_alias
- opsgenie_proxy

**Telegram**

add settings.

- telegram_parse_mode

**kibana discover**

- kibana 8.2～8.5 support

## -> 1.8.11

Elasticsearch 8 support

**New options**

- Dingtalk

`dingtalk_btns` is set in BaseRule.config.<br>
https://elastalert2.readthedocs.io/en/latest/ruletypes.html#dingtalk

- Alertmanager

`dingtalk_btns` is set in BaseRule.config.<br>
`alertmanager_api_version` is set in BaseRule.config.<br>
`alertmanager_hosts` is set in BaseRule.config.<br>
`alertmanager_labels` is set in BaseRule.config.<br>
`alertmanager_annotations` is set in BaseRule.config.<br>
`alertmanager_fields` is set in BaseRule.config.<br>
https://elastalert2.readthedocs.io/en/latest/ruletypes.html#alertmanager

**Chatwork**

add settings.

- chatwork_proxy
- chatwork_proxy_login
- chatwork_proxy_pass

**Discord**

add settings.

- discord_proxy
- discord_proxy_login
- discord_proxy_password

**Stomp**

remove settings.

- stomp_ssl

**Slack**

add settings.

- slack_attach_jira_ticket_url
- slack_jira_ticket_color
- slack_jira_ticket_title

**MS Teams**

add settings.

- Add ms_teams_ca_certs
- Add ms_teams_ignore_ssl_errors
- Add ms_teams_attach_kibana_discover_url
- Add ms_teams_kibana_discover_title

**Command**

add settings.

- fail_on_non_zero_exit

**Zabbix**

add settings.

- zbx_host_from_field

**kibana discover**

- kibana 7.16/7.17/8.0/8.1 support
- remove kibana 5.6～6.8 support

## -> 1.8.10

**PagerDuty**

https://elastalert2.readthedocs.io/en/latest/ruletypes.html#pagerduty

**HTTP POST 2**

https://elastalert2.readthedocs.io/en/latest/ruletypes.html#http-post-2

**Tencent SMS**

https://elastalert2.readthedocs.io/en/latest/ruletypes.html#tencent-sms

**HTTP POST**

add settings.

- http_post_ca_certs
- http_post_ignore_ssl_errors

**kibana discover**

- kibana 7.15  support

## -> 1.8.9

**kibana discover**

- kibana 7.14  support

## -> 1.8.8

**Add UI Setting**

**Add description, priority and owner fields**

https://elastalert2.readthedocs.io/en/latest/ruletypes.html#owner
https://elastalert2.readthedocs.io/en/latest/ruletypes.html#priority
https://elastalert2.readthedocs.io/en/latest/ruletypes.html#description

**Rocket.Chat**

https://elastalert2.readthedocs.io/en/latest/ruletypes.html#rocket-chat
- rocket_chat_attach_kibana_discover_url
- rocket_chat_kibana_discover_color
- rocket_chat_kibana_discover_title
- rocket_chat_ca_certs
- rocket_chat_ignore_ssl_errors
- rocket_chat_timeout

**ServiceNow**

https://elastalert2.readthedocs.io/en/latest/ruletypes.html#servicenow
- servicenow_impact
- servicenow_urgency 

## -> 1.8.7

**kibana discover**

- kibana 7.13  support

**New options**

- Add options for Rocket.Chat.
https://elastalert2.readthedocs.io/en/latest/ruletypes.html#rocket-chat

```yaml
rocket_chat_webhook_url: 'https://xxxxxx/xxxxx/xxxxxxxxxxxxxxxx'
```

- New options for Amazon SES.
https://elastalert2.readthedocs.io/en/latest/ruletypes.html#aws-ses-amazon-simple-email-service

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

**Add UI Setting**

**Mattermost**

- mattermost_attach_kibana_discover_url
- mattermost_kibana_discover_color
- mattermost_kibana_discover_title
- mattermost_title
- mattermost_title_link
- mattermost_footer
- mattermost_footer_icon
- mattermost_image_url
- mattermost_thumb_url
- mattermost_author_name
- mattermost_author_link
- mattermost_author_icon

**Slack**

- slack_footer
- slack_footer_icon
- slack_image_url
- slack_thumb_url
- slack_author_name
- slack_author_link
- slack_author_icon
- slack_msg_pretext
## -> 1.8.6

- Add options for Datadog.
https://github.com/jertel/elastalert2/blob/master/docs/source/ruletypes.rst#datadog

- Add options for Twilio Copilot.
https://github.com/jertel/elastalert2/blob/master/docs/source/ruletypes.rst#twilio

## -> 1.8.5

**kibana discover**

- kibana 7.12  support

**Add UI Setting**

**Command**

- command change UI to add / update / delete key
- pipe_match_json
- pipe_alert_text

**Email**

- smtp_host
- smtp_ssl
- smtp_auth_file
- smtp_key_file
- smtp_cert_file
- email_from_field
- email_add_domain

**MS Teams**

- ms_teams_proxy
- ms_teams_alert_summary
- ms_teams_alert_fixed_width

**Slack**

- slack_proxy
- slack_icon_url_override
- slack_parse_override
- slack_text_string
- slack_ignore_ssl_errors
- slack_timeout
- slack_ca_certs

**Mattermost**

- mattermost_proxy
- mattermost_ignore_ssl_errors
- mattermost_icon_url_override
- mattermost_msg_pretext

**Telegram**

- telegram_proxy
- telegram_proxy_login
- telegram_proxy_pass

**VictorOps**

- victorops_proxy

**Gitter**

- gitter_webhook_url
- gitter_proxy

**Stomp**

- stomp_ssl

**HTTP POST**

- http_post_proxy
- http_post_timeout

**Zabbix**

- zbx_sender_host
- zbx_sender_port

**ServiceNow**

- servicenow_proxy


**PagerTree**

- pagertree_proxy

**GoogleChat**

- googlechat_header_subtitle
- googlechat_header_image
- googlechat_footer_kibanalink
## -> 1.8.4

- fix multiple query keys bug

## -> 1.8.3

- Add option to use multiple query keys<br>
　Since query_key has been changed to an array, if it has already been set, an error will occur when reading the rule. <br>
　Please delete query_key from the rule before the version upgrade and set it again after the version upgrade.
  
## -> 1.8.2

- alert_subject_args & alert_text_args support
- Forced double quotes
## -> 1.8.1

- Add Time Window 
  - the user can use it to send alerts only during specific time range.
  - elastalert_module in elastalert.

- Alerta
  - add alerta_environment

## -> 1.8.0

- New options for Alerta added. Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#alerta for how to configure your
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

- New options for VictorOps added. Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#victorops for how to configure your `BaseRule.config`.
```yaml
victorops_proxy:
```

- New options for Stomp added. Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#stomp for how to configure your `BaseRule.config`.
```yaml
stomp_ssl: True # default False
```

## -> 1.4.0

- New options for Exotel added.

- New options for GoogleChat added. Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#googlechat for how to configure your `BaseRule.config`.
```yaml
googlechat_header_subtitle:
googlechat_header_image:
googlechat_footer_kibanalink:
```

## -> 1.3.0

- New options for Twilio, PagerTree added.


## -> 1.2.0

- New options for Zabbix added. Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#zabbix for how to configure your `BaseRule.config`.
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

- New options for MS Teams added. Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#ms-teams for how to configure your `BaseRule.config`.
```yaml
ms_teams_alert_summary:
ms_teams_proxy:
ms_teams_alert_fixed_width:
```

- New options for Mattermost added. Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#mattermost for how to configure your `BaseRule.config`.
```yaml
mattermost_webhook_url: 'https://xxxxxx/hooks/xxxxxxxxxxxxxxxx'
mattermost_proxy:
mattermost_ignore_ssl_errors:
mattermost_icon_url_override:
mattermost_msg_pretext:
mattermost_msg_fields: 
```

- New options for Command added. Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#command for how to configure your `BaseRule.config`.
```yaml
pipe_match_json:
pipe_alert_text:
``` 

- New options for Gitter added. Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#gitter for how to configure your `BaseRule.config`.
```yaml
gitter_webhook_url: 'https://webhooks.gitter.im/e/xxxxxxxxxxxxxxxx'
```

- New options for Line Notify added.


## -> 1.0.0

- New options for JIRA added. Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#jira for how to configure your `BaseRule.config`.


## v0.3.9 -> v0.4.0

- New options for telegram added to `BaseRule.config`. Add these lines and customize as needed:
```yaml
telegram_bot_token: 'xxxxxxxxxxxxxxxxx'
telegram_proxy:
telegram_proxy_login:
telegram_proxy_pass:
```
[Here are](https://elastalert2.readthedocs.io/en/latest/ruletypes.html#telegram) the elastalert docs on these options.

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

