import { getProposedEndDate } from '../../lib/experimentUtils.ts'

describe('getProposedEndDate', () => {
  it('returns the same date if the proposed duration is 0', () => {
    const startDate : string = "2020-01-01"
    const proposedDuration : number = 0

    const result = getProposedEndDate(startDate, proposedDuration)

    expect(result).toBe(startDate)
  })

  it('returns a date in the next month if appropriate', () => {
    const startDate : string = "2020-01-01"
    const proposedDuration : number = 32

    const result = getProposedEndDate(startDate, proposedDuration)

    expect(result).toBe("2020-02-02")
  })

  it('returns a date in the next year if appropriate', () => {
    const startDate : string = "2021-12-01"
    const proposedDuration : number = 32

    const result = getProposedEndDate(startDate, proposedDuration)

    expect(result).toBe("2022-01-02")
  })

  it('returns null if startDate is null', () => {
    const startDate : string | null = null
    const proposedDuration : number = 32

    const result = getProposedEndDate(startDate, proposedDuration)

    expect(result).toBeNull()
  })

  it('returns null if proposedDuration is undefined', () => {
    const startDate : string | null = "2021-12-01";
    const proposedDuration : number | undefined = undefined;

    const result = getProposedEndDate(startDate, proposedDuration)

    expect(result).toBeNull()
  })
})
