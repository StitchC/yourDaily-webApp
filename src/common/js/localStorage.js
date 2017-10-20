export function setUserDailyLock(userid, obj) {
  let storageData = window.localStorage.ohMyDailyLock;
  if(!storageData) {
    // 如果storageData 不存在创建一个
    // 为这个对象添加一个以userid 为键的对象
    storageData = {};
    storageData[userid] = obj;
  }else {
    // 如果存在 将得出的json 字符串转为对象
    storageData = JSON.parse(storageData);
    storageData[userid] = obj;
  }
  window.localStorage.ohMyDailyLock = JSON.stringify(storageData);
}

export function getUserDailyLock(userId) {
  let storageData = window.localStorage.getItem('ohMyDailyLock');
  let result = JSON.parse(storageData)[userId];
  return result;
}

export function setUserDefaultData(obj) {
  window.localStorage.DailyuserDefaultData = JSON.stringify(obj);
}

export function getUserDefaultData() {
  return JSON.parse(window.localStorage.DailyuserDefaultData);
}
