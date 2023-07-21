import pIsPromise from 'p-is-promise'

export type SettleResult<T> =
    | {
          status: 'success'
          value: T
      }
    | {
          status: 'error'
          reason: unknown
      }

export default function settle<T>(value: Promise<T> | (() => Promise<T>)): Promise<SettleResult<T>>
export default function settle<T>(value: () => T): SettleResult<T>
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
                            resolve({ status: 'success', value })
                        })
                        // eslint-disable-next-line promise/prefer-await-to-then
                        .catch((err) => {
                            resolve({ status: 'error', reason: err })
                        })
                )
            })
        }

        return { status: 'success', value: unwrappedValue }
    } catch (err) {
        return { status: 'error', reason: err }
    }
}
