# Praeco

![GitHub release](https://img.shields.io/github/release/johnsusek/praeco.svg)
![Docker Pulls](https://img.shields.io/docker/pulls/praecoapp/praeco.svg)
![GitHub stars](https://img.shields.io/github/stars/johnsusek/praeco.svg?style=social&label=Stars)

<img align="left" src="https://user-images.githubusercontent.com/611996/52907999-50fca900-3232-11e9-8aee-40f7dc37ec65.jpg">

**Praeco** is an alerting tool for Elasticsearch – a GUI for [ElastAlert 2](https://github.com/jertel/elastalert2), using the [ElastAlert API](https://github.com/johnsusek/elastalert-server).

- Interactively build alerts for your Elasticsearch data using a query builder
- Preview results in an interactive chart
- Test your alerts against historical data
- Send notifications to Slack, Email, Telegram, Jira, Mattermost, Command, Gitter, Amazon SNS, Amazon SES, Zabbix, Twilio, PagerTree, Exotel, GoogleChat, Stomp, Splunk On-Call (Formerly VictorOps), ServiceNow, Chatwork, Discord, TheHive, Alerta, Datadog, Rocket.Chat, PagerDuty, Tencent SMS, Dingtalk, Alertmanager, OpsGenie, Graylog GELF, Lark, IRIS, WorkWechat, Matrix Hookshot
, Microsoft Power Automate or an HTTP POST/HTTP POST 2 endpoint
- Supports the Any, Blacklist, Whitelist, Change, Frequency, Flatline, Spike, Cardinality, New Term, and Metric Aggregation rule types
- View logs of when your alerts check, fire and fail

<br>
<br>

👉 Praeco is a completely free GPLv3 project, in return I only ask that you fill out [this simple survey](https://forms.gle/nAbu1RN2KHnyXX7L8) about how you use it.

##

![](https://user-images.githubusercontent.com/611996/47752071-7c4a9080-dc61-11e8-8ccf-2196f13429b2.png)


## Quickstart

Run the app using Docker compose. Praeco includes everything you need to get started. Just provide it the IP address of your Elasticsearch instance.

```bash
mkdir -p rules rule_templates
chmod -R 777 rules rule_templates
echo "slack_webhook_url: ''"  | sudo tee -a rules/BaseRule.config >/dev/null
export PRAECO_ELASTICSEARCH=<your elasticsearch ip>
docker-compose up
```

* Don't use 127.0.0.1 for PRAECO_ELASTICSEARCH. See first item under the Troubleshooting section.

* To set up notification settings like API keys edit `rules/BaseRule.config`.

Praeco should now be available on http://127.0.0.1:8080

~~A walkthrough article is available to guide you through creating your first rule.~~


## Upgrading

If you use docker-compose.yml published on github as it is, it will be the current latest version instead of a specific version. If you want to specify a specific version, edit it yourself and then run `docker-compose up --force-recreate --build`.

```
docker-compose down 
docker rmi praecoapp/praeco:latest
docker rmi praecoapp/elastalert-server:latest
docker pull praecoapp/praeco:latest
docker pull praecoapp/elastalert-server:latest
docker-compose up --force-recreate --build
```

You may need to update your config files when a new version comes out. Please see [UPGRADING.md](https://github.com/johnsusek/praeco/blob/master/UPGRADING.md) for version-specific instructions.

## Configuration

Edit `rules/BaseRule.config`, `config/api.config.json`, `config/elastalert.yaml`, and/or `public/praeco.config.json` for advanced configuration options. See the [api docs](https://github.com/johnsusek/elastalert-server#configuration) and the [example ElastAlert 2 config](https://github.com/jertel/elastalert/blob/alt/config.yaml.example) for more information.

Any ElastAlert 2 option you put into `rules/BaseRule.config` will be applied to every rule.

The following config settings are available in praeco.config.json:

```
// Link back to your Praeco instance, used in Slack alerts
"appUrl": "http://praeco-app-url:8080",

// A recordatus (https://github.com/johnsusek/recordatus) instance for javascript error reporting
"errorLoggerUrl": "",

// Hide these fields when editing rules, if they are already filled in template
"hidePreconfiguredFields": []
```
## DockerHub

[Praeco](https://hub.docker.com/r/praecoapp/praeco)

[ElastAlert Server](https://hub.docker.com/r/praecoapp/elastalert-server)

[Praeco & elastalert server docker image relations table](https://github.com/johnsusek/praeco/wiki/praeco-&-elastalert-server-docker-image-relations-table)

[praecoapp/elastalert-server ChangeLog](https://github.com/johnsusek/elastalert-server/blob/master/DockerImageLog.md)

## FAQ

#### Is there a sample to start elasticsearch, kibana, elastalert-server, Praeco with docker-compose?

[docker compose sample(telegram)](https://github.com/johnsusek/praeco/wiki/docker-compose-sample(telegram))

#### Please tell me the response status of the alert notification destination.

👉 [ElastAlert 2 Alerts support status](https://github.com/johnsusek/praeco/wiki/ElastAlert-2-Alerts-support-status)

#### Will elastalert-server / Praeco be supported forever?

First of all, please understand that it is open source software.
If you need generous support, please consider paid support software.

- We are not responsible for fixing bugs.
- There is no obligation to respond to your request.
- There is no obligation to add features.
- We do not always answer issues.

#### It does not work with the combination of bitsensor/elastalert and praeco. Is it a bug?

Do not use `bitsensor/elastalert` as it does not implement the features required by praeco. Use `praecoapp/elastalert-server`.

#### It does not work with the combination of karql/elastalert2-server and praeco. Is it a bug?

Do not use `karql/elastalert2-server` as it does not implement the features required by praeco. Use `praecoapp/elastalert-server`.

#### Does [yelp/elastalert](https://github.com/Yelp/elastalert) support it?

yelp/elastalert is no longer supported as maintenance has been discontinued.

Main challenges of yelp/elastalert
- Not compatible with python 3.12 or later.
- PagerTree, Stomp and Zabbix alert notifications do not work due to a bug.
- kibana Discover only guarantees operation up to kibana 7.3.

#### Does it support elasticsearch 5.x?

Not Support

#### Doesi support elasticserch 6.x?`

Elasticserch 6 is no longer supported from elastalert2 2.4.0.<br>
Please use `praecoapp/elastalert-server:20220109` with elastalert2 installed before 2.4.0.

#### Does it support elasticsearch 7.x?

Support

#### Does it support elasticsearch 8.x?

- Supports elasticsearch 8 with praeco 1.8.11 or later.<br>
- elastalert-server is compatible with elasticsearch 8.

#### Can you support a version that is not the latest version?

Not Support

#### Is it possible to set Percentage Match on the screen?

Not Support

#### Is it possible to set Spike Aggregation on the screen?

Not Support

#### Is it possible to set custom format (timestamp_type, timestamp_format, timestamp_format_expr) on the screen?

Not Support

#### Does elasticsearch-oss?

Not Support

#### Does elastalert-server support Amazon OpenSearch Service (formerly Amazon Elasticsearch)?

Not Support

#### Does elastalert-server support OpenSearch?

Not Support

#### Does elastalert-server support Elastic Cloud CloudID connections?

Not Support

#### Does elastalert-server support Elasticsearch ApiKey authentication connections?

Not Support

#### Does elastalert-server support Elasticsearch Bearer authentication connections?

Not Support

#### Does elastalert-server support Elasticsearch proxy connections?

Not Support

#### Mulit-elasticsearch instances

Not Support

#### If the contents of BaseRule.config are empty, an error will occur.

Currently, an error will occur when BaseRule.config is empty, so please make it as described below.

```
echo "slack_webhook_url: ''"  | sudo tee -a rules/BaseRule.config >/dev/null
```

#### Are you planning to add a login screen?

There are no plans to support this at this time.

#### Are you planning to support Email_format for Email?

There are no plans to support this at this time.

#### I can't send an email when I specify a gmail or Microsoft 365 address in from_addr of Email. Is there a workaround?

- For Gmail, you need to set Allow insecure apps.
- There is no workaround for Microsoft 365.

#### Is it possible to raise an alert only during a specific time period?

It is possible to set within or outside the time zone specified in the Use Time Window.

![2](https://user-images.githubusercontent.com/22293449/118377946-557bbc00-b60b-11eb-8d3d-1b420b018f52.PNG)

#### Is it possible to execute the rule only at a specific time?

It can be set with Limit Excecution.

![2](https://user-images.githubusercontent.com/22293449/118377997-a1c6fc00-b60b-11eb-802d-16587434db9d.PNG)

#### When using the field specified by alert_subject_args in alert_subject, how do you set it on the screen?

- Click the Alert Subject Args link for the number of fields you want to add and press the "Add alert_textargs" button. Enter the field you want to add.
- When embedding a field in Subject, specify a serial number from 0, such as {0} for the first and {1} for the second.

![1](https://user-images.githubusercontent.com/22293449/118377731-1305af80-b60a-11eb-9f41-3c8d698e8fb1.PNG)

#### When using the field specified by alert_text_args in alert_text, how do you set it on the screen?

- Click the AlertTextArgs link for as many fields as you want to add and press the "Add alert_textargs" button. Enter the field you want to add.
- When embedding a field in Body text, specify a serial number from 0, such as {0} for the first and {1} for the second.

![2](https://user-images.githubusercontent.com/22293449/118377737-18fb9080-b60a-11eb-84a5-1facfdc5bca9.PNG)

#### [Third Party Tools] ElastAlert Server & Praeco Helm Chart

[ElastAlert Server Helm Chart](https://github.com/daichi703n/elastalert-helm)<br>
[Praeco Helm Chart](https://github.com/daichi703n/praeco-helm)<br>
[Installing Praeco (ElastAlert GUI) into Kubernetes with Helm](https://en-designetwork.daichi703n.com/entry/2020/02/24/praeco-helm-kubernetes)

#### How do I change ElastAlert 2 options, like SSL, user/pass, etc?

Edit `config/elastalert.yaml` and uncomment the appropriate lines.

#### [elastalert-server] How do I connect to elasticsearch using SSL?

Edit `config/api.config.json` and set/add `"es_ssl": true`.<br>
option `"ea_verify_certs"`, `"es_ca_certs"`, `"es_client_cert"`, `"es_client_key"`.<br>
[configuration](https://github.com/johnsusek/elastalert-server#configuration)

#### [elastalert-server] How do I connect to elasticsearch with a username and password?

Edit `es_username` and `es_password` in `config/api.config.json` and `config/elastalert.yaml`.

#### How do I serve the praeco UI over https?

The praeco UI is served by an included nginx server (see Dockerfile). Configure it as you would any nginx project by editing the files in `nginx_config`. Then update your docker-compose.yml and add your certificate files (under webapp volumes). Another option is using a reverse proxy.

#### How do I serve the praeco UI under a custom base path, i.e. `http://www.my-domain.com:8080/my-path/`

Uncomment the declaration of the `VUE_APP_BASE_URL` environment variable in `docker-compose.yml` and define the path you want.
```yaml
    environment:
      VUE_APP_BASE_URL: /my-path/
```
Uncomment the rewrite command in `nginx.config/default.conf` and define the same path as in teh environment variable above.
```
rewrite ^/my-path(/.*)$ $1 last;
```
#### How do I change the writeback index?

Edit `config/elastalert.yaml` and `config/api.config.json` and change the writeback_index values.

#### How do I run this on Windows?

First, install docker and docker-compose.

Then, using powershell, run these commands:

```
$Env:PRAECO_ELASTICSEARCH="1.2.3.4"
docker-compose.exe up
```

Replace 1.2.3.4 with your Elasticsearch IP.

#### Can I import my current ElastAlert 2 rules into praeco?

Unfortunately this is not a possibility for two reasons. First, praeco only supports a subset of ElastAlert 2 features, so only certain rules would work. Second, praeco cannot automatically create the query builder ui from an arbitrary ElastAlert 2 `filter` entry, due to the potential complexity and combinations of filters someone can put in their rule file.

#### Can I export my praeco rules into another elastalert  2 instance?

Yes, the praeco rule files are 100% compatible with other elastalert servers.

## Troubleshooting

#### I am using 127.0.0.1 for PRAECO_ELASTICSEARCH and it isn't working

Praeco, running within a docker container, cannot communicate with your ES bound to localhost. You need to change your ES `network.host` setting
to something different. The value of `_site_` is suggested, that will bind to a local network IP on your machine. Then use that
IP address for PRAECO_ELASTICSEARCH. Here's a working example:

```sh
elasticsearch -E network.host=_site_
export PRAECO_ELASTICSEARCH=192.168.1.145
mkdir -p rules rule_templates
chmod -R 777 rules rule_templates
docker-compose up
```

Replace 192.168.1.145 with the IP address your ES binds to (look for bound_addresses in the elasticsearch launch log).

#### I am getting high CPU usage on some of my rules

When editing a rule, click "WITH OPTIONS" and try using the "Use count query" option. This can dramatically speed up processing time for large amounts of data (tens of thousands of results).

#### I'm not receiving alerts even though I expect them

First of all, try to test your alert with varying time frames and see if that is returning any results.

If the test is returning results, but you are not receiving any alerts, check the error log. There may be a problem with your alerter settings. Make sure you edited rules/BaseRule.config and have correct values in there.

If the test is not returning results, even though you think it should, try reading the [ElastAlert 2 docs](https://elastalert2.readthedocs.io/en/latest/ruletypes.html#rule-types) for your rule type. Compare the yaml from praeco with the options from the docs to make sure the rule is being created as expected. If praeco is generating the wrong yaml, please file an issue.

#### Failed to establish a new connection: [Errno 111] Connection refused

You will see this error when launching if praeco cannot find elasticsearch at the IP address you specified at \$PRAECO_ELASTICSEARCH. Please make sure you can communicate with this IP address by issuing the following command: `curl http://$PRAECO_ELASTICSEARCH:9200`. If the connection is refused, your machine cannot communicate with Elasticsearch, it may be a networking problem.

#### 404 error in error log for slack webhook

Make sure the channel/username you are trying to post to exists.

#### How to setup TheHive?

Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#thehive for how to configure your BaseRule.config file.

- ``hive_connection`` is set in BaseRule.config.

```yaml
 hive_connection:
   hive_host: http://localhost
   hive_port: <hive_port>
   hive_apikey: <hive_apikey>
   hive_proxies:
     http: ''
     https: ''
```

- ``hive_alert_config`` is set on the Praeco screen.
- Not Support ``hive_observable_data_mapping``.

#### How to setup Slack?

Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#slack for how to configure your BaseRule.config file.

- Replace slack_webhook_url with the URL of your channel.
- Describe the following settings in BaseRule.config. Please set other settings on the screen.

```yaml
slack_webhook_url: 'https://hooks.slack.com/services/xxxxxxxxx/xxxxxxxx/xxxxxxxxxxxxxxxxxxx'
```

#### How to setup Telegram?

telegram_room_id can be set on the praeco screen.

Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#telegram for how to configure your BaseRule.config file.

- Replace telegram_bot_token with the your bot token.
- Describe the following settings in BaseRule.config. Please set other settings on the screen.

```yaml
telegram_bot_token: 'xxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

#### How to setup Mattermost? 

Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#mattermost for how to configure your `BaseRule.config` file.

- Replace mattermost_webhook_url with the URL of your webhook.
- Describe the following settings in BaseRule.config. Please set other settings on the screen.

```yaml
mattermost_webhook_url: 'https://xxxxxx/hooks/xxxxxxxxxxxxxxxx'
```

#### How to setup Rocket.Chat? 

Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#rocket-chat for how to configure your `BaseRule.config` file.

- Replace rocket_chat_webhook_url with the URL of your webhook.
- Describe the following settings in BaseRule.config. Please set other settings on the screen.

```yaml
rocket_chat_webhook_url: 'https://xxxxxx/xxxxx/xxxxxxxxxxxxxxxx'
```

#### How to setup Email?

Sorry Not Support email_format.

Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#email for how to configure your `BaseRule.config` file.

[example setting](https://github.com/johnsusek/praeco/issues/245#issuecomment-691523706)

Describe the following settings in BaseRule.config. Please set other settings on the screen.

```yaml
smtp_auth_file: '/opt/elastalert/pass/smtp_auth_user.yaml'
```

smtp_auth_user.yaml

```yaml
user: xxx@yahoo.co.jp
password: xxx
```

Google account in advance → Apps that can access your account → Allow less secure apps: Disabled → Enabled When I specified the Gmail address with from_addr and checked the operation, it worked without problems.

```yaml
smtp_auth_file: '/opt/elastalert/smtp/smtp_auth_user.yaml"
```
smtp_auth_user.yaml

```yaml
user: xxx@gmail
password: xxx
```

#### How to setup Jira?

Please see https://elastalert2.readthedocs.io/en/latest/ruletypes.html#jira for how to configure your `BaseRule.config` file.

## Architecture details

![](https://user-images.githubusercontent.com/611996/52892144-90a19300-3155-11e9-8050-cb4a440411a4.png)

Praeco is a vue.js app (hosted in an nginx docker container) that communicates with the [ElastAlert API](https://github.com/johnsusek/elastalert-server) (running in another docker container) to view/edit rules.
The elastalert api interacts with the included [ElastAlert 2](https://github.com/jertel/elastalert2) python daemon directly for various tasks including testing and silencing rules, and indirectly by modifying or creating
rule files in the rules/ directory.

When you run praeco using the quickstart instructions, it runs these two docker containers, per the docker-compose.yml file.

Praeco uses a fork of the elastalert _api server_, which is why the docker image source is [johnsusek/elastalert-server](https://github.com/johnsusek/elastalert-server).

NOTE: Only the _api server_ is a fork, the ElastAlert 2 daemon itself is built from the `master` branch whenever a new version of the `johnsusek/elastalert-server` docker image is created.

Please see the development section below if you're interested in running these services separately.

## Manual/Dev installation

NOTE: If you're just interested in developing Praeco UI features locally (and not changing ElastAlert 2 or the api), you can skip right to Praeco setup and just run the internal ElastAlert Server with `docker-compose up elastalert-server` .

---

First, you need a local copy of the elastalert api server running, which itself needs ElastAlert 2. Start by cloning the neccessary repos

```sh
$ cd
$ git clone https://github.com/jertel/elastalert2.git
$ git clone https://github.com/johnsusek/elastalert-server.git
$ git clone https://github.com/johnsusek/praeco.git
```

### Setting up ElastAlert 2

**Python Support version**

- Compatible with 3.12 or later

**Elasticsearch Support version**

- 7.x
- 8.x

Configure the ElastAlert 2 `config.yaml` with:
- Your `es_host`
- A unique `writeback_index`
- Change the rules_folder to `rules`

```sh
cd ~/elastalert2
mkdir -p rules rule_templates
chmod -R 777 rules rule_templates
echo "slack_webhook_url: ''"  | sudo tee -a rules/BaseRule.config >/dev/null
pip install "setuptools>=11.3"
python setup.py install
cp ./examples/config.yaml.example ./config.yaml
vi config.yaml
```

### Setting up the API server

Configure the api server `config.json` with:
- An _absolute path_ to your ElastAlert 2 folder for `elastalertPath`
- The address of your elasticsearch instance for `es_host`
- The same `writeback_index` from the config.yaml

```sh
# nvm install
# https://github.com/nvm-sh/nvm#install--update-script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
$ vi ~/.bash_profile

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

source ~/.bash_profile

# npm & node install
npm install -g npm
nvm install "$(cat .nvmrc)"
```

```sh
cd ~/elastalert-server
vi config/config.json
nvm use "$(cat .nvmrc)"
npm install
npm run start
```

You should see this line if it started successfully:
```
INFO elastalert-server: Server:  Server started
```

### Setting up praeco

Finally, run praeco:

```sh
# No need to implement if the environment is the same as elastalert-server
# nvm install
# https://github.com/nvm-sh/nvm#install--update-script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
$ vi ~/.bash_profile

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

source ~/.bash_profile

# npm & node install
npm install -g npm
nvm install "$(cat .nvmrc)"

```sh
cd ~/praeco
nvm use "$(cat .nvmrc)"
npm install
export PRAECO_ELASTICSEARCH=<your elasticsearch ip>

# edit src/main.js
/api-ws/test to /ws/test

# edit vue.config.js
/api-ws/test to /ws/test

# run
npm run serve
```

You should now see the UI running at [http://localhost:8080](http://localhost:8080).

If you have any difficulties please open a github issue with your problem.



## Maintainers

<table>
  <tr>
    <td align="center"><a href="https://github.com/johnsusek"><img src="https://avatars3.githubusercontent.com/u/611996?v=4" width="100px;" alt=""/><br /><sub><b>John Susek</b></sub></a></td>
    <td align="center"><a href="https://github.com/nsano-rururu"><img src="https://avatars1.githubusercontent.com/u/22293449?v=4" width="100px;" alt=""/><br /><sub><b>Naoyuki Sano</b></sub></a></td>
  </tr>
</table>
