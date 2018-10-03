# praeco

Praeco is a GUI for elastalert, using [bitsensor's elastalert API](https://github.com/bitsensor/elastalert) to manage rules.

![](https://user-images.githubusercontent.com/611996/46428598-0575b280-c70a-11e8-8ba2-bdcd9932380b.png)

## Installation

- Copy `praeco.config.json.default` to `public/praeco.config.json` and update apiBaseUrl to point to your API instance.

## Running

For just running the app, use the official docker images:

### [Server] Elastalert API server:

- At the moment, our fork of the elastalert API is required:

```bash
git clone -b folders https://github.com/ServerCentral/elastalert-server.git && cd elastalert-server
```

- Instructions for configuring the API are on the [github repo](https://github.com/servercentral/elastalert-server/tree/folders).

- Run the below docker image (note this is servercentral/elastalert) once your API config files are set up:

```bash
docker run -d -p 3030:3030 -p 3333:3333 \
    -v `pwd`/config/elastalert.yaml:/opt/elastalert/config.yaml \
    -v `pwd`/config/config.json:/opt/elastalert-server/config/config.json \
    -v `pwd`/rules:/opt/elastalert/rules \
    -v `pwd`/rule_templates:/opt/elastalert/rule_templates \
    --name elastalert servercentral/elastalert:latest
```

Elastalert API server should now be available at http://127.0.0.1:3030 and ws://127.0.0.1:3333

### [Client] Praeco client:

```
docker run -v ${PWD}/public/praeco.config.json:/var/www/html/praeco.config.json -it -p 8080:80 servercentral/praeco
```

Praeco should now be available on http://127.0.0.1:8080

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
