export function setLocalStorage(json) {
  let obj = {};
  obj.userData = json;
  let jsonStr = JSON.stringify(obj);
  window.localStorage.setItem('ohMyDaily', jsonStr);
};

export function getLocalStorage() {
  let str = window.localStorage.getItem('ohMyDaily');
  
  if(str) {
    let obj = JSON.parse(str);
    return obj;
  }
};
