# praeco

Praeco is a GUI for elastalert, using [bitsensor's elastalert API](https://github.com/bitsensor/elastalert) to manage rules.

## Configuration

- Set up the elastalert API from the instructions on the [github repo](https://github.com/bitsensor/elastalert#docker-installation).
- Copy `praeco.config.json.default` to `public/praeco.config.json` and update apiBaseUrl to point to your API instance.

## Running

For just running the app, use the official docker image:

```
docker run -v `pwd`/public/praeco.config.js:/var/www/html/praeco.config.js -it -p 8080:80 servercentral/praeco
```

## Developing

If you want to develop for praeco, run the built it development server:

```
npm install
npm run serve
```

## Building

To build your own docker container from local changes:

```
docker build -t praeco .
```
