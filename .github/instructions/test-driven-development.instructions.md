---
applyTo: "**"
description: Test-driven development
---

# Test-Driven Development (TDD) Instructions

## Overview

Test-Driven Development is a software development process where you write tests _before_ you write the production code. This process is iterative and ensures that your code is well-tested and meets the requirements. The core of TDD is the "Red-Green-Refactor" cycle.

## The Red-Green-Refactor Cycle

This cycle is the heart of TDD. Each phase has a specific purpose and focuses on a single test at a time:

**CRITICAL TDD RULE: ONE TEST AT A TIME. NO EXCEPTIONS.**

This is the most important rule of TDD. You must strictly follow the Red-Green-Refactor cycle for a **single test** before moving to the next.

- **Step 1: Red — Write a Failing Test**
  - **Action:** Write a single automated test for one piece of functionality.
  - **Verification:** Immediately run the test suite. You **MUST** confirm that the new test fails and **MUST** state the result. This is non-negotiable.

- **Step 2: Green — Make the Test Pass**
  - **Action:** Write the simplest possible code to make the one failing test pass.
  - **Verification:** Immediately run the entire test suite. You **MUST** confirm that all tests now pass and **MUST** state the result.

- **Step 3: Refactor — Improve the Code**
  - **Action:** Clean up the code you just wrote.
  - **Verification:** After refactoring, run the entire test suite again. You **MUST** confirm that all tests still pass and **MUST** state the result.

**Only after completing all three steps for a single test can you begin the cycle for the next test.**

When asked to create a plan, **do not** outline all the tests at once. Your plan must be a sequence of single Red-Green-Refactor cycles.

**Example of a Correct Plan:**

- **Cycle 1: Test basic functionality**
  1.  **Red:** Propose a failing test for the primary success case.
  2.  **Green:** Propose the simplest code change to pass the test.
  3.  **Refactor:** Propose any necessary code cleanup.
- **Cycle 2: Test an edge case**
  1.  **Red:** Propose a failing test for a specific edge case.
  2.  **Green:** Propose code changes to handle this edge case.
  3.  **Refactor:** Propose refactoring for the new code.

This structure ensures that you never propose or write code for more than one test at a time.

### TDD for Refactoring

When refactoring existing code, it's crucial to ensure that all behaviors of the functionality are preserved. This often requires a series of TDD cycles, each focused on a specific aspect of the functionality. Your plan should reflect this by breaking down the refactoring process into multiple Red-Green-Refactor cycles.

A comprehensive refactoring plan should cover:

1.  **The Primary Success Case**: The main functionality.
2.  **Edge Cases**: Foreseeable alternative scenarios.
3.  **Error Conditions**: How the code should behave on invalid input or in unexpected situations.

**Example of a Refactoring Plan:**

Let's say you're refactoring a `getPreviewLink` function. A good plan would consist of multiple TDD cycles:

- **Cycle 1: Test the primary success case**
  1.  **Red:** Write a failing test for generating a link with valid inputs.
  2.  **Green:** Implement the simplest code to make the test pass.
  3.  **Refactor:** Clean up the implementation.
- **Cycle 2: Test an edge case (e.g., a missing optional parameter)**
  1.  **Red:** Write a failing test for when an optional parameter is `null` or `undefined`.
  2.  **Green:** Modify the code to handle the missing parameter gracefully.
  3.  **Refactor:** Improve the code.
- **Cycle 3: Test an error condition (e.g., a required parameter is missing)**
  1.  **Red:** Write a failing test for when a required parameter is missing, expecting an error to be thrown.
  2.  **Green:** Add the necessary validation to throw an error.
  3.  **Refactor:** Clean up the validation logic.

By breaking down the refactoring of a single feature into multiple, focused TDD cycles, you ensure that all of its behaviors are tested and preserved.

### 1. Red Phase: Write a Failing Test

- **Goal**: To clearly define a new piece of functionality or an improvement.
- **Action**: Write a single automated test case that describes a new feature or an enhancement. Focus on only one test at this stage.
- **Verification**: After writing the test, you **MUST** run the test suite and state the result. The test **MUST** fail as expected. This proves that the test is valid and that the feature doesn't already exist. If it passes, the test is wrong.

### 2. Green Phase: Make the Test Pass

- **Goal**: To implement the feature as quickly as possible.
- **Action**: Write the simplest possible production code to make the failing test pass. At this stage, you should not be concerned with code quality, just with passing the test.
- **Verification**: After writing the code, you **MUST** run the entire test suite and state the result. All tests, including the new one, **MUST** pass. This confirms your new code works and hasn't introduced any regressions.

### 3. Refactor Phase: Improve the Code

- **Goal**: To clean up the code while keeping it working.
- **Action**: Refactor the code you just wrote to improve its design, readability, and maintainability. This can include removing duplication, clarifying names, or simplifying the design.
- **Verification**: After each significant refactoring step, you **MUST** run the entire test suite and state the result. All tests **MUST** continue to pass. This ensures your refactoring has not introduced any bugs.

## Single Test Focus vs. Final Validation

### Single Test Focus During the Cycle

During the Red-Green-Refactor cycle, focus on one test at a time. This means:

- Write only one failing test
- Make only that test pass
- Refactor with that specific test in mind

After completing one cycle, you must stop and wait for further instructions before starting the next cycle.

### Final Validation Before Committing

Before committing your code, always run the complete test suite one final time to ensure everything works together correctly. Tests should be fast enough to run frequently without disrupting your workflow, as slow tests discourage frequent execution and can undermine the TDD process.

## Benefits of TDD

- **High Test Coverage**: Every line of code is written to make a test pass, resulting in a comprehensive test suite.
- **Better Design**: Writing tests first forces you to think about the design and interface of your code from a user's perspective.
- **Confidence to Refactor**: A comprehensive test suite gives you the confidence to make changes and improvements to your code without fear of breaking it.
- **Living Documentation**: The tests serve as a form of documentation that describes how the code is supposed to work.

## Guidelines for Writing Good Tests

- **Test One Thing at a Time**: Each test should focus on a single piece of functionality.
- **One Test Per Cycle**: Work with only one test through a complete Red-Green-Refactor cycle before moving to the next test.
- **Keep Tests Small and Fast**: Small, fast tests can be run frequently, providing rapid feedback.
- **Use Descriptive Names**: Test names should clearly describe what they are testing.
- **Isolate Tests**: Tests should not depend on each other. Each test should be able to run independently.
