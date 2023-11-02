import settle from './index'

describe('settle-it', () => {
    const cases = [
        { async: false, error: false, fallback: undefined },
        { async: false, error: true, fallback: undefined },
        { async: false, error: false, fallback: 'value' },
        { async: false, error: true, fallback: 'value' },
        { async: false, error: false, fallback: 'fn' },
        { async: false, error: true, fallback: 'fn' },
        { async: 'fn', error: false, fallback: undefined },
        { async: 'fn', error: true, fallback: undefined },
        { async: 'fn', error: false, fallback: 'value' },
        { async: 'fn', error: true, fallback: 'value' },
        { async: 'fn', error: false, fallback: 'fn' },
        { async: 'fn', error: true, fallback: 'fn' },
        { async: 'promise', error: false, fallback: undefined },
        { async: 'promise', error: true, fallback: undefined },
        { async: 'promise', error: false, fallback: 'value' },
        { async: 'promise', error: true, fallback: 'value' },
        { async: 'promise', error: false, fallback: 'fn' },
        { async: 'promise', error: true, fallback: 'fn' },
    ]

    for (const { async, error, fallback } of cases) {
        test(`async: ${async}, error: ${error}, fallback: ${fallback}`, async () => {
            const fallbackValue = Symbol('defaultValue')
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
                fallback === undefined
                    ? undefined
                    : fallback === 'value'
                    ? fallbackValue
                    : () => fallbackValue

            const result = await settle(arg1 as () => Promise<string>, arg2)

            expect(result).toEqual([
                error ? (fallback ? fallbackValue : undefined) : 'success',
                error ? new Error('error') : undefined,
            ])
        })
    }

    test('throw error as string', () => {
        const error = 'error'
        const result = settle(() => {
            throw error
        })
        expect(result).toEqual([undefined, new Error(error)])
    })

    test('throw object is converted to Error and message is JSON.stringify()', () => {
        const error = { presentableError: 'error' }
        const result = settle(() => {
            throw error
        })
        expect(result).toEqual([undefined, new Error(JSON.stringify(error))])
    })

    test(`throw object with circular refs can't be converted using JSON.stringify()`, () => {
        const error: any = {}
        error.circular = error
        const result = settle(() => {
            throw error
        })
        expect(result).toEqual([
            undefined,
            new Error(`settle-it failed to convert the thrown object to an Error object`),
        ])
    })
})
