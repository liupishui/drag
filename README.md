# drag

拖拽改变div大小和位置

## 使元素可以拖拽

```Javascript
$(dom).drag();
```

## 使元素可以改变大小和方向

固定比例的缩放

```Javascript
$(dom).Resize(true,function(){});
```
自由缩放

```Javascript
$(dom).Resize(false,function(){});
```

## 获取旋转角度

```Javascript
var $dom = $(dom).Resize();
console.log($dom.getRotateAngle);
```
[demo](https://liupishui.github.io/drag/)
