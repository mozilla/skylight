type DatesProps = {
  startDate?: string
  endDate?: string
}

export function Dates({startDate, endDate} : DatesProps) {
  if (startDate || endDate) {
    return (
      <>
        {startDate} - {endDate}
      </>
    )
  }
  return ( <></>)
}
