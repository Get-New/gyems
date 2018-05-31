/*
    该文件定义对象RightPanel    
    功能如下：
    1. 右侧区域显示或隐藏
    2. 小箭头动态高度
    作者 Zhu Hui
    ※ 有问题请联系作者，不要修改该文件

    配置项描述
    selectors 对象，页面元素的选择器
    -->  main_content 中间区域的选择器，默认是'.main-content'，尽量不要改动
    -->  right_content 右侧区域的选择器，默认是'.right-content'，尽量不要改动

    right_content_width 右侧区域展开后的宽度
    main_content_margin_right_min 中间区域的margin_right最小值
    main_content_margin_right_max 中间区域的margin_right最大值

    grid_first_row_top 中间grid的第一行到页面顶部的距离
    grid_row_height 中间grid的每一行的高度

    接口函数描述
    show_right_panel 展开右侧区域；可传入参数回调函数
    hide_right_panel 隐藏右侧区域；可传入参数回调函数
    toggle_right_panel 右侧区域如果正在展开，则隐藏；如果正在隐藏，则展开；可传入参数回调函数
    set_arrow_position 设置右侧区域的箭头高度；需要传入参数行号
*/



// 页面模板
function RightPanel(config) {

    // 配置
    this.config;

    // 初始化
    this.init(config);

    // 右侧编辑框正在显示
    this.right_panel_showing = false;
}

RightPanel.prototype.config_defaults = {

    selectors: {
        main_content: '.main-content',
        right_content: '.right-content',
    },

    right_content_width: 400,
    main_content_margin_right_min: 30,
    main_content_margin_right_max: 480,
    grid_first_row_top: 95,
    grid_row_height: 48,
};

RightPanel.prototype.init = function (config) {

    var that = this;

    // 使用默认配置和自定义配置，组成最终使用的配置
    this.config = $.extend(true, {}, this.config_defaults, config);
}

RightPanel.prototype.toggle_right_panel = function (callback) {
    var that = this;
    if (this.right_panel_showing) {
        this.hide_right_panel(callback);
    } else {
        this.show_right_panel(callback);
    }
}

function responsivePx(x) {
    var curr_font = parseFloat(window.top.document.documentElement.style.fontSize);
    var ret = x * curr_font / 100;
    return ret;
}

RightPanel.prototype.show_right_panel = function (callback) {
    var that = this;

    // 统一判断权限
    if (window.top.G) {
        var auths = window.top.G.GetAuth();
        if (auths.indexOf('add') < 0 && auths.indexOf('edit') < 0) {
            return;
        }
    }

    if (this.right_panel_showing)
        return;

    var mainContent = $(this.config.selectors.main_content);
    var rightContent = $(this.config.selectors.right_content);
    var maxMarginRight = responsivePx(this.config.main_content_margin_right_max) + 'px';

    mainContent.css('marginRight', maxMarginRight);
    $(rightContent).css('visibility', 'visible').show();
    if (typeof callback == 'function') {
        callback();
    }

    this.right_panel_showing = true;
}

RightPanel.prototype.hide_right_panel = function (callback) {
    var that = this;
    if (!this.right_panel_showing)
        return;

    var mainContent = $(this.config.selectors.main_content);
    var rightContent = $(this.config.selectors.right_content);
    var minMarginRight = responsivePx(this.config.main_content_margin_right_min) + 'px';

    mainContent.css('marginRight', minMarginRight);
    $(rightContent).hide();
    if (typeof callback == 'function') {
        callback();
    } 

    this.right_panel_showing = false;
}

RightPanel.prototype.set_arrow_position = function (index) {
    var y0 = responsivePx(this.config.grid_first_row_top);
    var dy = responsivePx(this.config.grid_row_height);
    var top = y0 + dy * index;

    $('.arrow-outer').css('top', top);
    $('.arrow-inner').css('top', top + 2);
}