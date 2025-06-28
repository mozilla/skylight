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

This is the most important rule of TDD. You must strictly follow the Red-Green-Refactor cycle for a **single test** before moving to the next. This applies to all phases, including planning.

**Your workflow for any change MUST be:**

1.  **Plan/Write ONE failing test.**
2.  **Plan/Write code to make ONLY that one test pass.**
3.  **Plan/Execute refactoring.**
4.  **THEN, and only then, can you begin the cycle for the next test.**

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

### 1. Red Phase: Write a Failing Test

- **Goal**: To clearly define a new piece of functionality or an improvement.
- **Action**: Write a single automated test case that describes a new feature or an enhancement. Focus on only one test at this stage.
- **Execution Point**: After writing the test, immediately run only this test to confirm it fails.
- **Condition for Success**: The test must fail. This is important because it proves that the test is actually testing something and that the feature doesn't already exist. If it doesn't fail, you should re-examine the test to ensure it's testing the right thing.

### 2. Green Phase: Make the Test Pass

- **Goal**: To implement the feature as quickly as possible.
- **Action**: Write the simplest possible production code to make the failing test pass. At this stage, you should not be concerned with code quality, just with passing the test.
- **Execution Point**: After implementing the feature, run all tests to ensure your implementation works without breaking existing functionality.
- **Condition for Success**: All tests, including the new one, should now pass.

### 3. Refactor Phase: Improve the Code

- **Goal**: To clean up the code while keeping it working.
- **Action**: Refactor the code you just wrote to improve its design, readability, and maintainability. This can include removing duplication, clarifying names, or simplifying the design.
- **Execution Point**: Run all tests after each significant refactoring step to verify your changes don't introduce bugs.
- **Condition for Success**: All tests must continue to pass after refactoring. This ensures that you haven't accidentally broken anything.

## Single Test Focus vs. Final Validation

### Single Test Focus During the Cycle

During the Red-Green-Refactor cycle, focus on one test at a time. This means:

- Write only one failing test
- Make only that test pass
- Refactor with that specific test in mind

After completing one cycle, you can move on to the next test and repeat the process.

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
