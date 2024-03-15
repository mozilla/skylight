const {BigQuery} = require('@google-cloud/bigquery');

async function main() {
    console.log("in queryCTR");

    // Queries a public Shakespeare dataset.

        // Create a client
        const bigqueryClient = new BigQuery();

        // The SQL query to run
        const sqlQuery = `
    SELECT
        CASE
            WHEN event_counts.event = 'IMPRESSION' THEN ' Impression'
            ELSE 'Other'
        END
     AS action,
            (DATE(event_counts.submission_timestamp )) AS event_counts_submission_timestamp_date,
        COUNT(DISTINCT event_counts.client_id ) AS event_counts_user_count
    FROM \`moz-fx-data-shared-prod.firefox_desktop.onboarding\`
         AS event_counts
    WHERE (event_counts.message_id ) LIKE '%FX_MR_106_UPGRADE%' AND ((( event_counts.submission_timestamp  ) >= ((TIMESTAMP_ADD(TIMESTAMP_TRUNC(CURRENT_TIMESTAMP(), DAY, 'UTC'), INTERVAL -29 DAY))) AND ( event_counts.submission_timestamp  ) < ((TIMESTAMP_ADD(TIMESTAMP_ADD(TIMESTAMP_TRUNC(CURRENT_TIMESTAMP(), DAY, 'UTC'), INTERVAL -29 DAY), INTERVAL 30 DAY))))) AND (DATE(submission_timestamp) > '2020-01-01'
        ) AND ((( event_counts.message_id) LIKE '%\_0\_%'))
    GROUP BY
        1,
        2
    LIMIT 10
`;

        const options = {
          query: sqlQuery,
          // Location must match that of the dataset(s) referenced in the query.
          // location: 'US',
          // params: {corpus: 'romeoandjuliet', min_word_count: 250},
        };

        // Run the query
        const [rows] = await bigqueryClient.query(options);

        console.log('Rows:');
        rows.forEach(row => console.log(row));
}

main()
