import {
  getProposedEndDate,
  _substituteLocalizations,
} from "../../lib/experimentUtils.ts";

import { types } from "@mozilla/nimbus-shared";
type NimbusExperiment = types.experiments.NimbusExperiment;

const LOCALIZATIONS = {
  foo: "localized foo text",
  qux: "localized qux text",
  grault: "localized grault text",
  waldo: "localized waldo text",
};

const DEEPLY_NESTED_VALUE = {
  foo: {
    $l10n: {
      id: "foo",
      comment: "foo comment",
      text: "original foo text",
    },
  },
  bar: {
    qux: {
      $l10n: {
        id: "qux",
        comment: "qux comment",
        text: "original qux text",
      },
    },
    quux: {
      grault: {
        $l10n: {
          id: "grault",
          comment: "grault comment",
          text: "orginal grault text",
        },
      },
      garply: "original garply text",
    },
    corge: "original corge text",
  },
  baz: "original baz text",
  waldo: [
    {
      $l10n: {
        id: "waldo",
        comment: "waldo comment",
        text: "original waldo text",
      },
    },
  ],
};

const LOCALIZED_DEEPLY_NESTED_VALUE = {
  foo: "localized foo text",
  bar: {
    qux: "localized qux text",
    quux: {
      grault: "localized grault text",
      garply: "original garply text",
    },
    corge: "original corge text",
  },
  baz: "original baz text",
  waldo: ["localized waldo text"],
};

describe("getProposedEndDate", () => {
  it("returns the same date if the proposed duration is 0", () => {
    const startDate: string = "2020-01-01";
    const proposedDuration: number = 0;

    const result = getProposedEndDate(startDate, proposedDuration);

    expect(result).toBe(startDate);
  });

  it("returns a date in the next month if appropriate", () => {
    const startDate: string = "2020-01-01";
    const proposedDuration: number = 32;

    const result = getProposedEndDate(startDate, proposedDuration);

    expect(result).toBe("2020-02-02");
  });

  it("returns a date in the next year if appropriate", () => {
    const startDate: string = "2021-12-01";
    const proposedDuration: number = 32;

    const result = getProposedEndDate(startDate, proposedDuration);

    expect(result).toBe("2022-01-02");
  });

  it("returns null if startDate is null", () => {
    const startDate: string | null = null;
    const proposedDuration: number = 32;

    const result = getProposedEndDate(startDate, proposedDuration);

    expect(result).toBeNull();
  });

  it("returns null if proposedDuration is undefined", () => {
    const startDate: string | null = "2021-12-01";
    const proposedDuration: number | undefined = undefined;

    const result = getProposedEndDate(startDate, proposedDuration);

    expect(result).toBeNull();
  });
});

describe("_substituteLocalizations", () => {
  it("returns the values unchanged if there are no localizations", () => {
    const result = _substituteLocalizations(DEEPLY_NESTED_VALUE);

    expect(result).toEqual(DEEPLY_NESTED_VALUE);
  });

  it("returns a localized recipe if there are localizations", () => {
    const result = _substituteLocalizations(DEEPLY_NESTED_VALUE, LOCALIZATIONS);

    expect(result).toEqual(LOCALIZED_DEEPLY_NESTED_VALUE);
  });
});
