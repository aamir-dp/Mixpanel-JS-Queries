function main() {
    return Events({
      from_date: '2024-09-22', //select date range
      to_date: '2024-09-28'
    })
    .filter(function(event) {
      return event.name === 'Onboarding Purchase'; //select event name as defined in the schema
    })
    //groupby function to group the properties of the event selected above
    .groupBy(
        ["properties.$device_id", 
            "properties.mp_country_code", 
            "properties.user_cat", 
            "properties.payment plan", 
            "properties.status", 
            "properties.code"], mixpanel.reducer.count())
    .map(function(event) {
      return {
        deviceID: event.key[0],
        countryCode: event.key[1],
        category: event.key[2],
        paymentPlan: event.key[3],
        status: event.key[4],
        code: event.key[5]
        
      };
    });
  }
  