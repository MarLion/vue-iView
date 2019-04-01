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
  },
  //时间戳转时间
  getTime:function (ins) {
    let con;
    let time = new Date(ins);
    let year = time.getFullYear(),
      month = time.getMonth() + 1,
      day = time.getDate(),
      hour = time.getHours(),
      min = time.getMinutes(),
      sec = time.getSeconds();
    month = month > 9 ? month : '0'+month;
    day = day > 9 ? day : '0'+day;
    hour = hour > 9 ? hour : '0'+hour;
    min = min > 9 ? min : '0'+min;
    sec = sec > 9 ? sec : '0'+sec;
    con = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    return con;
  },

  //截取视频第一帧
  cutVideo:function (video,img) {
    console.log(1);
    let scale = 1;
    let canvas = document.createElement("canvas");//创建画布
    canvas.width = video.clientWidth * scale;
    canvas.height = video.clientHeight * scale;//设定宽高比
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);//将视频此刻帧数画入画布
    console.log(canvas.toDataURL("image/png"));
    img.setAttribute('src',canvas.toDataURL("image/png"))
    //return canvas.toDataURL("image/png");
  }
}
