# `settle-it`

> Like `Promise.allSettled()` but for sync and async functions.

[![Gzipped Size](https://img.shields.io/bundlephobia/minzip/settle-it)](https://bundlephobia.com/result?p=settle-it)
[![Build Status](https://img.shields.io/github/workflow/status/astoilkov/settle-it/CI)](https://github.com/astoilkov/settle-it/actions/workflows/main.yml)

## Install

```bash
npm install settle-it
```

## Why

## Usage

With a synchronous function:
```ts
import settle from 'settle-it'

const result = settle(() => JSON.parse(value))

if (result.status === 'error') {
    sendToErrorTrackingService(result.reason)
    return
}

return result.value
```

With a asynchronous functions:
```ts
import settle from 'settle-it'

const result = settle(async () => {
    return await fetch('https://todos.com/get')
})

if (result.status === 'error') {
    sendToErrorTrackingService(result.reason)
    return []
}

return result.value
```

With a promise:
```ts
import settle from 'settle-it'

const result = await settle(fetchTodos())

if (result.status === 'error') {
    sendToErrorTrackingService(result.reason)
    return []
}

return result.value
```

## API

#### `settle<T>(value: Promise | (() => T) | (() => Promise<T>)): SettleResult<T>`

- **First parameter** accepts either sync/async function or a Promise.
- **Returns** `{ status: 'success', value: T }` if no error was thrown while executing the function.
- **Returns** `{ status: 'error', reason: unknown }` is an error was thrown.

## Related

- [good-try – Tries to execute sync/async function, returns a specified default value if the function throws.](https://github.com/astoilkov/good-try) — Similarly to `settle-it` it handles sync/async functions that throw an error. However, it directly returns the value and supports optional fallback value/callback.