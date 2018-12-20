export default {
  //将中国标准时间转化为'yyyy-MM-dd'
  timeTranslate:function (date) {
    let dateFormat = /^(\d{4})-(\d{2})-(\d{2})$/;
    let transDate = '';
    if (!dateFormat.test(date)) {
      let d = new Date(date);
      let year = d.getFullYear();
      let mon = d.getMonth() + 1;
      let day = d.getDate();
      mon = mon > 9 ? mon : '0' + mon;
      day = day > 9 ? day : '0' +day;
      transDate = year + '-' + mon + '-' + day;
    } else {
      transDate = date;
    }
    return transDate
  },
  //将中国标准时间转化为'yyyy-MM-dd HH:mm'
  timeTranslateColock:function (date) {
    let dataFor = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2})$/;
    let transed = '';
    if (!dataFor.test(date)) {
      let da = new Date(date);
      let year = da.getFullYear();
      let mon = da.getMonth() + 1;
      let day = da.getDate();
      let hour = da.getHours();
      let min = da.getMinutes();
      mon = mon > 9 ? mon : '0' + mon;
      day = day > 9 ? day : '0' + day;
      hour = hour > 9 ? hour : '0' + hour;
      min = min > 9 ? min : '0' + min;
      transed = year + '-' + mon + '-' + day + ' ' + hour + ':' + min;
    } else {
      transed = date;
    }
    return transed;
  },
  //获取当前日期
  getCurrentDate:function () {
    let current = '';
    let date = new Date();
    let year = date.getFullYear();
    let mon = date.getMonth() + 1;
    let day = date.getDate();
    mon = mon > 9 ? mon : '0' + mon;
    day = day > 9 ? day : '0' + day;
    current = year + '-' + mon + '-' + day;
    return current;
  }
}
