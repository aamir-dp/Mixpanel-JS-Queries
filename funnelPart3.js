var funnel = params.funnel || [
    { event: "Onboarding Screen", screen: "1" },
    { event: "Onboarding Screen", screen: "2" },
    { event: "Onboarding Screen", screen: "3" },
    { event: "Onboarding Screen", screen: "question1" },
    { event: "Onboarding Screen", screen: "question2" },
    { event: "Onboarding Screen", screen: "afterQuestionVideo" },
    { event: "Onboarding Screen", screen: "Onboarding Paywall" },
    { event: "Screen View", screen: "Dashboard" },
    { event: "Screen View", screen: "PaywallWeekly" },
    { event: "Paywall Weekly Offer", screen: "done"},
    { event: "Screen View", screen: "Dashboard" }
  ];
  
  function main() {
    return Events({
      from_date: "2024-09-22",
      to_date: "2024-10-21"
    })
    .filter(function(event) {
      // Filter events to only include those from users in the US
      return event.properties.mp_country_code === "CA";
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
  