import settle from './index'

describe('settle-it', () => {
    test(`a function that doesn't throw is successful`, () => {
        const result = settle(() => 'value')

        expect(result).toEqual({
            status: 'success',
            value: 'value',
        })
    })

    test(`a function that throws is an error`, () => {
        const result = settle(() => {
            throw new Error('error')
        })

        expect(result).toEqual({
            status: 'error',
            reason: new Error('error'),
        })
    })

    test(`a promise that resolves is successful`, async () => {
        const result = await settle(Promise.resolve('value'))

        expect(result).toEqual({
            status: 'success',
            value: 'value',
        })
    })

    test(`a promise that rejects is an error`, async () => {
        const result = await settle(Promise.reject(new Error('error')))

        expect(result).toEqual({
            status: 'error',
            reason: new Error('error'),
        })
    })

    test(`second parameter supports a function that returns a promise (success)`, async () => {
        const result = await settle(() => Promise.resolve('value'))

        expect(result).toEqual({
            status: 'success',
            value: 'value',
        })
    })

    test(`second parameter supports a function that returns a promise (error)`, async () => {
        const result = await settle(() => Promise.reject(new Error('error')))

        expect(result).toEqual({
            status: 'error',
            reason: new Error('error'),
        })
    })
})
