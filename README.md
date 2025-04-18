## Getting Started

### Edit app.config

```
export const URI_APP_MAINNET = "https://app.oraclefreedollar.org";
export const URI_PONDER_MAINNET = "https://mainnetponder.oraclefreedollar.org/";

// >>>>>> SELECTED URI HERE <<<<<<
export const URI_APP_SELECTED = URI_APP_MAINNET;
export const URI_PONDER_SELECTED = URI_PONDER_MAINNET;
// >>>>>> SELECTED URI HERE <<<<<<
```

### Production

```
Environment:

node version 20
yarn v1.22.19
Next.js 14.1.4

Commands:
yarn install --frozen-lockfile
yarn build
yarn run start
```

Open <URI_APP_SELECTED> with your browser to see the result.

### Development

```
Environment:

node version 20
yarn v1.22.19
Next.js 14.1.4

Commands:
yarn install --frozen-lockfile
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configurations for new collateral token

1. Add token logo in **svg** or **png** format under `public/coin/` folder.
2. Make sure logo file name should be in lower case and same as real token symbol.
   e.g `public/coin/usdt.svg`

## Automatic deployment

1. The main branch should deploy to app.oraclefreedollar.org
2. The dev Branch should deploy to dev.app.oraclefreedollar.org
