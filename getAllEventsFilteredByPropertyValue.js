function main() {
  
    return Events({
      from_date: '2024-09-24',
      to_date: '2024-09-24',
      event_selectors: [
          {event: 'Onboarding Purchase', selector: '"done" in properties["status"]'}
      ]
    });
  }
  