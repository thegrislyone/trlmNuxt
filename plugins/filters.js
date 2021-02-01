import Vue from 'vue'

const round =  function(value, decimals = 2, type) {

  const round = function(value, decimals) {
    return Number(Math.ceil(value + 'e' + decimals) + 'e-' + decimals)
  }

  if (type === 'slice') {
    const d = +value
    let string = value.toString()
    if (string.length > 7 ) {
      switch(string.length) {
        case 8:
          string = round(d, 1).toString()
          break
        case 9:
          string = round(d, 0).toString()
          break
        default:
          string = round(d, 0).toString()
      }
    }
    return string
  }

  return round(value, decimals)
  
}

const numberPrettify = function(number) {
  if (!number) return ''
  let string = number.toString()
  return string.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ')
}

Vue.filter('numberPrettify', numberPrettify)
Vue.filter('round', round)