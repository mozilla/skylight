type DatesProps = {
  startDate: string | null
  endDate: string | null
}

function toPrettyDate(dateString : string | null) : string | null {
    if (!dateString) {
      return null;
    }

    let dateObj = new Date(dateString);

    return dateObj.toLocaleDateString("en-US", {
      month: "short", day: "numeric", timeZone: "UTC"
    });
}

export function PrettyDateRange({startDate, endDate} : DatesProps) {
  if (startDate || endDate) {
    return (
      <>
        <div className="font-normal text-stone-600 text-base whitespace-nowrap">
          {toPrettyDate(startDate)}-
        </div>
        <div className="font-normal text-stone-600 text-base whitespace-nowrap">
          {toPrettyDate(endDate)}
        </div>
      </>
    )
  }
  return ( <></> )
}
