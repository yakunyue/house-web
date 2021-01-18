import Vue from 'vue'
Vue.filter("formatDate", function formatDate(value) {
  console.log('formatDate:',value)
  let date = new Date(value);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
});
Vue.filter("formatDateTime", function formatDateTime(value) {
  console.log('formatDateTime:',value)
  let date = new Date(value);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
});

