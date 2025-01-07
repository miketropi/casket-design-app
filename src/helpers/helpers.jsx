export const imageOnLoad = (url, callback) => {
  const img = new Image;
  img.src = url;
  img.onload = function(){ 
    callback(this)
  };
}

export const resizeImage = (imageSize, fitSize) => {
  let max = Math.max(...Object.values(fitSize));
  const __resizeTo = (to, ratio, max) => {
    let newSize = {};
    if(to == 'width') {
      newSize = { width: max, height: max * ratio }
    } else {
      newSize = { width: max * ratio, height: max }
    }

    return newSize;
  }

  let newSizeWidth = __resizeTo('width', imageSize.height / imageSize.width, fitSize.width);
  let newSizHeight = __resizeTo('height', imageSize.width / imageSize.height, fitSize.height);

  if(newSizeWidth.width >= fitSize.width && newSizeWidth.height >= fitSize.height) {
    return newSizeWidth;
  } else {
    return newSizHeight
  }
}