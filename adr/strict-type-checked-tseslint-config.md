# ADR: Adopt typescript-eslint strict-type-checked Configuration

**Date:** 2025-05-29  
**Status:** Proposed

## Context

Our music app currently uses basic TypeScript linting but lacks comprehensive type safety checks. As the codebase grows with complex state management (via URL query params) and new functionality will be added in the future, we need stricter type checking to catch potential runtime errors early.

## Decision

Adopt `@typescript-eslint/strict-type-checked` configuration to increase type safety across the codebase.

## Alternatives Considered

1. **Keep current config** - No work required but misses bug prevention opportunities
2. **Gradual rule adoption** - More control but slower implementation

## Consequences

### Positive
- Catch more runtime errors at compile time
- Better IDE experience and refactoring safety
- Standardized type safety practices

### Negative
- Initial time investment to fix existing violations
- Stricter development constraints
- Learning curve for new rules

## Implementation

**Phase 1 (Week 1):** Setup configuration and assess violations  
**Phase 2 (Weeks 2):** Fix type-safety violations  

## Review Date

July 2025 - Assess impact on development speed, bug reduction, and developer satisfaction.

## References

- [TypeScript ESLint Strict Type Checked Configuration](https://typescript-eslint.io/users/configs/#strict-type-checked)
- [TypeScript ESLint Rules Documentation](https://typescript-eslint.io/rules/)
- [TypeScript Handbook: Strictness](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#strictness)