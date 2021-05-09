# Datadog Synthetic Action

[![Build Status](https://github.com/actions/typescript-action/workflows/build-test/badge.svg)](https://github.com/ugurtemiz/datadog-synthetic-action/actions)

The action is created to control syhthetic test. Especially, to pause at night and run at in the day.

## Usage
With Certain Public IDs:

```yaml
- name: Test
  uses: ugurtemiz/datadog-synthetic-action@v1
  with:
    datadog-api-key: ${{secrets.DATADOG_API_KEY}}
    datadog-application-key: ${{secrets.DATADOG_APPLICATION_KEY}}
    public-ids: "a8c-1e3-ghi,4k5-mno-p7r"
    new-status: "live" # or paused
```

With tags:

```yaml
- name: Test
  uses: ugurtemiz/datadog-synthetic-action@v1.1
  with:
    datadog-api-key: ${{secrets.DATADOG_API_KEY}}
    datadog-application-key: ${{secrets.DATADOG_APPLICATION_KEY}}
    tags: "myproject,sleep@night"
    new-status: "live" # or paused
```

## Development

Install the dependencies
```bash
$ npm install
```

Before commit your changes
```bash
$ npm run pack
```
