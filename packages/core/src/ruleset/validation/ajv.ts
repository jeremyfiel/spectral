import Ajv, { _ } from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';
import * as ruleSchema from '../../meta/rule.schema.json';
import * as shared from '../../meta/shared.json';
import * as rulesetSchema from '../../meta/ruleset.schema.json';

const message = _`'spectral-message'`;

const ajv = new Ajv({ allErrors: true, strict: true, strictRequired: false, keywords: ['$anchor'] });
addFormats(ajv);
addErrors(ajv);
ajv.addKeyword({
  keyword: 'spectral-runtime',
  schemaType: 'string',
  error: {
    message(ctx) {
      return _`${ctx.data}[Symbol.for(${message})] ?? 'must be a function'`;
    },
  },
  code(cxt) {
    const { data } = cxt;

    switch (cxt.schema as unknown) {
      case 'spectral-format':
        cxt.fail(_`typeof ${data} !== "function"`);
        break;
      case 'spectral-function':
        cxt.pass(_`typeof ${data}.function === "function"`);
        cxt.pass(
          _`(() => { try { ${data}.function.validator && ${data}.function.validator('functionOptions' in ${data} ? ${data} : null); return true; } catch (e) { ${data}[Symbol.for(${message})] = e.message; return false; } })()`,
        );
        break;
    }
  },
});

export const validate = ajv.addSchema(ruleSchema).addSchema(shared).compile(rulesetSchema);
