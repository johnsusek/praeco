# praeco

Praeco is an alerting tool for elasticsearch – a GUI for [elastalert](https://github.com/yelp/elastalert), using the [elastalert API](https://github.com/bitsensor/elastalert).

- Interactively build alert rules using a query builder
- View a preview of your query and a graph of results over the last 24h
- Supports Any, Blacklist, Whitelist, Change, Frequency, Flatline, Spike and Metric Aggregation elastalert rule types
- Test your alerts against historical data
- See a preview of your alert subject/body as you are editing
- Supports notifications to Slack, Email or HTTP POST
- View logs of when your alerts are checked and when they fire
- Use templates to pre-fill commonly used rule options

⚠️ Praeco is currently an alpha and should not to be used on production systems. Please create a github issue if you are having trouble or have a feature request.

## Quickstart

First, edit rules/BaseRule.config and change the slack and smtp settings to match your environment.

Then run the app using docker:

```bash
export PRAECO_ELASTICSEARCH=<your elasticsearch ip>
docker-compose up
```

Praeco should now be available on http://127.0.0.1:8080

A [walkthrough article](https://medium.com/@john_8166/praeco-walkthrough-5aada7e078a9) is available to guide you through creating your first template and rule.

## Upgrading

```
docker pull servercentral/praeco && docker pull servercentral/elastalert
docker-compose down && docker-compose up
```

Please see [UPGRADING.md](https://github.com/ServerCentral/praeco/blob/master/UPGRADING.md) for version-specific instructions.

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
