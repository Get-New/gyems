
// 二级侧边菜单
// simelt = side menu level two  

; (function (root, factory) {
    if (typeof define == 'function' && define.amd) {
        define(function (require) {
            var jquery = require('jquery');
            return factory(jquery);
        })
    } else {
        root.simelt = factory(root.$)
    }
}(this, function ($) {

    if (typeof $ !== 'function')
        throw new Error('模块$获取失败');

    var manager = (function ($) {
        return {
            privates: [],
            instances: [],
            ctor: null,
            create: function () {
                if (typeof ctor !== 'function')
                    throw new Error('ctor不是函数');

                var obj = new ctor();
                this.privates.push({});
                this.instances.push(obj);
                return obj;

            },
            getp: function (obj, key) {
                if (!obj || typeof key !== 'string')
                    throw new Error('getp函数参数不正确');

                for (var i = 0; i < this.instances.length; i++) {
                    if (this.instances[i] === obj) {
                        return this.privates[i][key];
                    }
                }

            },
            setp: function (obj, key, value) {

                if (!obj || typeof key !== 'string')
                    throw new Error('getp函数参数不正确');

                for (var i = 0; i < this.instances.length; i++) {
                    if (this.instances[i] === obj) {
                        this.privates[i][key] = value;
                    }
                }
            },
            fac: function (ctor) {
                var that = this;
                this.ctor = ctor;
                var dfObj = this.create();
                function ret() {
                    return that.create();
                };
                $.extend(ret, dfObj);
                this.instances[0] = ret;
                return ret;
            }
        };
    })($);

    var currentSlidingNum = 0;

    function Level1() {

        this.element; // dd元素
        this.elementTitle;   // 一级菜单中，主体部分，包含左边的图标，中间的文字，右边的箭头
        this.elementIconSpan;  // 左边的图标的span元素
        this.elementIconImg;  // 左边的图标的img元素
        this.elementArrow;   // 右边的cite元素，用于绘制小箭头
        this.ul;      // ul元素，用于存放二级菜单

        this.menuId;    // 一级菜单Id
        this.menuName;  // 一级菜单名字
        this.isOpened = false;   // 是否为打开状态
        this.children = [];   // Level2的数组        
    }

    // 读取数据 参数1是数据，参数2是作为容器的dl元素
    Level1.prototype.load = function (data, container) {

        var dd = $("<dd></dd>"); // dd元素
        var title = $("<div class='title'></div>");   //  主体部分
        var iconSpan = $("<span></span>");   // 左侧图标部分
        var iconImg = $("<img/>"); // 图标的图片
        var arrow = $("<cite></cite>");   // 小箭头
        var ul = $("<ul class='menuson'></ul>");    // ul元素
        var line = $("<div class='line'>");        

        container.append(dd);
        dd.append(title);
        dd.append(ul);
        dd.append(line);
        title.append(iconSpan);
        title.append(data.menuName);
        title.append(arrow);
        iconSpan.append(iconImg);

        title.attr('menuId', data.menuId);
        iconImg.attr('src', data.iconUrl);

        this.element = dd;
        this.elementTitle = title;
        this.elementIconSpan = iconSpan;
        this.elementIconImg = iconImg;
        this.elementArrow = arrow;
        this.ul = ul;

        this.menuId = data.menuId;
        this.menuName = data.menuName;

        var children = data.children;

        for (var i = 0; i < children.length; i++) {
            var item = children[i];
            this.addChild(item.menuId, item.menuName);
        }
    }

    // 添加子节点
    Level1.prototype.addChild = function (menuId, menuName) {
        var level2 = new Level2();
        level2.load(menuId, menuName, this.ul);
        level2.parent = this;
        this.children.push(level2);
    }

    // 展开
    Level1.prototype.open = function (isSmoothly, callback) {

        var that = this;

        if (this.isOpened == true) return;

        if (isSmoothly === true) {
            currentSlidingNum++;
            this.ul.slideDown('normal', function () {
                currentSlidingNum--;
                doOpen();
            });
        } else { doOpen(); }

        function doOpen() {
            that.element.addClass('opened');
            that.isOpened = true;

            if (typeof callback === 'function') { callback(); }
        }
    }

    // 收起
    Level1.prototype.close = function (isSmoothly, callback) {

        var that = this;

        if (this.isOpened == false) return;

        if (isSmoothly === true) {
            currentSlidingNum++;
            this.ul.slideUp('normal', function () {
                currentSlidingNum--;
                doClose();
            });
        } else { doClose(); }

        function doClose() {
            that.element.removeClass('opened');
            that.isOpened = false;
            if (typeof callback === 'function') { callback(); }
        }
    }

    function Level2() {
        this.element; // li元素
        this.elementA;  // a标签

        this.parent;  // 指向父级
        this.menuId;  // 二级菜单Id
        this.menuName;  // 菜单名字
        this.isActive = false;  // 是否激活
    }

    Level2.prototype.load = function (menuId, menuName, ul) {
        var li = $("<li></li>");
        li.attr('MenuId', menuId);
        var a = $("<a href='javascript:void(0)'></a>");
        a.append(menuName);
        li.append(a);
        ul.append(li);

        this.menuId = menuId;
        this.menuName = menuName;
        this.element = li;
        this.elementA = a;
    }

    // 设为活跃
    Level2.prototype.open = function () {

        if (this.isActive == true) return;

        this.element.addClass('active');
        this.isActive = true;
    }

    // 设为不活跃
    Level2.prototype.close = function () {

        if (this.isActive == false) return;

        this.element.removeClass('active');
        this.isActive = false;
    }


    var defOptions = {
        selector: ''  // 最外层dl的选择器
    };

    function ctor() {

        this.options = defOptions;
        this.element;   // dl元素

        this.activeMenuId; // 活跃的二级菜单Id
        this.activeMenuName; // 活跃的二级菜单名字

        this.level1arr = [];

        this.openningLevel1;  // 正在打开的level1对象的引用
        this.openningLevel2;  // 正在打开的level2对象的引用

        this.level2OpenHandler;  // 打开level2的事件
    }

    ctor.prototype.config = function (_options) {
        this.options = $.extend(true, {}, this.options, _options);
        return this;
    }

    ctor.prototype.init = function () {

        var that = this;
        this.element = $(this.options.selector);

        // 绑定一级菜单的点击事件
        $(this.element).on('click', '.title', function (e) {

            console.log(currentSlidingNum);
            if (currentSlidingNum > 0) return;

            var el = $(this);   // 被点击的title元素
            var menuId = el.attr('menuId');
            var level1 = findLevel1ByMenuId(menuId);

            if (!level1) return;

            if (level1.isOpened) {    // 如果点击的一级菜单本来是展开的      

                level1.close(true);   //  关闭该一级菜单

                that.openningLevel1 = null;  // “正在打开的一级菜单”指向为null

            } else {                   // 否则，点击的一级菜单本来是关闭的

                if (that.openningLevel1) {   // 如果存在“正在打开的一级菜单”

                    that.openningLevel1.close(true);    // 把“正在打开的一级菜单”关闭                 
                }

                // 打开被点击的一级菜单
                level1.open(true, function () {

                    if (that.openningLevel2 && that.openningLevel2.parent !== level1) {

                        var firstChild = level1.children[0];   // 找到刚刚打开的一级菜单的第一个孩子

                        firstChild.open();           // 打开这个孩子

                        that.openningLevel2 = firstChild;     // “正在打开的二级菜单”指向这个孩子

                        // 触发二级菜单打开事件
                        if (typeof that.level2OpenHandler === 'function') {
                            that.level2OpenHandler(level1.menuId, firstChild.menuId);
                        }

                    }
                });

                that.openningLevel1 = level1;  // “正在打开的一级菜单”指向被点击的一级菜单

                if (that.openningLevel2 && that.openningLevel2.parent !== level1) {   // 如果“正在打开的二级菜单”的父亲并不是刚刚点击的一级菜单

                    that.openningLevel2.close();     //   把“正在打开的二级菜单”关闭 

                }
            }
        })

        // 绑定二级菜单的点击事件
        $(this.element).on('click', 'li', function (e) {

            if (currentSlidingNum > 0) return;

            var el = $(this);   // 被点击的title元素
            var menuId = el.attr('menuId');
            var level2 = findLevel2ByMenuId(menuId);

            if (!level2) return;
            if (level2.isOpened) return;
            if (that.openningLevel2) that.openningLevel2.close();
            level2.open();
            that.openningLevel2 = level2;

            // 触发二级菜单打开事件
            if (typeof that.level2OpenHandler === 'function') {
                that.level2OpenHandler(level2.parent.menuId,level2.menuId);
            }
        });

        function findLevel1ByMenuId(menuId) {
            for (var i = 0; i < that.level1arr.length; i++) {
                if (that.level1arr[i].menuId == menuId)
                    return that.level1arr[i];
            }
        }

        function findLevel2ByMenuId(menuId) {
            if (!that.openningLevel1) return;
            var children = that.openningLevel1.children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.menuId == menuId) return child;
            }
        }

        return this;
    }
    
    // 加载数据
    ctor.prototype.load = function (data) {

        var that = this;
        var list = data;   // 一级菜单数组
        var container = this.element;  // dl元素作为存放一级菜单的容器

        for (var i = 0; i < list.length; i++) {
            var item = list[i];

            var level1 = new Level1();
            level1.load(item, container);
            this.level1arr.push(level1);
        }
    }

    // 跳转到指定的二级菜单
    ctor.prototype.jump = function (menuId, menuIdLevel3) {

        for (var i = 0; i < this.level1arr.length; i++) {
            var level1 = this.level1arr[i];
            for (var j = 0; j < level1.children.length; j++) {
                var level2 = level1.children[j];

                if (level2.menuId == menuId) {

                    if (this.openningLevel1 && this.openningLevel1 !== level1) {
                        this.openningLevel1.close();
                    }

                    level1.open();
                    this.openningLevel1 = level1;

                    if (this.openningLevel2 && this.openningLevel2 !== level2) {
                        this.openningLevel2.close();
                    }

                    level2.open();
                    this.openningLevel2 = level2;

                    // 触发二级菜单打开事件
                    if (typeof this.level2OpenHandler === 'function') {
                        this.level2OpenHandler(level1.menuId, level2.menuId, menuIdLevel3);
                    }

                    return;
                }
            }
        }
    }

    // 打开第一个二级菜单
    ctor.prototype.openFirst = function () {

        // 默认选择最前面的二级菜单
        var firstLevel1 = this.level1arr[0];
        if (firstLevel1 && firstLevel1.children.length > 0) {

            var firstLevel2 = firstLevel1.children[0];

            firstLevel1.open();
            this.openningLevel1 = firstLevel1;

            firstLevel2.open();
            this.openningLevel2 = firstLevel2;

            // 触发二级菜单打开事件
            if (typeof this.level2OpenHandler === 'function') {
                this.level2OpenHandler(firstLevel1.menuId, firstLevel2.menuId);
            }
        }
    }

    ctor.prototype.change = function (func) {
        this.level2OpenHandler = func;
    }

    return manager.fac(ctor);
}))