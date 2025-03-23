# GitHub Copilot Instructions

## Case-Sensitive Filesystem

Some of our development happens on a case-sensitive filesystem. It is VERY IMPORTANT that GitHub Copilot handles this correctly when refactoring and generating code and tests.

### Guidelines

1. **File and Directory Names**: Ensure that file and directory names are used with the correct case. For example, `MyFile.ts` and `myfile.ts` are different files on a case-sensitive filesystem.
2. **Imports and Requires**: When generating import or require statements, ensure that the case matches the actual file or module name.
3. **Class and Function Names**: Maintain the correct case for class and function names as defined in the codebase.
4. **Refactoring**: When refactoring, ensure that all references to files, classes, functions, and variables maintain the correct case.

By following these guidelines, we can avoid issues related to case sensitivity in our development process.
