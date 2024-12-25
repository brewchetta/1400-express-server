# 1400 Server - Express

## Development

Starting the server in debug mode:

```
npm run dev
```

Endpoints in development default to port 5000.

## Seeding

You may seed the core items with:
```
npm run seed
```

Additionally, you may seed additional items by running the seed file directly with arguments:

```
node seed/index.js --characters
```

At any point you can access the help for seeding with:

```
node seed/index.js -h
```

## Client Building

Copy production `build` directory from React into top level of server. Rename to `client`. Remove all mentions of `1400-custom-character-builder` from paths.