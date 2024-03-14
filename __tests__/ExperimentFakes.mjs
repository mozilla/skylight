/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This file forked from https://searchfox.org/mozilla-central/source/toolkit/components/nimbus/test/NimbusTestUtils.sys.mjs

export const ExperimentFakes = {
  experiment(slug, props = {}) {
    return {
      slug,
      active: true,
      branch: {
        slug: "treatment",
        features: [
          {
            featureId: "testFeature",
            value: { testInt: 123, enabled: true },
          },
        ],
        ...props,
      },
      source: "NimbusTestUtils",
      isEnrollmentPaused: true,
      experimentType: "NimbusTestUtils",
      userFacingName: "NimbusTestUtils",
      userFacingDescription: "NimbusTestUtils",
      lastSeen: new Date().toJSON(),
      featureIds: props?.branch?.features?.map(f => f.featureId) || [
        "testFeature",
      ],
      ...props,
    };
  },
  rollout(slug, props = {}) {
    return {
      slug,
      active: true,
      isRollout: true,
      branch: {
        slug: "treatment",
        features: [
          {
            featureId: "testFeature",
            value: { testInt: 123, enabled: true },
          },
        ],
        ...props,
      },
      source: "NimbusTestUtils",
      isEnrollmentPaused: true,
      experimentType: "rollout",
      userFacingName: "NimbusTestUtils",
      userFacingDescription: "NimbusTestUtils",
      lastSeen: new Date().toJSON(),
      featureIds: (props?.branch?.features || props?.features)?.map(
        f => f.featureId
      ) || ["testFeature"],
      ...props,
    };
  },
  recipe(slug, props = {}) {
    return {
      // This field is required for populating remote settings
      id: slug,
      schemaVersion: "1.7.0",
      appName: "firefox_desktop",
      appId: "firefox-desktop",
      channel: "nightly",
      slug,
      isEnrollmentPaused: false,
      probeSets: [],
      startDate: null,
      endDate: null,
      proposedEnrollment: 7,
      referenceBranch: "control",
      application: "firefox-desktop",
      branches: ExperimentFakes.recipe.branches,
      bucketConfig: ExperimentFakes.recipe.bucketConfig,
      userFacingName: "Nimbus recipe",
      userFacingDescription: "NimbusTestUtils recipe",
      featureIds: props?.branches?.[0].features?.map(f => f.featureId) || [
        "testFeature",
      ],
      ...props,
    };
  },
};

Object.defineProperty(ExperimentFakes.recipe, "bucketConfig", {
  get() {
    return {
      namespace: "nimbus-test-utils",
      randomizationUnit: "normandy_id",
      start: 0,
      count: 100,
      total: 1000,
    };
  },
});

Object.defineProperty(ExperimentFakes.recipe, "branches", {
  get() {
    return [
      {
        slug: "control",
        ratio: 1,
        features: [
          {
            featureId: "testFeature",
            value: { testInt: 123, enabled: true },
          },
        ],
      },
      {
        slug: "treatment",
        ratio: 1,
        features: [
          {
            featureId: "testFeature",
            value: { testInt: 123, enabled: true },
          },
        ],
      },
    ];
  },
});
