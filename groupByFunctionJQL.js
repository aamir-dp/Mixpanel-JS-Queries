function main() {
    return Events({
      from_date: '2024-10-01',
      to_date: '2024-10-28'
    })
    .filter(function(event) {
      return event.name === 'Onboarding Interest' && event.properties["mp_country_code"];
    })
    .groupBy(["properties.mp_country_code", "properties.interest in category"], mixpanel.reducer.count())
    .filter(function(group) {   // Additional filter to exclude null countries after grouping
      return group.key[0] !== null;
    })
    .map(function(event) {
      return {
        Country: event.key[0],
        Interest: event.key[1],
        Count: event.value  // Count of occurrences for each Interest-Country pair
      };
    });
  }
  