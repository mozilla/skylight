import { getDashboard, _isAboutWelcomeTemplate, toBinary } from '@/lib/messageUtils'

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

    const result = getDashboard(template, msgId, channel, experiment, branchSlug)

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/1682?Messaging+System+Ping+Type=${encodeURIComponent(template)}&Submission+Date=30+days&Messaging+System+Message+Id=${encodeURIComponent(msgId)}&Normalized+Channel=${encodeURIComponent(channel)}&Normalized+OS=&Client+Info+App+Display+Version=&Normalized+Country+Code=&Experiment=${encodeURIComponent(experiment)}&Experiment+Branch=${encodeURIComponent(branchSlug)}`
    expect(result).toEqual(expectedLink)
  })

  it('returns a correct featureCallout dashboard link', () => {
    const template = "feature_callout"
    const msgId = "1:23" // weird chars to test URI encoding

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/1677?Message+ID=%25${encodeURIComponent(msgId)}%25&Normalized+Channel=&Experiment=&Branch=`

    const result = getDashboard(template, msgId)
    expect(result).toEqual(expectedLink)
  });

  // XXX should this be "about:welcome" to be consistent with featureIds?
  it('returns a correct aboutwelcome dashboard link w/exp & branch', () => {
    const template = "aboutwelcome"
    const msgId = "1:23" // weird chars to test URI encoding
    const experiment = "experiment:test"
    const branchSlug = "treatment:a"

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/1677?Message+ID=%25${encodeURIComponent(msgId.toUpperCase())}%25&Normalized+Channel=&Experiment=${encodeURIComponent(experiment)}&Branch=${encodeURIComponent(branchSlug)}`

    const result = getDashboard(template, msgId, undefined, experiment, branchSlug)
    expect(result).toEqual(expectedLink)
  });

})
