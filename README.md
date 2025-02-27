# 1400 Express

This is a character creation app for the 1400 TTRPG system and allows for the creation, altering, and viewing of characters built for that system. This includes several systems designed to make it easy to add new settings and content.

## Contents

- [Webpage](#webpage)
- [Credits](#credits)
    - [Assets](#assets)
    - [The Roleplaying System](#the-roleplaying-system)
- [Getting Started Locally](#getting-started-locally)
    - [Environment](#environment)
    - [Using React Vite](#using-react-vite)
    - [Seeding Locally](#seeding-locally)
- [Contributing](#contributing)

## Webpage

Visit the live site at [https://one400-express.onrender.com](https://one400-express.onrender.com)

You can see the [older live webpage here](https://brewchetta.github.io/1400-custom-character-builder/)

## Credits

### The Roleplaying System

Based (and expanded) on the lo-fi roleplaying system 1400 LO-FI HI-FANTASY by James Lennox-Gordon. Also based on the 24XX SRD with rule text by Jason Tocci.

You can find the 1400 LO-FI HI-FANTASY system [here](https://itch.io/c/1685508/1400-lo-fi-hi-fantasy).

You can find the 24XX system [here](https://jasontocci.itch.io/24xx).

### Assets

This uses several temporary assets which will be replaced in future versions. I am not a visual content creator and will not use AI generation in this product. All current assets have been added from shared commons and if you find your work here and want it removed, please contact me so I can prioritize having it replaced.

New assets will be added as I'm able to commission or create them.

## Getting Started Locally

Both `client` and `server` have been bundled as a monolithic repository.

### Environment

You will need environmental variables:

```env
MONGO_USER=username
MONGO_PW=password
NODE_ENV=development
SECRET_KEY=secret
```

To install and run use the following commands:

```bash
npm install --prefix client
npm run build --prefix client

npm install --prefix server
npm run dev --prefix server
```

Pages and endpoints served through `127.0.0.1:5000`.

### Using React Vite

```bash
npm install --prefix client
npm run dev --prefix client
```

The express server must also be in use in a seperate terminal.

React Vite served from `127.0.0.1:5713`.

You can also visit the older [stand alone React application](https://github.com/brewchetta/1400-custom-character-builder).

### Seeding Locally

You may seed the core items with:
```
npm run seed --prefix client
```

Additionally, you may seed specific items by running the seed file directly with arguments:

```
node seed/index.js --characters
```

At any point you can access the help for seeding with:

```
node seed/index.js -h
```

## Contributing

Check out our `CONTRIBUTING.md`. For issues please remember to be kind and follow what you'd expect from general community guidelines.