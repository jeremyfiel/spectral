import { isPlainObject } from '@stoplight/json';
import AggregateError = require('es-aggregate-error');

import type { FileRuleDefinition, RuleDefinition, RulesetDefinition } from '../types';
import { validate } from './ajv';
import { convertAjvErrors } from './errors';

import { RulesetValidationError } from './errors';

export { RulesetValidationError };

export function assertValidRuleset(ruleset: unknown): asserts ruleset is RulesetDefinition {
  if (!isPlainObject(ruleset)) {
    throw new AggregateError([new RulesetValidationError('Provided ruleset is not an object', [])]);
  }

  if (!('rules' in ruleset) && !('extends' in ruleset) && !('overrides' in ruleset)) {
    throw new AggregateError([
      new RulesetValidationError('Ruleset must have rules or extends or overrides defined', []),
    ]);
  }

  if (!validate(ruleset)) {
    throw new AggregateError(convertAjvErrors(validate.errors ?? []));
  }
}

export function isValidRule(rule: FileRuleDefinition): rule is RuleDefinition {
  return typeof rule === 'object' && rule !== null && !Array.isArray(rule) && ('given' in rule || 'then' in rule);
}

export function assertValidRule(rule: FileRuleDefinition): asserts rule is RuleDefinition {
  if (!isValidRule(rule)) {
    throw new TypeError('Invalid rule');
  }
}
