
; (function (root, factory) {
    if (typeof define == 'function' && define.amd) {
        define(function (require) {
            var jquery = require('jquery');
            return factory(jquery);
        })
    }
    else {
        root.win = factory(root.$)
    }
}(this, function ($) {
    if (typeof $ !== 'function')
        throw new Error('模块$获取失败');

    function responsivePx(x) {
        var curr_font = parseFloat(window.top.document.documentElement.style.fontSize);
        var ret = x * curr_font / 100;
        return ret;
    }



    var defOptions = {
        window: 'window',
        head: 'window-head',
        limit: true, //锁定范围
        lock: false, //锁定位置
        lockX: false, //锁定水平位置
        lockY: false, //锁定垂直位置
        maxContainer: document.documentElement || document.body, //指定限制容器,
        width: 600,
        height: 400
    };

    function Drag() {
        this.options = defOptions;
    }

    Drag.prototype = {
        config: function (options) {
            this.options = $.extend(true, {}, this.options, options);
        },
        init: function () {
            this.drag = this.iden(this.options.window);
            this.handle = this.iden(this.options.head);

            this._x = this._y = 0;                  //置0
            this._moveDrag = this.bind(this, this.moveDrag);            //绑定方法
            this._stopDrag = this.bind(this, this.stopDrag);


            this.maxContainer = this.iden(this.options.maxContainer);

            this.maxTop = Math.max(this.maxContainer.clientHeight, this.maxContainer.scrollHeight) - responsivePx(this.options.height);
            this.maxLeft = Math.max(this.maxContainer.clientWidth, this.maxContainer.scrollWidth) - responsivePx(this.options.width);

            this.limit = this.options.limit;
            this.lockX = this.options.lockX;
            this.lockY = this.options.lockY;
            this.lock = this.options.lock;

            this.handle.style.cursor = "move";              //拖动时的鼠标move显示 

            this.addHandler(this.handle, "mousedown", this.bind(this, this.startDrag))      //添加绑定事件

            var modeldiv = window.top.document.createElement("div");
            modeldiv.setAttribute('class', 'opacity-div-for-modelwin');
            modeldiv.setAttribute('hidden', '');
            var pdivs = document.getElementsByTagName('div');
            var pos = pdivs[0];
            function insert(newel, elpos) {
                var parent = document.body;
                parent.insertBefore(newel, elpos);
            }
            insert(modeldiv, pos);
        },
        startDrag: function (event) {
            var event = event || window.event;

            this._x = event.clientX - this.drag.offsetLeft;         //初始拖拽坐标定位
            this._y = event.clientY - this.drag.offsetTop;

            this.addHandler(document, "mousemove", this._moveDrag);     //绑定鼠标移动事件
            this.addHandler(document, "mouseup", this._stopDrag);       //绑定鼠标松开事件

            event.preventDefault && event.preventDefault();             //阻止事件的默认动作
            this.handle.setCapture && this.handle.setCapture();
        },
        moveDrag: function (event) {
            var event = event || window.event;

            var iTop = event.clientY - this._y;         //现在位置的实时确定
            var iLeft = event.clientX - this._x;

            if (this.lock) return;

            //锁定范围专用
            this.limit && (iTop < 0 && (iTop = 0), iLeft < 0 && (iLeft = 0), iTop > this.maxTop && (iTop = this.maxTop), iLeft > this.maxLeft && (iLeft = this.maxLeft));

            this.lockY || (this.drag.style.top = iTop + "px");
            this.lockX || (this.drag.style.left = iLeft + "px");

            event.preventDefault && event.preventDefault();
        },        //
        stopDrag: function () {
            this.removeHandler(document, "mousemove", this._moveDrag);
            this.removeHandler(document, "mouseup", this._stopDrag);

            this.handle.releaseCapture && this.handle.releaseCapture();
        },

        //获取id
        iden: function (id) {
            return typeof id === "string" ? document.getElementById(id) : id
        },
        //添加绑定事件(这里还考虑到了兼容问题)
        addHandler: function (oElement, sEventType, fnHandler) {
            return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)
        },
        //删除绑定事件
        removeHandler: function (oElement, sEventType, fnHandler) {
            return oElement.removeEventListener ? oElement.removeEventListener(sEventType, fnHandler, false) : oElement.detachEvent("on" + sEventType, fnHandler)
        },
        //绑定事件到对象
        bind: function (object, fnHandler) {
            return function () {
                return fnHandler.apply(object, arguments)
            }
        }
    };

    var obj = new Drag();
    function ret() { };
    $.extend(ret, obj);

    ret.showMask = function () {
        $('.opacity-div-for-modelwin').show()
    }

    ret.hideMask = function () {
        $('.opacity-div-for-modelwin').hide()
    }

    return ret;
}))



; (function (root, factory) {
    if (typeof define == 'function' && define.amd) {
        define(function (require) {
            var jquery = require('jquery');
            var win = require('win');
            return factory(jquery, win);
        })
    }
    else {
        root.wintor = factory(root.$, root.win)
    }
}(this, function ($, win) {
    if (typeof $ !== 'function')
        throw new Error('模块$获取失败');

    if (typeof win !== 'function')
        throw new Error('模块win获取失败');

    function responsivePx(x) {
        var curr_font = parseFloat(window.top.document.documentElement.style.fontSize);
        var ret = x * curr_font / 100;
        return ret;
    }

    var defOptions = {        
        width: 600,
        height: 400,
        selector: '.wintor',
        noChoiceMsg: '请选择一项'
    };

    function ctor() {
        this.options = defOptions;

        this.conditionGetter = null;

        this.selectHandler = null;
    }

    ctor.prototype.config = function (options) {
        this.options = $.extend(true, {}, this.options, options);

        if(!this.options.inputIdSelector && this.options.idField){
            this.options.inputIdSelector = '#' +   this.options.idField;
        }

        if(!this.options.inputNameSelector && this.options.nameField){
            this.options.inputNameSelector = '#' +   this.options.nameField;
        }
    }

    ctor.prototype.init = function () {
        var that = this;

        win.config({
            width: that.options.width,
            height: that.options.height
        });

        win.init();

        $(that.options.aSelector).click(function () {            
            that.open();
        })

        $(that.options.selector + ' .window-save').click(function () {
            var id = $(".choices li.active").attr(that.options.idField);
            var name = $(".choices li.active").attr(that.options.nameField);
            if (!id) {
                Util.alert(that.options.noChoiceMsg);
                return;
            }

            if (typeof that.selectHandler === 'function') {
                that.selectHandler(id, name);
            }
            that.close();
        })

        $(that.options.selector + ' .window-close').click(function () {
            that.close();
        });

        $(that.options.selector + ' .window-cancel').click(function () {
            that.close();
        });
    }

    ctor.prototype.condition = function (func) {
        this.conditionGetter = func;
    }

    ctor.prototype.select = function (func) {
        this.selectHandler = func;
    }

    ctor.prototype.open = function () {
        var that = this;

        $(that.options.selector).fadeIn(200);
        win.showMask();        
        
        function getCondition() {
            if (typeof that.conditionGetter === 'function')
                return that.conditionGetter();
        }

        var data = getCondition() || {};
        var idfield = that.options.idField;
        var namefield = that.options.nameField;

        $.ajax({
            url: that.options.url,
            type: 'get',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (!data || data.error || typeof data.Total == "undefined") {
                    console.log('在调用接口' + that.options.url + '时发生错误，返回数据如下');
                    console.log(data);
                    return;
                }

                var current_id = $(that.options.inputIdSelector).val();

                var ul = $(".choices");
                ul.html('');

                for (var i in data.Models) {
                    var item = data.Models[i];
                    var li = $("<li>");
                    li.append(item[namefield]);
                    li.attr(idfield, item[idfield]);
                    li.attr(namefield, item[namefield]);

                    if (item[idfield] == current_id) {
                        li.addClass('active');
                    }

                    ul.append(li);
                }

                if (!data.Total) {
                    $('.no-item-available').show();
                }

                $(".choices li").click(function () {
                    $(".choices li").removeClass('active');
                    $(this).addClass('active');
                })

                $(".choices li").dblclick(function () {
                    var id = $(this).attr(idfield);
                    var name = $(this).attr(namefield);
                    if (typeof that.selectHandler === 'function') {
                        that.selectHandler(id, name);
                    }
                    that.close();
                })
            }
        });
    }

    ctor.prototype.close = function () {
        $(this.options.selector).hide();
        win.hideMask();
    }

    var obj = new ctor();
    function ret() { };
    $.extend(ret, obj);

    ret.showMask = function () {
        $('.opacity-div-for-modelwin').show()
    }

    ret.hideMask = function () {
        $('.opacity-div-for-modelwin').hide()
    }

    return ret;
}))




