// 设置日期的时分秒
export default function setDateTime({
                          y = new Date().getFullYear(),
                          M = new Date().getMonth(),
                          d = new Date().getDate(),
                          h = new Date().getHours(),
                          m = new Date().getMinutes(),
                          s = new Date().getSeconds()
                                    }) {
  let resultDate = new Date(`${y}-${M + 1}-${d} ${h}:${m}:${s}`);

  return resultDate;
}
