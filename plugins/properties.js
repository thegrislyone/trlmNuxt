import Vue from 'vue'

Vue.prototype.$empty = function(mixed_var) {
  return (
    mixed_var === undefined ||
    mixed_var === "" ||
    mixed_var === 0 ||
    mixed_var === "0" ||
    mixed_var === null ||
    mixed_var === false ||
    (Array.isArray(mixed_var) && mixed_var.length === 0) ||
    (typeof(mixed_var) == 'object' && Object.keys(mixed_var).length == 0)
  )
}

// export const metricGoal = function(goal) {

//   try {
//     ym(67087243, 'reachGoal', goal)
//   } catch (e) {}
  

//   try {
//     ga('send', 'event', goal, 'click')
//   } catch (e) {}
  
// }

// export const metricHit = function(url) {

//   try {
//     ym(67087243, 'hit', url)
//   } catch (e) {}

//   try {
//     ga('set', 'page', url)
//   } catch (e) {}

// }