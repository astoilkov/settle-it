# `settle-it`

> Deal with code that can throw.

[![Gzipped Size](https://img.shields.io/bundlephobia/minzip/settle-it)](https://bundlephobia.com/result?p=settle-it)
[![Build Status](https://img.shields.io/github/actions/workflow/status/astoilkov/settle-it/main.yml?branch=main)](https://github.com/astoilkov/settle-it/actions/workflows/main.yml)

## Install

```bash
npm install settle-it
```

## Why

Most commonly I use `try/catch`, but in some cases it's great:
- if you prefer a one-liner
- when you want to ignore the error
- to avoid nesting `try/catch` statements
- when you [prefer const](https://eslint.org/docs/latest/rules/prefer-const), `try`/`catch` statements get in the way because you need to use `let` if you need the variable outside of the `try`/`catch` scope:
  ```ts
  let todos;
  try {
      todos = JSON.parse(localStorage.getItem('todos'))
  } catch {}
  return todos.filter(todo => todo.done)
  ```

Also:
- `err` is always an `Error` object — great for TypeScript & unexpected cases when someone `throw 'error'`
- Supports a `fallback` value.
- `fallback` can be a function that accepts the `Error` — great for working with it

## Examples

Safely parse JSON & specify the type (one-liner):
```ts
import settle from 'settle-it'

const [parsed] = settle<State>(() => JSON.parse(value))
// parsed is State | undefined
```

Prefer `const`:
```ts
const isOnline = settle(async () => {
    const response = await fetch('https://status.com/check')
    const json = response.json()
    return json.isOnline
}, false)
```

Safely fetch & on error, send to error tracking service (one-liner):
```ts
import settle from 'settle-it'

const [response] = await settle(fetch('https://todos.com/get'), sendToErrorTrackingService)
// response is Response | undefined
```

Safely read a file & fallback to empty string (one-liner):
```ts
import { readFile } from 'node:fs/promises'

const [content] = await settle(readFile(path), '')
// content is string
```

Avoid nesting `try/catch` statements:
```ts
const user = settle(() => JSON.parse(json), () => showDialog('failed to parse'))
const contents = settle(fetch(`http://example.com/${user.id}`), () => showDialog('failed to fetch'))

// to show different errors to the user you need to nest try/catch statements
```

## API

I usually prefer [source code](./index.ts) or examples ↑.

```ts
settle<T, F>(
    value: Promise | (() => T) | (() => Promise<T>),
    fallback: F | ((err: Error) => F | void)
): [T, undefined] | [F, Error]
```

- **First parameter** accepts either sync/async function or a Promise.
- **Returns** `[value, undefined]` if no error was thrown while executing the function.
- **Returns** `[fallback, Error]` is an error was thrown.
