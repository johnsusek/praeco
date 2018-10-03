# praeco

Praeco is a GUI for elastalert, using [bitsensor's elastalert API](https://github.com/bitsensor/elastalert) to manage rules.

## Configuration

- Set up the elastalert API from the instructions on the [github repo](https://github.com/bitsensor/elastalert#docker-installation).
- Copy `praeco.config.json.default` to `public/praeco.config.json` and update apiBaseUrl to point to your API instance.

## Running

For just running the app, use the official docker image:

```
docker run -v ${PWD}/public/praeco.config.json:/var/www/html/praeco.config.json -it -p 8080:80 servercentral/praeco
```

Praeco should now be available on http://127.0.0.1:8080

## Developing

If you instead want to develop for praeco, run the built-in development server:

```
npm install
npm run serve
```

## Building

To build your own docker container from local changes:

```
docker build -t praeco .
```

<br><br>

<h3 align="center">Sponsored by</h3>
<p align="center">
  <a href="https://www.servercentral.com" target="_blank">
    <img src="https://user-images.githubusercontent.com/611996/46423453-2a632900-c6fc-11e8-9332-01ad945089b8.png" height="42" width="auto" />
  </a>
</p>
