import settle from './index'

describe('settle-it', () => {
    const cases = [
        { async: false, error: false, defaultValue: false },
        { async: false, error: true, defaultValue: false },
        { async: false, error: false, defaultValue: 'value' },
        { async: false, error: true, defaultValue: 'value' },
        { async: false, error: false, defaultValue: 'fn' },
        { async: false, error: true, defaultValue: 'fn' },
        { async: 'fn', error: false, defaultValue: false },
        { async: 'fn', error: true, defaultValue: false },
        { async: 'fn', error: false, defaultValue: 'value' },
        { async: 'fn', error: true, defaultValue: 'value' },
        { async: 'fn', error: false, defaultValue: 'fn' },
        { async: 'fn', error: true, defaultValue: 'fn' },
        { async: 'promise', error: false, defaultValue: false },
        { async: 'promise', error: true, defaultValue: false },
        { async: 'promise', error: false, defaultValue: 'value' },
        { async: 'promise', error: true, defaultValue: 'value' },
        { async: 'promise', error: false, defaultValue: 'fn' },
        { async: 'promise', error: true, defaultValue: 'fn' },
    ]

    for (const { async, error, defaultValue } of cases) {
        test(`async: ${async}, error: ${error}, defaultValue: ${defaultValue}`, async () => {
            const defaultValueSymbol = Symbol('defaultValue')
            const arg1 =
                async === 'fn'
                    ? async () =>
                          error ? Promise.reject(new Error('error')) : Promise.resolve('success')
                    : async === 'promise'
                    ? error
                        ? Promise.reject(new Error('error'))
                        : Promise.resolve('success')
                    : () => {
                          if (error) {
                              throw new Error('error')
                          } else {
                              return 'success'
                          }
                      }
            const arg2 =
                defaultValue === false
                    ? undefined
                    : defaultValue === 'value'
                    ? defaultValueSymbol
                    : () => defaultValueSymbol

            const result = await settle(arg1 as () => Promise<string>, arg2)

            expect(result).toEqual([
                error ? (defaultValue ? defaultValueSymbol : undefined) : 'success',
                error ? new Error('error') : undefined,
            ])
        })
    }
})
