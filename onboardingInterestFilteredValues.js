function main() {
    return Events({
      from_date: '2024-09-22',
      to_date: '2024-09-28'
    })
    .filter(function(event) {
      return event.name === 'Onboarding Interest' &&
        (
          event.properties['interest in category'] === '🏄 Personal Use' ||
          event.properties['interest in category'] === '🏦 Business Owner' ||
          event.properties['interest in category'] === '👨‍🎨 Creator' ||
          event.properties['interest in category'] === '🕵 Other' ||
          event.properties['interest in category'] === '👨‍💻 Marketing Professional'
        );
    })
    .groupBy(["properties.$device_id", "properties.interest in category"], mixpanel.reducer.count())
    .map(function(event) {
      return {
        deviceID: event.key[0],
        category: event.key[1]
      };
    });
  }
  