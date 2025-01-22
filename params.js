params = {
    start_date: "2024-10-01", //select the date range
    end_date: "2024-10-22",
    events: ["Paywall Long"] //add the event names as defined in the schema, you can add multiple
  };
  
  function main() {
    return Events({
      from_date: params.start_date, 
      to_date: params.end_date,
      event_selectors: _.map(params.events, event => ({event: event})) //return all parameters
    });
  }