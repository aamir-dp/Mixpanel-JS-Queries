function main() {
    // Fetch events from the specified date range
    return Events({
      from_date: '2024-01-01',
      to_date: '2024-12-31'
    })
    // Filter for only the 'Template View' events
    .filter(function(event) {
      return event.name === 'Template View';
    })
    // Group by the 'template name' property to get unique codes
    .groupBy(["properties.template name"], mixpanel.reducer.count())
    // Extract the unique codes from the grouped result
    .map(function(item) {
      return item.key[0]; // Returns only the unique 'code'
    });
  }
  