export function compressImg(file, maxWidth, maxHeight) {
  /*
  *  创建三个私有变量 用作为返回的数据对象赋值
  *  1、原始数据的二进制文件 originBlob
  *  2、原始数据的url        originUrl
  *  3、压缩后图像的url      compressImgUrl
  * */
  let originBlob = null;
  let originUrl = '';
  let compressImgUrl = '';

  // 定义返回的数据对象
  let result = {};
  // 创建一个 canvas dom 对象
  // 获取2d 上下文
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');


  // 创建fileReader 对象和 image 对象
  let reader = new FileReader();
  let img = new Image();

  // 读取file 参数的内容 转换为 url
  reader.readAsDataURL(file);
  // 定义回调函数
  reader.onload = function(event) {
    img.src = event.target.result;
    originBlob = file;
    originUrl = event.target.result;
  };

  img.onload = function() {
    let originWidth = this.width;
    let originHeight = this.height;

    let targetWidth = originWidth;
    let targetHeight = originHeight;

    if(originWidth > maxWidth || originHeight > maxHeight) {
      // 如果图片宽大于高的值
      if(originWidth / originHeight > maxWidth / maxHeight) {
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (targetHeight / targetWidth));
      }else {
        // 如果图片高大于宽的值
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (targetWidth / targetHeight));
      }
    }

    // 设置canvas 的大小
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    // 清空画布
    context.clearRect(0, 0, maxWidth, maxHeight);
    // 绘制图片
    context.drawImage(img, 0, 0, maxWidth, maxHeight);
    // 输出图片的url
    let url = canvas.toDataURL('image/jpeg');
    // 为输出的数据对象写入键值
    compressImgUrl = url;
    // 最后返回数据
    result.originBlob = originBlob;
    result.originalUrl = originUrl;
    result.compressImgUrl = compressImgUrl;

    return result;
  };
};
