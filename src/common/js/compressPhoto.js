export function compressImg(file, maxWidth, maxHeight, beforeCompress, completeCallback) {
  // 首先调用 beforeCompress 回调函数
  beforeCompress();
  /*
  *  创建三个私有变量 用作为返回的数据对象赋值
  *  1、原始数据的二进制文件     originBlob
  *  2、原始数据的url            originUrl
  *  3、压缩后图像的url          compressImgUrl
  *  4、压缩后图像的二进制文件   compressBlob
  *  5、用作返回的数据           result
  * */
  let originBlob = null;
  let originUrl = '';
  let compressImgUrl = '';
  let compressBlob = null;
  let result = {};
  // 创建一个 canvas dom 对象
  // 获取2d 上下文
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  
  
  let draw = function(originWidth, originHeight, targetWidth, targetHeight) {
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
    if(canvas.toBlob) {
      canvas.toBlob(function(blob) {
        compressBlob = blob;
        compressImgUrl = url;
        // 最后返回数据
        result.compressImgUrl = compressImgUrl;
        result.compressBlob = compressBlob;
        completeCallback(result);
      });
    }else {
      // 如果浏览器不支持 canvas.toBlob 则只返回无压缩的图片路径及二进制文件
      completeCallback(result);
    }
  };


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
    
    // 先将原始的图片url 和 二进制文件保存
    result.originBlob = originBlob;
    result.originalUrl = originUrl;
    // 调用绘制函数 输出压缩后的图片
    draw(originWidth, originHeight, targetWidth, targetHeight);
  };
};
