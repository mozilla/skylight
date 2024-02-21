import { _isAboutWelcomeTemplate } from '../../lib/messageUtils'

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
