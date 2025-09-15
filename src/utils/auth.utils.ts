import type { ValidationRule } from 'quasar';

export function requiredRules(message: string): ValidationRule[] {
  return [(val: ValidationRule) => !!val || message];
}
