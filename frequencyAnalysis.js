/*
  This query will return a frequency analysis, e.g. number of active days in time window.
  If you ask for 28 days, it will give you the # of users who did your event 1 unique day, 2 unique days, etc
  in the time window.
*/

function main() {
    return Events({
      from_date: '2018-07-01',
      to_date:   '2018-07-28',
      event_selectors: [{"event": "YOUR EVENT NAME HERE"}]
    })
    .groupByUser([mixpanel.numeric_bucket('time', mixpanel.daily_time_buckets)], mixpanel.reducer.noop())
    .groupBy(["key.0"], mixpanel.reducer.count())
    .groupBy(["value"], mixpanel.reducer.count())
    .map(row => { return { "# active days": row.key[0], "user count": row.value} });
  }