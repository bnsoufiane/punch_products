# Product Suite
Our company product suite including tools such as data scraper, proposals, and staffing

# Local development

## Dev build

### Start all modules

Start all modules with this command. Each module will have an acronym in the beginning of its respective shell output.

```npm start```

**Module acronyms**

```
DATA = Punch-data
ACCN = Punch-accounts
PROP = Punch-proposals
CAND = Punch-candidates
```

### Start individual modules

You can start individual modules by running

```bash
npm run dev.data
npm run dev.prop
npm run dev.cand
npm run dev.accn
```

### Start two modules

You can start two modules by running

```bash
npm run dev.data.accn
npm run dev.prop.accn
npm run dev.cand.accn
```

## Prod build

### Start all modules

Start all modules with this command. Each module will have an acronym in the beginning of its respective shell output.

```npm run prod```

### Start individual modules

You can start individual modules by running

```bash
npm run prod.data
npm run prod.prop
npm run prod.cand
npm run prod.accn
```

### Start two modules

You can start two modules by running

```bash
npm run prod.data.accn
npm run prod.prop.accn
npm run prod.cand.accn
```

# Deployment to google cloud buckets

To run deployment commands, you must have `gsutil` installed and configured. Also you must have write permission on google-cloud buckets for modules.

### Deploy all modules

```bash
npm run deploy
```

### Deploy individual module

```bash
npm run deploy.data
npm run deploy.prop
npm run deploy.cand
npm run deploy.accn
```

### Deploy two modules

```bash
npm run deploy.prop.accn
npm run deploy.data.accn
npm run deploy.cand.accn
```
