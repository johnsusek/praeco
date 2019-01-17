# praeco

Praeco is an alerting tool for elasticsearch – a GUI for [elastalert](https://github.com/yelp/elastalert), using the [elastalert API](https://github.com/bitsensor/elastalert).

- Interactively build alert rules using a query builder
- View a preview of your query and a graph of results
- Test your alerts against historical data
- See a preview of your alert subject/body as you are editing
- Supports notifications to Slack, Email or HTTP POST
- Supports Any, Blacklist, Whitelist, Change, Frequency, Flatline, Spike and Metric Aggregation elastalert rule types
- View logs of when your alerts are checked and when they fire
- Use templates to pre-fill commonly used rule options

## Quickstart

First, edit rules/BaseRule.config and change the slack and smtp settings to match your environment.

Then run the app using docker:

```bash
export PRAECO_ELASTICSEARCH=<your elasticsearch ip>
docker-compose up
```

ℹ️ Don't use 127.0.0.1 for PRAECO_ELASTICSEARCH. See first item under the Troubleshooting section.

Praeco should now be available on http://127.0.0.1:8080

A [walkthrough article](https://medium.com/@john_8166/praeco-walkthrough-5aada7e078a9) is available to guide you through creating your first rule.

## Upgrading

```
docker pull servercentral/praeco; docker pull servercentral/elastalert
docker-compose up --force-recreate --build; docker image prune -f
```

ℹ️ You may need to update your config files when a new version comes out. Please see [UPGRADING.md](https://github.com/ServerCentral/praeco/blob/master/UPGRADING.md) for version-specific instructions.

## Configuration

OPTIONAL: Edit config/api.config.json, config/elastalert.yaml, and/or public/praeco.config.json for advanced configuration options. See the [api docs](https://github.com/bitsensor/elastalert#configuration) and the [example elastalert config](https://github.com/Yelp/elastalert/blob/master/config.yaml.example) for more information on config options.

The following config settings are available in praeco.config.json:

```
// link back to your praeco instance, used in slack alerts
"appUrl": "http://praeco-app-url:8080",

// a recordatus (https://github.com/ServerCentral/recordatus) instance for javascript error reporting
"errorLoggerUrl": "",

// hide these fields when editing rules, if they are already filled in template
"hidePreconfiguredFields": []
```

## Screenshot

![](https://user-images.githubusercontent.com/611996/47752071-7c4a9080-dc61-11e8-8ccf-2196f13429b2.png)

## FAQ

#### How do I connect to elasticsearch using SSL?

Edit `config/api.config.json` and set/add `"es_ssl": true`.

#### How do I serve the praeco UI over https?

The praeco UI is served by an included nginx server. Configure it as you would any nginx project by editing the files in `nginx_config`. Then update your docker-compose.yml and add your certificate files (under webapp volumes).

#### How do I change the writeback index?

Edit `config/elastalert.yaml` and `config/api.config.json` and change the writeback_index values.

#### How do I change elastalert options, like SSL, user/pass, etc?

Edit `config/elastalert.yaml` and uncomment the appropriate lines.

#### How do I run this on Windows?

First, install docker and docker-compose.

Then, using powershell, run these commands:

```
$Env:PRAECO_ELASTICSEARCH="1.2.3.4"
docker-compose.exe up
```

Replace 1.2.3.4 with your Elasticsearch IP.

## Troubleshooting

#### I am using 127.0.0.1 for PRAECO_ELASTICSEARCH and it isn't working

Praeco, running within a docker container, cannot communicate with your ES bound to localhost. You need to change your ES `network.host` setting
to something different. The value of `_site_` is suggested, that will bind to a local network IP on your machine. Then use that
IP address for PRAECO_ELASTICSEARCH. Here's a working example:

```
elasticsearch -E network.host=_site_
export PRAECO_ELASTICSEARCH=192.168.1.145
docker-compose up
```

Replace 192.168.1.145 with the IP address your ES binds to (look for bound_addresses in the elasticsearch launch log).

#### I'm not receiving alerts even though I expect them

First of all, try to test your alert with varying time frames and see if that is returning any results.

If the test is returning results, but you are not receiving any alerts, check the error log. There may be a problem with your slack or email settings. Make sure you edited rules/BaseRule.config and have correct values in there.

If the test is not returning results, even though you think it should, try reading the [elastalert docs](https://elastalert.readthedocs.io/en/latest/ruletypes.html#rule-types) for your rule type. Compare the yaml from praeco with the options from the docs to make sure the rule is being created as expected. If praeco is generating the wrong yaml, please file an issue.

#### Failed to establish a new connection: [Errno 111] Connection refused

You will see this error when launching if praeco cannot find elasticsearch at the IP address you specified at \$PRAECO_ELASTICSEARCH. Please make sure you can communicate with this IP address by issuing the following command: `curl http://$PRAECO_ELASTICSEARCH:9200`. If the connection is refused, your machine cannot communicate with Elasticsearch, it may be a networking problem.

#### 404 error in error log for slack webhook

Make sure the channel/username you are trying to post to exists.

## Developing

If you want to develop for praeco, run the built-in development server:

```
npm install
npm run serve
```

To build a docker container from local changes:

```
docker build -t praeco .
```

## Testing

Unit tests:

`npm run test:unit`

E2E tests:

`npm run test:e2e`

<br><br>

<h3 align="center">Sponsored by</h3>
<p align="center">
  <a href="https://www.servercentral.com" target="_blank">
    <img src="https://user-images.githubusercontent.com/611996/46423453-2a632900-c6fc-11e8-9332-01ad945089b8.png" height="42" width="auto" />
  </a>
</p>
