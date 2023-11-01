import pIsPromise from 'p-is-promise'

export type SettleResult<T, D> = [T, undefined] | [D, Error]

type DefaultValue<D> = D | ((err: unknown) => D | void)

// promise & default value
export default function settle<T, K>(
    value: Promise<T> | (() => Promise<T>),
    defaultValue: DefaultValue<K>,
): Promise<SettleResult<T, K>>

// promise
export default function settle<T>(
    //
    value: Promise<T> | (() => Promise<T>),
): Promise<SettleResult<T, undefined>>

// function & default value
export default function settle<T, D>(
    value: () => T,
    defaultValue: DefaultValue<D>,
): SettleResult<T, D>

// function
export default function settle<T>(
    //
    value: () => T,
): SettleResult<T, undefined>

// implementation
export default function settle<T, D = void>(
    value: (() => T) | Promise<T> | (() => Promise<T>),
    defaultValue?: DefaultValue<D>,
): SettleResult<T, D> | Promise<SettleResult<T, D>> {
    const getDefaultValue = (err: unknown): D => {
        return typeof defaultValue === 'function'
            ? (defaultValue as (err: unknown) => D)(err)
            : (defaultValue as D)
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
                            resolve([getDefaultValue(err), err])
                        })
                )
            })
        }

        return [unwrappedValue, undefined]
    } catch (err) {
        return [getDefaultValue(err), err as Error]
    }
}
