# KPTM App (web-ui)

A Quasar Project

## Install the dependencies

```bash
yarn
# or
npm install
```

## Environment Configuration

### First-time setup

Copy the environment template and configure for your local setup:

```bash
cp .env.example .env
```

Edit `.env` to match your local backend configuration. Key variables:

- `API_BASE_URL` - Backend API endpoint (default: `http://localhost:8000`)
- `WS_BASE_URL` - WebSocket endpoint (default: `ws://localhost:8000/api/core`)
- `FEATURE_COMPLIANCE_FRAMEWORK_ENABLED` - Enable audits module (`'true'` or `'false'`)

The `public/config.js` file is automatically generated from `.env` when you run `npm run dev` or `yarn dev`.

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for Production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js)..
