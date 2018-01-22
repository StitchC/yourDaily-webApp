// 设置日期的时分秒
export default function setDateTime(h, m, s) {
  let resultDate = null;
  resultDate = new Date().setHours(h);
  resultDate = new Date(resultDate).setMinutes(m);
  resultDate = new Date(resultDate).setSeconds(s);

  resultDate = new Date(resultDate).getTime();

  return resultDate;
}
