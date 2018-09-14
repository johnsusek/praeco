# praeco

Praeco is a GUI client for elastalert.

- Uses [bitsensor's elastalert API](https://github.com/bitsensor/elastalert) to manage rules.
- Needs to be able to communicate with bitsensor server on port 3030, by default proxied to localhost (see devServer in vue.config.js) to get around CORS.
- Rename src/defaultConfig.json.default to src/defaultConfig.json before running and update as needed. These are the default for any new template or rule.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```
