**hightlight-nano** - minimal code highlighter

## Extra information

- `spec.md` - project specification
- `readme.md` - describes public interface and usage
- `files.md` - project structure overview for code location reference

## Technology stack

This project contains logic only, no UI components.

- typescript
- vitests for tests

## Testing guidelines

### Tests execution

`yarn run test:run`

- Run tests after completing each task
- Fix or update tests as needed
- Add new tests to reflect new functionality
- Test module interfaces at their appropriate level rather than limiting to top-level public API
- Focus on testing interface contracts, not internal implementation details

### Tests organization

- Store tests in `__tests__/file.test.ts` next to source files
- Name test files with same base name as source file plus `.test` suffix
- Do not use describe sections in tests

## Documentation updates

- Update `readme.md` when changes affect the public interface
- Update `spec.md` when implementation differs from original specification

## Development Workflow

- Review specification
- Implement functionality
- Add/update tests for new features
- Run test suite and fix any failures
- Update documentation if interface changes
- Update spec if approach deviates from original plan
- Make commit
