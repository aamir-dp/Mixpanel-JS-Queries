var funnel = params.funnel || [
    { event: "Onboarding Screen", screen: "1" },
    { event: "Screen View", screen: "Paywall Long" },
    { event: "Paywall Long", screen: "done"},
    { event: "Screen View", screen: "Dashboard" }
  ];
  
  function main() {
    return Events({
      from_date: "2024-12-08",
      to_date: "2024-12-10"
    })
    .filter(function(event) {
      // Filter events to only include those from users in the US
      return event.properties.mp_country_code === "US";
    })
    .groupByUser(function(steps_completed, events) {
      steps_completed = steps_completed || 0;
  
      _.each(events, function(e) {
        // Check each funnel step dynamically and only proceed for US users
        if (steps_completed < funnel.length) {
          var currentStep = funnel[steps_completed];
          if (e.name === currentStep.event && (e.properties["Screen Name"] === currentStep.screen || e.properties["screen info"] === currentStep.screen || e.properties["status"] === currentStep.screen)) {
            steps_completed++;
          }
        }
      });
  
      return steps_completed;
    })
    .filter(function(item) { return item.value > 0 })
    .reduce(function(accumulators, users_with_final_steps) {
      var funnel_steps = new Array(funnel.length).fill(0);
      _.each(users_with_final_steps, function(user) {
        for (var i = 0; i < user.value; i++) {
          funnel_steps[i]++;
        }
      });
  
      _.each(accumulators, function(accumulator) {
        _.each(accumulator, function(step_count, i) {
          funnel_steps[i] += step_count;
        });
      });
  
      return funnel_steps;
    });
  }
  