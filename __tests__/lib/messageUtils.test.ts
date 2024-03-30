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
  it('returns a correct infobar dashboard link', () => {
    const template = "infobar"
    const msgId = "123"
    const channel = "rel:ease" // weird chars test URI encoding
    const experimentSlug = "monkeys"

    const result = getDashboard(template, msgId, channel, experimentSlug)

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/1622?Messaging+System+Ping+Type=${encodeURIComponent(template)}&Submission+Date=30+days&Messaging+System+Message+Id=${encodeURIComponent(msgId)}&Normalized+Channel=${encodeURIComponent(channel)}&Normalized+OS=&Client+Info+App+Display+Version=&Normalized+Country+Code=&Experiment=${experimentSlug ? experimentSlug : ''}`
    expect(result).toEqual(expectedLink)
  })

  it('returns a correct featureCallout dashboard link', () => {
    const template = "feature_callout"
    const msgId = "1:23" // weird chars to test URI encoding

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/1672?Message+ID=%25${encodeURIComponent(msgId)}%25&Normalized+Channel=&Experiment=`

    const result = getDashboard(template, msgId)
    expect(result).toEqual(expectedLink)
  });

  // Test that get dashboard returns correct dashboards links for a given
  // for a given messageId and template === "featureCallout" and
  // experiment_slug
  it('returns a correct featureCallout experiment dashboard link', () => {
    const template = "feature_callout"
    const msgId = "123"
    const experimentSlug = "monkeys"

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/1672?Message+ID=%25123%25&Normalized+Channel=&Experiment=${experimentSlug}`

    const result = getDashboard(template, msgId, undefined, experimentSlug)
    expect(result).toEqual(expectedLink)
  });
})