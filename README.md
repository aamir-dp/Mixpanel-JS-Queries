
# JQL Queries Documentation for Mixpanel

This document provides a comprehensive explanation of the provided JavaScript Query Language (JQL) queries for Mixpanel. These queries are used to analyze event data, group users by properties, and perform funnel analysis. 

## Query 1: Fetch Unique Template Names from Events

```javascript
function main() {
    return Events({
        from_date: '2024-01-01',
        to_date: '2024-12-31'
    })
    .filter(function(event) {
        return event.name === 'Template View';
    })
    .groupBy(["properties.template name"], mixpanel.reducer.count())
    .map(function(item) {
        return item.key[0];
    });
}
```
### Description:
- **Goal:** Fetch unique template names from "Template View" events within a specified date range.
- **Steps:**
  1. Filter events to include only `Template View`.
  2. Group events by the `template name` property.
  3. Extract and return unique template names.

---

## Query 2: Fetch Events Based on Parameters

```javascript
params = {
    start_date: "2024-10-01",
    end_date: "2024-10-22",
    events: ["Paywall Long"]
};

function main() {
    return Events({
        from_date: params.start_date, 
        to_date: params.end_date,
        event_selectors: _.map(params.events, event => ({event: event}))
    });
}
```
### Description:
- **Goal:** Fetch specific events within a date range.
- **Steps:**
  1. Define parameters for date range and event names.
  2. Use `event_selectors` to filter for the specified events.

---

## Query 3: Group by Interest Categories

```javascript
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
                event.properties['interest in category'] === '👨‍💻 Marketing Professional' ||
                event.properties['interest in category'] === '🕵 Other'
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
```
### Description:
- **Goal:** Group events by device ID and interest category.
- **Steps:**
  1. Filter events for `Onboarding Interest` with specific categories.
  2. Group by device ID and interest category.
  3. Map the grouped results to return device ID and category.

---

## Query 4: Country and Interest Aggregation

```javascript
function main() {
    return Events({
        from_date: '2024-10-01',
        to_date: '2024-10-28'
    })
    .filter(function(event) {
        return event.name === 'Onboarding Interest' && event.properties["mp_country_code"];
    })
    .groupBy(["properties.mp_country_code", "properties.interest in category"], mixpanel.reducer.count())
    .filter(function(group) {
        return group.key[0] !== null;
    })
    .map(function(event) {
        return {
            Country: event.key[0],
            Interest: event.key[1],
            Count: event.value
        };
    });
}
```
### Description:
- **Goal:** Aggregate interest categories by country.
- **Steps:**
  1. Filter for `Onboarding Interest` events with a valid country code.
  2. Group by country code and interest category.
  3. Exclude null country codes after grouping.
  4. Return the country, interest category, and occurrence count.

---

## Query 5: Onboarding Purchase Details

```javascript
function main() {
    return Events({
        from_date: '2024-09-22',
        to_date: '2024-09-28'
    })
    .filter(function(event) {
        return event.name === 'Onboarding Purchase';
    })
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
```
### Description:
- **Goal:** Analyze onboarding purchase events grouped by multiple properties.
- **Steps:**
  1. Filter for `Onboarding Purchase` events.
  2. Group by device ID, country code, user category, payment plan, status, and code.
  3. Map the results to return a structured object.

---

## Query 6: Funnel Analysis (US Users)

```javascript
function main() {
    return Events({
        from_date: "2024-10-01",
        to_date: "2024-10-20"
    })
    .filter(function(event) {
        return event.properties.mp_country_code === "US";
    })
    .groupByUser(function(steps_completed, events) {
        steps_completed = steps_completed || 0;
        _.each(events, function(e) {
            if (steps_completed < funnel.length) {
                var currentStep = funnel[steps_completed];
                if (e.name === currentStep.event && 
                    (e.properties["Screen Name"] === currentStep.screen || e.properties["screen info"] === currentStep.screen)) {
                    steps_completed++;
                }
            }
        });
        return steps_completed;
    })
    .filter(function(item) {
        return item.value > 0;
    })
    .reduce(function(accumulators, users_with_final_steps) {
        var funnel_steps = new Array(funnel.length).fill(0);
        _.each(users_with_final_steps, function(user) {
            for (var i = 0; i < user.value; i++) {
                funnel_steps[i]++;
            }
        });
        return funnel_steps;
    });
}
```
### Description:
- **Goal:** Perform funnel analysis for users in the US.
- **Steps:**
  1. Filter events to include only US users.
  2. Group by user and calculate the number of steps completed in the funnel.
  3. Aggregate results to determine funnel performance.

---

The queries can be adapted to suit other regions, properties, or events based on Mixpanel's schema.
