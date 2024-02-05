import { render, screen } from '@testing-library/react'
import { Dates } from '../../app/dates'

describe('Dashboard', () => {
  it('renders a Dates element', () => {
    const startDate = "2024-02-01"
    const endDate = "2024-02-04"

    render(<Dates startDate={startDate} endDate={endDate} />)

    const renderedStartDate = screen.getByText(startDate, {exact: false})
    const renderedEndDate = screen.getByText(endDate, {exact: false})

    expect(renderedStartDate).toBeInTheDocument()
    expect(renderedEndDate).toBeInTheDocument()
  })
})
