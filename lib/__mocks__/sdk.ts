export const fakeDashboardElements = [
    {
        query: {
            id: "test_query_0",
            model: "test model",
            view: "test view",
            client_id: "test_client_id_0"
        },
    },
    {
        query: {
            id: "test_query_1",
            model: "test model",
            view: "test view",
            client_id: "test_client_id_1"
        },
    }
]
export const fakeFilters = { 'event_counts.message_id':  '%test_query_0%' }
export const fakeQuery = {
    id: "test_query"
}
export const fakeQueryResult = [{
    "event_counts.submission_timestamp_date": "2024-06-04",
    primary_rate: 0.123456789,
    other_rate: 0.987654321,
    "event_counts.user_count": {},
}];

export function getLookerSDK(): any {
    return "mocked SDK"
}

export const SDK = {
    dashboard_dashboard_elements: () => "dashboard_dashboard_elements",
    create_query: () => "create_query",
    run_query: () => "run_query",
    ok: (apiMethod: any) => {
        if (apiMethod === "dashboard_dashboard_elements") {
            return fakeDashboardElements
        } else if (apiMethod === "create_query") {
            return fakeQuery
        } else if (apiMethod === "run_query") {
            return fakeQueryResult
        }
    }
}
