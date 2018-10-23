# praeco

Praeco is an alerting tool for elasticsearch – a GUI for [elastalert](https://github.com/yelp/elastalert), using the [elastalert API](https://github.com/bitsensor/elastalert).

- Interactively build alert rules using a query builder
- View a preview of your query and a graph of results over the last 24h
- Supports Any, Blacklist, Whitelist, Change, Frequency and Spike elastalert rule types
- Test your alerts against historical data
- See a preview of your alert subject/body as you are editing
- Supports notifications to Slack, Email or HTTP POST
- View logs of when your alerts are checked and when they fire
- Use templates to pre-fill commonly used rule options

⚠️ Praeco is currently an alpha and should not to be used on production systems. Please create a github issue if you are having trouble or have a feature request.

## Quickstart

If you have an existing elastalert installation, you should edit config/api.config.json and config/elastalert.yaml and change the writeback_index to something unique.

```bash
export PRAECO_ELASTICSEARCH=<your elasticsearch ip>
docker-compose up
```

Praeco should now be available on http://127.0.0.1:8080

## Configuration

OPTIONAL: Edit config/api.config.json, config/elastalert.yaml, and/or public/praeco.config.json for advanced configuration options. See the [api docs](https://github.com/bitsensor/elastalert#configuration) and the [example elastalert config](https://github.com/Yelp/elastalert/blob/master/config.yaml.example) for more information on config options.

## Screenshot

![](https://user-images.githubusercontent.com/611996/46428598-0575b280-c70a-11e8-8ba2-bdcd9932380b.png)

## Operation

### Creating a basic rule

[![](https://img.youtube.com/vi/jn_adWuffRo/0.jpg)](http://www.youtube.com/watch?v=jn_adWuffRo)

### Creating a frequency rule

[![](https://img.youtube.com/vi/yC631wtA3ic/0.jpg)](http://www.youtube.com/watch?v=yC631wtA3ic)

## Developing

If you instead want to develop for praeco, run the built-in development server:

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
