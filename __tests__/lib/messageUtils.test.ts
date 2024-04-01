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

    const result = getDashboard(template, msgId, channel)

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/1622?Messaging+System+Ping+Type=${encodeURIComponent(template)}&Submission+Date=30+days&Messaging+System+Message+Id=${encodeURIComponent(msgId)}&Normalized+Channel=${encodeURIComponent(channel)}&Normalized+OS=&Client+Info+App+Display+Version=&Normalized+Country+Code=`
    expect(result).toEqual(expectedLink)
  })

  it('returns a correct featureCallout dashboard link', () => {
    const template = "feature_callout"
    const msgId = "1:23" // weird chars to test URI encoding

    const expectedLink = `https://mozilla.cloud.looker.com/dashboards/1471?Message+ID=%25${encodeURIComponent(msgId)}%25&Normalized+Channel=`

    const result = getDashboard(template, msgId)
    expect(result).toEqual(expectedLink)
  });

})