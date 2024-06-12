import * as looker from "@/lib/looker"
 
const fakeDashboardElements = [
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
const fakeFilters = { 'event_counts.message_id':  '%test_query_0%' }
const fakeQuery = {
    id: "test_query"
}
const fakeQueryResult = [{
    "event_counts.submission_timestamp_date": "2024-06-04",
    primary_rate: 0.123456789,
    other_rate: 0.987654321,
    "event_counts.user_count": {},
}];

// Mocking structuredClone
global.structuredClone = jest.fn((val) => {
    return JSON.parse(JSON.stringify(val))
})

// Mocking all SDK methods
jest.mock("../../lib/sdk", () => {
    return {
        __esModule: true,
        SDK: {
            ok: jest.fn((apiMethod) => {
                if (apiMethod === "dashboard_dashboard_elements") {
                    return fakeDashboardElements
                } else if (apiMethod === "create_query") {
                    return fakeQuery
                } else if (apiMethod === "run_query") {
                    return fakeQueryResult
                }
            }),
            dashboard_dashboard_elements: jest.fn(() => "dashboard_dashboard_elements"),
            create_query: jest.fn(() => "create_query"),
            run_query: jest.fn(() => "run_query")
        }
        
    }
});

describe("Looker", () => {
    it("should return the first dashboard element", async () => {
        const element = await looker.getAWDashboardElement0()

        expect(element).toEqual(fakeDashboardElements[0])
    })

    it("should return the query results", async () => {
        const queryResult = await looker.runEventCountQuery(fakeFilters)

        expect(queryResult).toEqual(fakeQueryResult)
    })

    it("should return the CTR percent of the primary rate", async () => {
        const id = "test_query_0"
        const template = "test_template"

        const ctrPercent = await looker.getCTRPercent(id, template)

        expect(ctrPercent).toEqual(12.3)
    })
})