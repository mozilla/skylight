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
    dashboard_dashboard_elements: () => fakeDashboardElements,
    create_query: () => fakeQuery,
    run_query: () => fakeQueryResult,
    ok: (apiMethod: any) => {
        return apiMethod
    }
}
