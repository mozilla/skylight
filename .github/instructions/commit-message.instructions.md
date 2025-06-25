--
applyTo: "**"
description: "Instructions for composing commit messages"
--

## Motivation
All commit messages in this repository must follow these guidelines to ensure clarity, consistency, and better automation (e.g., changelogs, semantic versioning).

## How to Write Commit Messages
Commit messages must be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type

The type of change. Common types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding or correcting tests
- `chore`: Changes to the build process or auxiliary tools

### Scope

(Optional) A noun describing the section of the codebase affected (e.g., `ui`, `api`, `dashboard`).

### Description

A short summary of the change (max 80 characters, no period at the end).

### Body

(Optional) More detailed explanatory text, if necessary.

### Footer

(Optional) For breaking changes or issues closed (e.g., `BREAKING CHANGE: ...`, `Closes #123`).

---

## Examples

### Correct Examples

```
feat(ui): add dark mode toggle
```
```
fix(dashboard): correct total calculation bug
```
```
docs: update README with setup instructions
```
```
style: reformat code with Prettier
```
```
refactor(looker): simplify query logic
```
```
perf: improve dashboard load time
```
```
test: add tests for message-table component
```
```
chore: update dependencies
```

### Example with Body and Footer

```
feat(api): add user authentication endpoint

Adds a new endpoint for user authentication, including JWT generation and validation.

BREAKING CHANGE: The authentication mechanism has been changed from API keys to JWT.
Closes #42
```

### Incorrect Examples

```
update stuff
```
```
fixed bug in code
```
```
add new feature
```
```
bugfix: something
```
```
Refactored code
```
```
chore update dependencies
```

---

**Remember:**
- Use the imperative mood in the description (e.g., "add" not "adds" or "added").
- Do not capitalize the first letter of the description.
- Do not end the description with a period.
- Keep the description concise (max 80 characters).
- Use a relevant type and scope.
