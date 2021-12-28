import AggregateError = require('es-aggregate-error');

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toThrowAggregateError(error: AggregateError): R;
    }
  }
}

expect.extend({
  toThrowAggregateError(received, expected) {
    expect(received).toThrow(AggregateError);
    try {
      received();
    } catch (e) {
      expect((e as AggregateError).errors).toEqual(expected.errors);
    }

    return {
      message: () => 'good',
      pass: true,
    };
  },
});
