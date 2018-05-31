
/*
    该文件定义对象MyForm
    封装form元素，具体包含以下功能    
    1. 将一行数据加载到form中
    2. 从form获得序列化的数据
    3. 提供一些常用方法

    作者 Zhu Hui
    ※ 有问题请联系作者，不要修改该文件

    <<<--- 配置项 --->>>
    selector  form元素的jquery选择器，默认是form

    <<<--- 接口函数 --->>>

    load_data  将数据加载到form中
       -->  参数一 要加载的数据

    serialize_data  返回form中的数据对象

    clear 清空form中的数据
*/

function MyForm(page, config) {    

    // 配置
    this.config = null;

    // 指向页面对象
    this.page = page;

    // form的jquery元素
    this.form;

    this.init(config);
}

// 默认配置
MyForm.prototype.config_defaults = {
    selector: 'form',

    
};

// 初始化
MyForm.prototype.init = function (config) {
    var that = this;

    // 使用默认配置和自定义配置，组成最终使用的配置
    this.config = $.extend(true, {}, this.config_defaults, config);

    this.form = $(this.config.selector);
}

MyForm.prototype.load_data = function (data) {

    this.clear();

    for (var property in data) {
        if (typeof data[property] == 'string' || typeof data[property] == 'number') {
            $('#' + property, this.form).val(data[property]);
        }        
    }
}

MyForm.prototype.serialize_data = function () {
    var data = this.form.serialize();
    data = data.replace(/\+/g, " ");

    var formData = decodeURIComponent(data);

    var ret = {};

    if (formData) {
        var ret = {};
        var arr = formData.split('&');

        for (var i = 0; i < arr.length; i++){
            if (!arr[i]) continue;
            s = arr[i].split('=');
            ret[s[0]] = s[1];
        }
    }

    $('select', this.form).each(function () {
        var select = this;
        var id = $(select).attr('id');
        if (typeof ret[id] == 'undefined') {
            ret[id] = '';
        }
    })

    return ret;
}

MyForm.prototype.clear = function () {
    $('input[type=hidden]', this.form).val('');
    $('input[type=text]', this.form).val('');
    $('select', this.form).val('');
}





















MyForm.prototype.call_page_method = function (method_name) {

    if (typeof method_name != 'string')
    {
        console.log('MyForm.call_page_method中，method_name不是字符串，其值如下');
        console.log(method_name);
        return;
    }
    
    var page = this.page;
    
    var func = page[method_name];

    if (typeof func != 'function') {
        console.log('MyForm.call_page_method中，找不到调用的方法，方法名如下');
        console.log(method_name);
        return;
    }

    var args = [];

    for (var i in arguments) {
        if (i > 0) {
            args.push(arguments[i]);
        }
    }    

    func.apply(this.page, args)
}





