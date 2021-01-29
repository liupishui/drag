$.fn.extend({
    //获取旋转角度
    getRotateAngle: function () {
        var tranformInfo = $(this).css('transform');
        var angle = 0;
        if (tranformInfo !== 'none') {
            var values = tranformInfo.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            var c = values[2];
            var d = values[3];
            var scale = Math.sqrt(a * a + b * b);
            var sin = b / scale;
            angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        }
        return angle;
    },
    //获取旋转点
    getTranformOrigin: function () {
        var w = $(this).outerWidth();
        var h = $(this).outerHeight();
        var tranformOrgin = 'cc';
        // console.log(window.getComputedStyle($(this)[0]).transformOrigin);
        var transformOriginInfo = $(this).css('transformOrigin').split(" ");
        if (parseFloat(transformOriginInfo[0]) == w / 2 && parseFloat(transformOriginInfo[1]) == h / 2) {
            tranformOrgin = 'cc';
        }
        if (parseFloat(transformOriginInfo[0]) == 0 && parseFloat(transformOriginInfo[1]) == 0) {
            tranformOrgin = 'nw';
        }
        if (parseFloat(transformOriginInfo[0]) == w && parseFloat(transformOriginInfo[1]) == 0) {
            tranformOrgin = 'ne';
        }
        if (parseFloat(transformOriginInfo[0]) == w && parseFloat(transformOriginInfo[1]) == h) {
            tranformOrgin = 'se';
        }
        if (parseFloat(transformOriginInfo[0]) == 0 && parseFloat(transformOriginInfo[1]) == h) {
            tranformOrgin = 'sw';
        }
        return tranformOrgin;
    },
    setTranformOrigin: function (newOrigin) {
        //console.log('newOrigin', newOrigin);
        var transformOrigin = $(this).getTranformOrigin();
        var orgAngle = $(this).getRotateAngle();

        var orgPosition = $(this).position();
        //旋转为0；
        if (newOrigin == 'cc') {
            $(this)[0].style.transformOrigin = '50% 50%';
        }
        if (newOrigin == 'nw') {
            $(this)[0].style.transformOrigin = '0 0';
        }
        if (newOrigin == 'ne') {
            $(this)[0].style.transformOrigin = '100% 0';
        }
        if (newOrigin == 'se') {
            $(this)[0].style.transformOrigin = '100% 100%';
        }
        if (newOrigin == 'sw') {
            $(this)[0].style.transformOrigin = '0 100%';
        }
        $(this).css({ left: parseFloat($(this).css('left')) + (orgPosition.left - (this).position().left), top: parseFloat($(this).css('top')) + (orgPosition.top - (this).position().top), right: 'auto', bottom: 'auto' });
        if (newOrigin == 'nw') {

        }
        if (newOrigin == 'ne') {
            $(this).css({
                right: $(".stage").width() - parseFloat((this).css('left')) - $(this).outerWidth(),
                left: 'auto'
            })
        }
        if (newOrigin == 'se') {
            $(this).css({
                right: $(".stage").width() - parseFloat((this).css('left')) - $(this).outerWidth(),
                bottom: $(".stage").height() - parseFloat((this).css('top')) - $(this).outerHeight(),
                left: "auto",
                top: 'auto'
            })
        }
        if (newOrigin == 'sw') {
            $(this).css({
                bottom: $(".stage").height() - parseFloat((this).css('top')) - $(this).outerHeight(),
                top: 'auto'
            })
        }
    },
    //拖动
    Drag: function (event) {
        $(this).mousedown(function (e) {
            $(this).attr("isDrag", 1);
            if ($(e.target).hasClass('rotate') || $(e.target).hasClass('top') || $(e.target).hasClass('topright') || $(e.target).hasClass('right') || $(e.target).hasClass('bottomright') || $(e.target).hasClass('bottom') || $(e.target).hasClass('bottomleft') || $(e.target).hasClass('left') || $(e.target).hasClass('topleft')) {
                $(this).attr('isResize', 1);
                return;
            }
            if ($(this).attr("isDrag") == 0) return;
            var orgPosition = { left: parseFloat($(this).css('left')), top: parseFloat($(this).css('top')) };
            var orgPositionEvent = e;
            $(this).mousemove(function (event) {
                $(this).css({
                    'left': orgPosition.left + event.pageX - orgPositionEvent.pageX,
                    'top': orgPosition.top + event.pageY - orgPositionEvent.pageY
                });
            });
            $(this).mouseup(function () {
                $(this).unbind('mousemove');
                $(this).attr("drag", 0);
            });
        });
    },
    DisDrag: function () {
        $(this).attr("isDrag", 0);
        $(this).attr("drag", 0);
    },
    //上下左右加四个角
    Resize: function (fixedProportion, callback) {
        if(!fixedProportion){
            fixedProportion = false;//是否固定宽高比例，默认不固定
        }else{
            fixedProportion = $(this).outerHeight()/$(this).outerWidth();
        }
        var resizePanelHtml = ['<div class="top" data="n"></div>',
            '<div class= "topright" data="ne"></div>',
            '<div class="right" data="e"></div>',
            '<div class="bottomright" data="se"></div>',
            '<div class="bottom" data="s"></div>',
            '<div class="bottomleft" data="sw"></div>',
            '<div class="left" data="w"></div>',
            '<div class="topleft" data="nw"></div>',
            '<div class="rotate" data="rotate">旋转</div>',
            '<div class="topborder" data="n"></div>',
            '<div class="rightborder" data="e"></div>',
            '<div class="bottomborder" data="s"></div>',
            '<div class="leftborder" data="w"></div>',
        ].join('');
        $(resizePanelHtml).appendTo($(this));
        $(this).mouseover(function () {
            $(this).addClass('mousedown');
        });
        $(this).mouseleave(function () {
            if (typeof ($(this).attr('Resize')) == 'undefined' || $(this).attr('Resize') == 0) {
                $(this).removeClass('mousedown');
            }
        });
        $(this).mousedown(function (e) {
            var targetDom = $(e.target);
            if (targetDom.attr('data') == 'nw') {
                //console.log('target:','nw')
                $(this).attr('Resize', 1)
                $(this).setTranformOrigin('se');
                var orgAngle = $(this).getRotateAngle();
                var orgAngles = Math.PI / 2 - orgAngle / 180 * Math.PI;
                var originPostion = {
                    left: $(".stage").offset().left + parseFloat($(this).css('left')) + $(this).outerWidth(),
                    top: $(".stage").offset().top + $(".stage").outerHeight() - parseFloat($(this).css('bottom'))
                }
            }
            if (targetDom.attr('data') == 'ne'|| targetDom.attr('data') == 'n') {
                //console.log('target:', 'ne')
                $(this).attr('Resize', 1)
                $(this).setTranformOrigin('sw');
                var orgAngle = $(this).getRotateAngle();
                //console.log(orgAngle)
                var orgAngles = orgAngle / 180 * Math.PI;
                var originPostion = {
                    left: $(".stage").offset().left + parseFloat($(this).css('left')),
                    top: $(".stage").offset().top + $(".stage").outerHeight() - parseFloat($(this).css('bottom'))
                }
            }
            if (targetDom.attr('data') == 'se' || targetDom.attr('data') == 's' || targetDom.attr('data') == 'e') {
                //console.log('target:', 'se')
                $(this).attr('Resize', 1)
                $(this).setTranformOrigin('nw');
                var orgAngle = $(this).getRotateAngle();
                //console.log('se',orgAngle)
                var orgAngles = orgAngle / 180 * Math.PI;
                var originPostion = {
                    left: $(".stage").offset().left + parseFloat($(this).css('left')),
                    top: $(".stage").offset().top + parseFloat($(this).css('top'))
                }
            }
            if (targetDom.attr('data') == 'sw' || targetDom.attr('data') == 'w') {
                //console.log('target:', 'sw')
                $(this).attr('Resize', 1)
                $(this).setTranformOrigin('ne');

                var orgAngle = $(this).getRotateAngle();
                //console.log('sw', orgAngle)
                var orgAngles = Math.PI / 2 - orgAngle / 180 * Math.PI;
                var originPostion = {
                    left: $(".stage").offset().left + parseFloat($(this).css('left')) + $(this).outerWidth(),
                    top: $(".stage").offset().top + parseFloat($(this).css('top'))
                }

            }
            if (targetDom.attr('data') == 'rotate') {
                $(this).setTranformOrigin('cc');
                var orgAngle = $(this).getRotateAngle();
                var orgAngles = orgAngle / 180 * Math.PI;
                var originPostion = {
                    left: $(".stage").offset().left + parseFloat($(this).css('left')) + $(this).outerWidth() / 2,
                    top: $(".stage").offset().top + parseFloat($(this).css('top')) + $(this).outerHeight() / 2
                }
                $(this).attr('Resize', 1)
                var orgRotate = Math.asin((originPostion.top - e.pageY) / Math.sqrt(Math.pow(e.pageX - originPostion.left, 2) + Math.pow((e.pageY - originPostion.top), 2))) / Math.PI * 180
                if (originPostion.top == e.pageY && originPostion.left < e.pageX) {
                    orgRotate = 0;
                }
                if (originPostion.top > e.pageY && originPostion.left < e.pageX) {
                    orgRotate = orgRotate;
                }
                if (originPostion.top > e.pageY && originPostion.left == e.pageX) {
                    orgRotate = 90;
                }
                if (originPostion.top > e.pageY && originPostion.left > e.pageX) {
                    orgRotate = 90 + 90 - orgRotate;
                }
                if (originPostion.top == e.pageY && originPostion.left > e.pageX) {
                    orgRotate = 180;
                }
                if (originPostion.top < e.pageY && originPostion.left > e.pageX) {
                    orgRotate = 180 - orgRotate;
                }
                if (originPostion.top < e.pageY && originPostion.left == e.pageX) {
                    orgRotate = 270
                }
                if (originPostion.top < e.pageY && originPostion.left < e.pageX) {
                    orgRotate = 360 + orgRotate;
                }
            }
            var orgPositionEvent = e;
            var that = $(this);
            var widthOrg = that.outerWidth();
            var heightOrg = that.outerHeight();
            var isAngleBig = orgAngle >= 0;
            $(document).mousemove(function (e) {
                if (targetDom.attr('data') == 'nw') {
                    var width = ((originPostion.top - e.pageY) / Math.tan(orgAngles) + (originPostion.left - e.pageX)) * Math.sin(orgAngles);
                    var height = ((originPostion.top - e.pageY) * Math.tan(orgAngles) - (originPostion.left - e.pageX)) * Math.cos(orgAngles);
                    that.css({
                        width: width,
                        height: fixedProportion ? width * fixedProportion:height 
                    });
                }
                if (targetDom.attr('data') == 'ne') {
                    var width = 0;
                    if(orgAngles == 0){
                        width = widthOrg + (e.pageX - orgPositionEvent.pageX);
                    }else{
                        width = ((e.pageX - originPostion.left) / Math.tan(orgAngles) - (originPostion.top - e.pageY)) * Math.sin(orgAngles);
                    }
                    var height = ((e.pageX - originPostion.left) * Math.tan(orgAngles) - (e.pageY - originPostion.top)) * Math.cos(orgAngles);
                    console.log('ne',orgAngles);
                    that.css({
                        width: width,
                        height: fixedProportion ? width * fixedProportion : height 
                    });
                }
                if (targetDom.attr('data') == 'se') {
                    var width = ((e.pageY - originPostion.top) * Math.tan(orgAngles) - (originPostion.left - e.pageX)) * Math.cos(orgAngles);
                    var height = 0;
                    if (orgAngles == 0){
                        height = heightOrg + (e.pageY - orgPositionEvent.pageY);
                    }else{
                        height = ((e.pageY - originPostion.top) / Math.tan(orgAngles) - (e.pageX - originPostion.left)) * Math.sin(orgAngles);
                    }
                    that.css({
                        width: width,
                        height: fixedProportion ? width * fixedProportion : height 
                    })
                }
                if (targetDom.attr('data') == 'sw') {
                    var width = ((originPostion.left - e.pageX) * Math.tan(orgAngles) - (e.pageY - originPostion.top)) * Math.cos(orgAngles);
                    var height = ((originPostion.left - e.pageX) / Math.tan(orgAngles) - (originPostion.top - e.pageY)) * Math.sin(orgAngles);
                    console.log('sw', orgAngles);
                    that.css({
                        width: width,
                        height: fixedProportion ? width * fixedProportion : height 
                    });
                }
                if (targetDom.attr('data') == 'n') {
                    var height = ((e.pageX - originPostion.left) * Math.tan(orgAngles) - (e.pageY - originPostion.top)) * Math.cos(orgAngles);
                    //var height = ((originPostion.top - e.pageY) * Math.tan(orgAngles) - (originPostion.left - e.pageX)) * Math.cos(orgAngles);
                    var width = 0;
                    if (fixedProportion){
                        width = height/fixedProportion;
                    }else{
                        width = widthOrg
                    }
                    that.css({
                        width: width,
                        height: height
                    });
                }
                if (targetDom.attr('data') == 's') {
                    var height = 0;
                    if (orgAngles == 0) {
                        height = heightOrg + (e.pageY - orgPositionEvent.pageY);
                    } else {
                        height = ((e.pageY - originPostion.top) / Math.tan(orgAngles) - (e.pageX - originPostion.left)) * Math.sin(orgAngles);
                    }
                    var width = 0;
                    if (fixedProportion) {
                        width = height / fixedProportion;
                    } else {
                        width = widthOrg
                    }

                    that.css({
                        width: width,
                        height:height
                    });
                }
                if (targetDom.attr('data') == 'w') {
                    var width = ((originPostion.left - e.pageX) * Math.tan(orgAngles) - (e.pageY - originPostion.top)) * Math.cos(orgAngles);
                    var height = 0;
                    if (fixedProportion) {
                        height = width * fixedProportion;
                    } else {
                        height = heightOrg;
                    }

                    that.css({
                        width: width,
                        height:height
                    });
                }
                if (targetDom.attr('data') == 'e') {               
                    var width = ((e.pageY - originPostion.top) * Math.tan(orgAngles) - (originPostion.left - e.pageX)) * Math.cos(orgAngles);
                    var height = 0;
                    if(fixedProportion){
                        height = width * fixedProportion;
                    }else{
                        height = heightOrg;
                    }
                    that.css({
                        width: width,
                        height: height
                    })
                }
                if (targetDom.attr('data') == 'rotate') {
                    var orgRotateNew = Math.asin((originPostion.top - e.pageY) / Math.sqrt(Math.pow(e.pageX - originPostion.left, 2) + Math.pow((e.pageY - originPostion.top), 2))) / Math.PI * 180
                    if (originPostion.top == e.pageY && originPostion.left < e.pageX) {
                        orgRotateNew = 0;
                    }
                    if (originPostion.top > e.pageY && originPostion.left < e.pageX) {
                        orgRotateNew = orgRotateNew;
                    }
                    if (originPostion.top > e.pageY && originPostion.left == e.pageX) {
                        orgRotateNew = 90;
                    }
                    if (originPostion.top > e.pageY && originPostion.left > e.pageX) {
                        orgRotateNew = 90 + 90 - orgRotateNew;
                    }
                    if (originPostion.top == e.pageY && originPostion.left > e.pageX) {
                        orgRotateNew = 180;
                    }
                    if (originPostion.top < e.pageY && originPostion.left > e.pageX) {
                        orgRotateNew = 180 - orgRotateNew;
                    }
                    if (originPostion.top < e.pageY && originPostion.left == e.pageX) {
                        orgRotateNew = 270
                    }
                    if (originPostion.top < e.pageY && originPostion.left < e.pageX) {
                        orgRotateNew = 360 + orgRotateNew;
                    }
                    var orgRotateChange = orgRotate - orgRotateNew;
                    that[0].style.transform = "rotate(" + (orgAngle + orgRotateChange) + "deg)"
                }
                if (callback) {
                    callback.call($(targetDom).parent());
                }
            });
        });
        var that = this;
        $(document).mouseup(function () {
            $(document).unbind('mousemove');
            $(that).attr('Resize', 0);
        });
    }
});
