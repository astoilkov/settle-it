import pIsPromise from 'p-is-promise'

export type SettleResult<T, F> = [T, undefined] | [F, Error]

type Fallback<F> = F | ((err: Error) => F) | ((err: Error) => void)

// function & default value
export default function settle<T, F>(value: () => T, fallback: Fallback<F>): SettleResult<T, F>

// function
export default function settle<T>(
    //
    value: () => T,
): SettleResult<T, undefined>

// promise & default value
export default function settle<T, F>(
    value: Promise<T> | (() => Promise<T>),
    fallback: Fallback<F>,
): Promise<SettleResult<T, F>>

// promise
export default function settle<T>(
    //
    value: Promise<T> | (() => Promise<T>),
): Promise<SettleResult<T, undefined>>

// implementation
export default function settle<T, F = void>(
    value: (() => T) | Promise<T> | (() => Promise<T>),
    fallback?: Fallback<F>,
): SettleResult<T, F> | Promise<SettleResult<T, F>> {
    const getDefaultValue = (err: unknown): F => {
        return typeof fallback === 'function'
            ? (fallback as (err: unknown) => F)(err)
            : (fallback as F)
    }

    try {
        const unwrappedValue = typeof value === 'function' ? value() : value

        if (pIsPromise(unwrappedValue)) {
            return new Promise((resolve) => {
                return (
                    unwrappedValue
                        // eslint-disable-next-line promise/prefer-await-to-then
                        .then((value) => {
                            resolve([value, undefined])
                        })
                        // eslint-disable-next-line promise/prefer-await-to-then
                        .catch((err) => {
                            const ensured = ensureError(err)
                            resolve([getDefaultValue(ensured), ensured])
                        })
                )
            })
        }

        return [unwrappedValue, undefined]
    } catch (err) {
        const ensured = ensureError(err)
        return [getDefaultValue(ensured), ensured]
    }
}

function ensureError(error: unknown): Error {
    if (error instanceof Error) {
        return error
    } else if (typeof error === 'string') {
        return new Error(error)
    }

    try {
        return new Error(JSON.stringify(error))
    } catch (err) {
        return new Error(`settle-it failed to convert the thrown object to an Error object`)
    }
}
