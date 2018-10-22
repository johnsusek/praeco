# praeco

⚠️ Praeco is currently an alpha and should not to be used on production systems. Please create a github issue if you are having trouble installing.

Praeco is a GUI for elastalert, using [bitsensor's elastalert API](https://github.com/bitsensor/elastalert) to manage rules.

![](https://user-images.githubusercontent.com/611996/46428598-0575b280-c70a-11e8-8ba2-bdcd9932380b.png)

## Configure

Edit docker-compose.yml and change the extra_hosts entry for elasticsearch to match your elasticsearch host.

## Run

`docker-compose up`

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
