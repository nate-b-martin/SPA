---
name: document
description: Add JSDoc/docstring blocks for exported symbols and inline comments for complex logic in any project file. Works on TypeScript, TSX, and MDX files.
---

## When to use me

Use this skill when the user asks to document or add comments to a file, such as "document this file", "add comments to X", "add JSDoc to X", or "add inline comments to X". The skill reads the file, analyzes its exports and logic, then adds structured comments matching the project's existing conventions.

## Workflow

1. **Confirm the target file** — If not provided, ask the user for the file path.
2. **Read the file** — Read the full file contents.
3. **Analyze code structure** — Identify:
   - Exported types/interfaces
   - Exported functions (async and sync)
   - Exported constants
   - Complex logic blocks (conditionals, loops, error handling, data transformations)
   - `'use client'` directives (these already serve as documentation and should not be commented further)
4. **Add JSDoc blocks** for every exported symbol that lacks one, following the project's existing style (see [Commenting style](#commenting-style)).
5. **Add inline comments** for complex logic that isn't immediately obvious.
6. **Do NOT** add comments to:
   - Simple `return` statements
   - Obvious JSX structures
   - Tailwind class lists
   - Import statements
   - Trivial getters/setters
7. **Do NOT** remove or modify existing comments.

## Commenting style

Match the project's existing JSDoc pattern (seen in `lib/utils.ts`, `lib/posts.ts`, `lib/experiences.ts`):

```typescript
/**
 * Short description of what the function/type does.
 * @param paramName - Description of the parameter.
 * @returns Description of the return value.
 */
```

### Rules for different constructs

| Construct | Style |
|---|---|
| Exported types/interfaces | JSDoc block describing purpose and all fields |
| Exported functions | JSDoc block with `@param` and `@returns` |
| Internal helper functions | JSDoc block |
| Complex conditionals | Brief inline comment above the condition |
| Non-obvious error handling | Brief inline comment explaining why |
| Data transformations | Brief inline comment explaining the transformation |

### Inline comment style

Use `//` comments (not `/* */`), single space after `//`. Place them on the line above the code they describe, indented to the same level.

## File type-specific guidance

### TypeScript (`*.ts`)
- Add JSDoc to all exported types, interfaces, and functions.
- Add inline comments for complex data transformations and non-obvious logic (e.g., sorting comparators, array reductions, regex patterns).

### TSX/React (`*.tsx`)
- Add JSDoc to exported components describing what they render and their props.
- Add inline comments for:
  - Non-obvious event handlers
  - Performance optimizations (memo, useCallback, useMemo)
  - Side effects in useEffect
- Skip comments for standard hooks usage (useState, basic useEffects).
- Skip comments on JSX elements with obvious Tailwind styling.

### MDX (`*.mdx`)
- This skill should generally not add comments to MDX files — they are content, not code. If invoked on an MDX file, note that MDX files typically don't need comments.

### Test files (`*.spec.ts`, `tests/`)
- Add brief inline comments for complex test setup, assertions, or Page Object interactions.
- Skip comments on standard AAA (Arrange-Act-Assert) patterns.

## Verification

After editing, read the file back to confirm comments are correctly placed and formatted. Do not modify existing functionality or formatting of the code itself.
