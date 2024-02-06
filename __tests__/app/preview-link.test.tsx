import { render, screen } from '@testing-library/react'
import { PreviewLink } from '../../app/preview-link'

describe('PreviewLink', () => {
  it('renders a PreviewLink element', () => {
    render(<PreviewLink linkUrl={new URL("https://localhost:3000/")} />)

    // XXX sometimes a link, sometimes a button, decide what to do there
    // probably also refactor the link case into the overall component and
    // change name

    const previewButton = screen.getByRole('button')

    expect(previewButton).toBeInTheDocument()
  })
  // XXX test handler
  // XXX test tooltip
})
