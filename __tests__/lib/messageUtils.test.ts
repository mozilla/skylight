import { getDashboard, _isAboutWelcomeTemplate, toBinary, getDashboardIdForTemplate, getSubmissionTimestampDateFilter } from '@/lib/messageUtils'

describe('isAboutWelcomeTemplate', () => {
  it('returns true if a feature_callout', () => {
    const sampleSurface = "feature_callout"

    const result = _isAboutWelcomeTemplate(sampleSurface)

    expect(result).toBeTruthy()
  })

  it("returns false if an infobar", () => {
    const sampleSurface = "infobar"

    const result = _isAboutWelcomeTemplate(sampleSurface)

    expect(result).toBeFalsy()
  })
})

describe('toBinary', () => {
  // Bringing the 'fromBinary' function over from
  // messagepreview to prove it works
  function fromBinary(encoded: string): string {
    const binary = atob(decodeURIComponent(encoded));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
  }

  it('correctly encodes a latin string', () => {
    const testString = "Hi I am a test string";
    const expectedResult = "SABpACAASQAgAGEAbQAgAGEAIAB0AGUAcwB0ACAAcwB0AHIAaQBuAGcA";

    const encodedResult = toBinary(testString);

    expect(encodedResult).toEqual(expectedResult)

    const decodedResult = fromBinary(encodedResult);

    expect(decodedResult).toEqual(testString);
  })

  it('correctly encodes a non-latin string', () => {
    const nonLatinString = "тестовое сообщение";
    const expectedResult = "QgQ1BEEEQgQ+BDIEPgQ1BCAAQQQ+BD4EMQRJBDUEPQQ4BDUE";

    const encodedResult = toBinary("тестовое сообщение");

    expect(encodedResult).toEqual(expectedResult);

    const decodedResult = fromBinary(encodedResult);

    expect(decodedResult).toEqual(nonLatinString);
  })
})

describe('getDashboard', () => {
  it('returns a correct infobar dashboard link w/exp & branch', () => {
    const template = "infobar"
    const msgId = "12`3" // weird chars to test URI encoding
    const channel = "release"
    const experiment = "experiment:test"
    const branchSlug = "treatment:a"
    const dashboardId = getDashboardIdForTemplate(template)

    const result = getDashboard(template, msgId, channel, experiment, branchSlug)

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/${dashboardId}?Messaging+System+Ping+Type=${encodeURIComponent(template)}&Submission+Date=30%20day%20ago%20for%2030%20day&Messaging+System+Message+Id=${encodeURIComponent(msgId)}&Normalized+Channel=${encodeURIComponent(channel)}&Normalized+OS=&Client+Info+App+Display+Version=&Normalized+Country+Code=&Experiment=${encodeURIComponent(experiment)}&Experiment+Branch=${encodeURIComponent(branchSlug)}`
    expect(result).toEqual(expectedLink)
  })

  it('returns a correct featureCallout dashboard link', () => {
    const template = "feature_callout"
    const msgId = "1:23" // weird chars to test URI encoding
    const dashboardId = getDashboardIdForTemplate(template)

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/${dashboardId}?Submission+Timestamp+Date=30%20day%20ago%20for%2030%20day&Message+ID=%25${encodeURIComponent(msgId)}%25&Normalized+Channel=&Experiment=&Branch=`

    const result = getDashboard(template, msgId)
    expect(result).toEqual(expectedLink)
  });

  // XXX should this be "about:welcome" to be consistent with featureIds?
  it('returns a correct aboutwelcome dashboard link w/exp & branch', () => {
    const template = "aboutwelcome"
    const msgId = "1:23" // weird chars to test URI encoding
    const experiment = "experiment:test"
    const branchSlug = "treatment:a"
    const dashboardId = getDashboardIdForTemplate(template)

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/${dashboardId}?Submission+Timestamp+Date=30%20day%20ago%20for%2030%20day&Message+ID=%25${encodeURIComponent(msgId.toUpperCase())}%25&Normalized+Channel=&Experiment=${encodeURIComponent(experiment)}&Branch=${encodeURIComponent(branchSlug)}`

    const result = getDashboard(template, msgId, undefined, experiment, branchSlug)
    expect(result).toEqual(expectedLink)
  });

  it('returns a correct dashboard link with defined start and end dates where the end date is in the future', () => {
    const template = "feature_callout"
    const msgId = "1:23" // weird chars to test URI encoding
    const startDate = "2024-03-08"
    const endDate = "2025-06-28"
    const dashboardId = getDashboardIdForTemplate(template)

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/${dashboardId}?Submission+Timestamp+Date=2024-03-08%20to%202025-06-28&Message+ID=%25${encodeURIComponent(msgId)}%25&Normalized+Channel=&Experiment=&Branch=`

    const result = getDashboard(template, msgId, undefined, undefined, undefined, startDate, endDate)
    expect(result).toEqual(expectedLink)
  })

  it('returns a correct dashboard link with defined start and end dates where the end date is in the past', () => {
    const template = "feature_callout"
    const msgId = "1:23" // weird chars to test URI encoding
    const startDate = "2024-03-08"
    const endDate = "2024-05-28"
    const dashboardId = getDashboardIdForTemplate(template)

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/${dashboardId}?Submission+Timestamp+Date=2024-03-08%20to%20today&Message+ID=%25${encodeURIComponent(msgId)}%25&Normalized+Channel=&Experiment=&Branch=`

    const result = getDashboard(template, msgId, undefined, undefined, undefined, startDate, endDate)
    expect(result).toEqual(expectedLink)
  })

  it('returns a correct dashboard link with a defined start date', () => {
    const template = "feature_callout"
    const msgId = "1:23" // weird chars to test URI encoding
    const startDate = "2024-03-08"
    const dashboardId = getDashboardIdForTemplate(template)

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/${dashboardId}?Submission+Timestamp+Date=2024-03-08%20to%20today&Message+ID=%25${encodeURIComponent(msgId)}%25&Normalized+Channel=&Experiment=&Branch=`

    const result = getDashboard(template, msgId, undefined, undefined, undefined, startDate, null)
    expect(result).toEqual(expectedLink)
  })
})

describe("getSubmissionTimestampDateFilter", () => {
  it("returns the default date filter when startDate and endDate are null", () => {
    const result = getSubmissionTimestampDateFilter(null, null);

    expect(result).toEqual("30 day ago for 30 day");
  })

  it("returns a date filter from the startDate to today when endDate is null", () => {
    const startDate = "2024-06-20";

    const result = getSubmissionTimestampDateFilter(startDate, null);

    expect(result).toEqual("2024-06-20 to today");
  })

  it("returns a date filter from the startDate to today when startDate and endDate are defined and endDate is in the past", () => {
    const startDate = "2024-05-08";
    const endDate = "2024-06-10";

    const result = getSubmissionTimestampDateFilter(startDate, endDate);

    expect(result).toEqual("2024-05-08 to today");
  })

  it("returns a date filter from the startDate to endDate when startDate and endDate are defined and endDate is in the future", () => {
    const startDate = "2024-05-08";
    const endDate = "3024-06-10";

    const result = getSubmissionTimestampDateFilter(startDate, endDate);

    expect(result).toEqual("2024-05-08 to 3024-06-10");
  })
})