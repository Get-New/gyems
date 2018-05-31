/*
    该文件为Util对象扩展了一些方法

    具体包含以下功能
    1. 封装jquery的ajax方法
    2. 成功/失败提示功能
    3. 确认框功能
    4. 封装add、edit、delete请求

    作者 Zhu Hui
    ※ 有问题请联系作者，不要修改该文件

    <<<--- 配置项 --->>>
    selector  form元素的jquery选择器，默认是form

    <<<--- 接口函数 --->>>

    Util.ajax(option)  发起请求，option格式如下
        page：处理函数的this指针，可选
        url：必填，请求地址
        type：请求类型，默认是get
        data：请求数据，可选
        dataType：返回类型，默认是json
        error_msg：出错时提示的信息，类型是string或function，参数是api的返回值；默认是字符串“发生错误，操作失败”
        show_error_msg：出错时是否提示错误，默认是true
        success_msg：成功时提示的信息，类型是string或function，参数是api返回值；默认是字符串“成功”
        show_success_msg：成功时是否提示信息，默认是false
        success：成功时的处理函数，参数是api返回值
        error: 出错时的处理函数，参数是api的返回值
        show_confirm_msg：是否显示确认框，默认是false
        confirm_msg：确认框的提示信息；类型是string或function

    Util.ajax_add(option)  发起add请求，对Util.ajax做了如下扩展

        type：默认是post了
        show_success_msg：默认是true了
        success_msg：默认值是“添加成功”
        model：新增配置项，可以代替url，根据该字段拼接的url，拼接方法是 /api/模块名/Add
        validator：新增配置项，校验函数，请求前调用该函数，传入参数data

    Util.ajax_edit(option)  发起edit请求，对Util.ajax做了如下扩展

        type：默认是put了
        show_success_msg：默认是true了
        success_msg：默认值是“修改成功”
        model：新增配置项，可以代替url，根据该字段拼接的url，拼接方法是 /api/模块名/Edit
        validator：新增配置项，校验函数，请求前调用该函数，传入参数data

     Util.ajax_delete(option)  发起delete请求，对Util.ajax做了如下扩展

        type：默认是delete了
        show_success_msg：默认是true了
        success_msg：默认值是“删除成功”
        show_confirm_msg：默认是true了
        confirm_msg：默认是“确定要删除该项吗？”
        model：新增配置项，可以代替url，根据该字段拼接的url，拼接方法是 /api/模块名/Edit
        validator：新增配置项，校验函数，请求前调用该函数，传入参数data

*/

Util.ajax = function (option) {
    if (!option.url) {
        throw new Error('Util.ajax的参数不正确，没有url');
    }

    function call_method(func) {
        var args = [];

        for (var i in arguments) {
            if (i > 0) {
                args.push(arguments[i]);
            }
        }

        if (typeof option.page == 'object') {
            return func.apply(option.page, args);
        } else {
            return func(args);
        }
    }

    function get_str_or_func(x) {
        if (typeof x == 'string') {
            return x;
        }
        if (typeof x == 'function') {
            var args = [];

            for (var i in arguments) {
                if (i > 0) {
                    args.push(arguments[i]);
                }
            }

            return call_method(x, args)
        }
    }

    if (option.show_confirm_msg) {
        var confirm_msg = option.confirm_msg || '确认吗?';
        var msg = get_str_or_func(confirm_msg, option.data);
        if (msg) {
            Util.confirm(msg, next);
        }
    } else {
        next();
    }

    function next() {
        var url = option.url;
        var type = option.type || 'get';
        var data = option.data || {};
        var dataType = option.dataType || 'json';

        var show_error_msg = true;
        if (typeof option.show_error_msg == 'boolean') {
            show_error_msg = option.show_error_msg;
        }

        $.ajax({
            url: url,
            type: type,
            data: data,
            dataType: dataType,
            success: function (data) {
                if (!data || !data.Success) {
                    if (show_error_msg) {
                        var error_msg = option.error_msg || data.Errors ? data.Errors.Message : '发生错误，操作失败';
                        var msg = get_str_or_func(error_msg, data);
                        if (msg) {
                            Util.alert(msg);
                        }
                    }

                    console.log('在调用接口' + url + '时发生错误，返回值如下')
                    console.log(data);
                    return;
                }

                if (option.show_success_msg) {
                    var success_msg = option.success_msg || '成功';
                    var msg = get_str_or_func(success_msg, data);
                    if (msg) {
                        Util.alert(msg);
                    }
                }

                if (typeof option.success == 'function') {
                    call_method(option.success, data);
                }
            },
            error: function (x, y, z) {
                console.log('在调用接口' + url + '时出现ajax.error错误，请求值和返回值如下')
                console.log(option)
                console.log(x);
                console.log(y);
                console.log(z);
            }
        })
    }
}

Util.ajax_add = function (option) {
    var option_default = {
        type: 'post',
        show_success_msg: true,
        success_msg: '添加成功',
    };

    if (option.model && !option.url) {
        option.url = '/api/' + option.model + '/Add';
    }

    if (typeof option.validator == 'function') {
        var msg;
        if (typeof option.page == 'object') {
            msg = option.validator.call(option.page, option.data);
        } else {
            msg = option.validator(option.data);
        }

        if (msg) {
            Util.alert(msg);
            return;
        }
    }

    var opt = $.extend({}, option_default, option);

    Util.ajax(opt);
}

Util.ajax_edit = function (option) {
    var option_default = {
        type: 'put',
        show_success_msg: true,
        success_msg: '修改成功',
    };

    if (option.model && !option.url) {
        option.url = '/api/' + option.model + '/Edit';
    }

    if (typeof option.validator == 'function') {
        var msg;
        if (typeof option.page == 'object') {
            msg = option.validator.call(option.page, option.data);
        } else {
            msg = option.validator(option.data);
        }

        if (msg) {
            Util.alert(msg);
            return;
        }
    }

    var opt = $.extend({}, option_default, option);

    Util.ajax(opt);
}

Util.ajax_delete = function (option) {
    var option_default = {
        type: 'delete',
        show_success_msg: true,
        success_msg: '删除成功',
        show_confirm_msg: true,
        confirm_msg: '确定要删除该项吗？'
    };

    if (option.model && !option.url) {
        option.url = '/api/' + option.model + '/Delete';
    }

    if (typeof option.validator == 'function') {
        var msg;
        if (typeof option.page == 'object') {
            msg = option.validator.call(option.page, option.data);
        } else {
            msg = option.validator(option.data);
        }

        if (msg) {
            Util.alert(msg);
            return;
        }
    }

    var opt = $.extend({}, option_default, option);

    Util.ajax(opt);
}