export function formateDate(time, str) {
  let date = new Date(time);
  if(/(y+)/.test(str)) {
    let year = date.getFullYear() + '';
    str = str.replace(RegExp.$1, year.substr(4 - RegExp.$1.length));
  }
  
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  
  for(let key in o) {
    let tempKey = '(' + key + ')';
    let tempStr = o[key] + '';
    if(new RegExp(tempKey).test(str)) {
      if(RegExp.$1.length === 1) {
        str = str.replace(RegExp.$1, tempStr);
      }else {
        str = str.replace(RegExp.$1, padLeftZero(tempStr));
      }
    }
  }
  return str;
}

function padLeftZero(s) {
  let str = '00' + s;
  return str.substr(s.length);
}
