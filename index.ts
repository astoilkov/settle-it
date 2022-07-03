import pIsPromise from 'p-is-promise'

export type SettleResult<T> =
    | {
          status: 'fulfilled'
          value: T
      }
    | {
          status: 'rejected'
          reason: unknown
      }

// the same as https://github.com/sindresorhus/p-reflect but with an API that's more modern by being
// aligned with Promise.allSettled()
export default function settle<T>(value: () => T): SettleResult<T>
export default function settle<T>(value: Promise<T> | (() => Promise<T>)): Promise<SettleResult<T>>
// eslint-disable-next-line @typescript-eslint/promise-function-async
export default function settle<T>(
    value: (() => T) | Promise<T> | (() => Promise<T>),
): SettleResult<T> | Promise<SettleResult<T>> {
    try {
        const unwrappedValue = typeof value === 'function' ? value() : value

        if (pIsPromise(unwrappedValue)) {
            return new Promise((resolve) => {
                return (
                    unwrappedValue
                        // eslint-disable-next-line promise/prefer-await-to-then
                        .then((value) => {
                            resolve({ status: 'fulfilled', value })
                        })
                        // eslint-disable-next-line promise/prefer-await-to-then
                        .catch((err) => {
                            resolve({ status: 'rejected', reason: err })
                        })
                )
            })
        }

        return { status: 'fulfilled', value: unwrappedValue }
    } catch (err) {
        return { status: 'rejected', reason: err }
    }
}
