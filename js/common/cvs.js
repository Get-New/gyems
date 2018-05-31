
// 报表数据项目的勾选

var cvs = (function () {

    var conf = {
        selector: '.cvs',
        fake: false,
        fakeData: [],
        field: '',
        multi: true,
        autoSelectNum: 1
    };

    var selectHandler = null;

    var ret = {};
    ret.allList = [];
    ret.selectedList = [];

    ret.config = function (options) {
        conf = $.extend(true, {}, conf, options)
    }

    ret.init = function (callback) {
        var that = this;

        if (conf.fake) {
            cont(conf.fakeData);
            return;
        }

        $.ajax({
            url: conf.url,
            dataType: 'json',
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }

                var item = data.Models;
                cont(item);
            }
        })

        function cont(item) {
            for (var i = 0; i < item.length; i++) {

                var name = conf.field ? item[i][conf.field] : item[i];
                that.allList.push(name);                

                if (i < conf.autoSelectNum) {
                    that.selectedList.push(name);
                }
            }

            that.draw();

            if (typeof callback === 'function') {
                callback();
            }
        }
    }

    ret.draw = function () {
        var that = this;
        var list = this.allList;
        var ul = $(conf.selector);
        ul.html('');

        for (var i in list) {
            var item = list[i];

            var li = $("<li></li>");
            li.append(item);
            li.attr('ItemId', item);
            ul.append(li);

            for (var j = 0; j < that.selectedList.length; j++) {
                if (that.selectedList[j] == item) {
                    li.addClass('active');
                }
            }
        }

        $(conf.selector + " li").click(function () {
            var el = $(this);

            if (conf.multi == false) {
                $(conf.selector + " li").removeClass('active')
            }
            
            if (el.hasClass('active')) {
                el.removeClass('active');
            } else {
                el.addClass('active');
            }

            that.selectedList = getSelectedIds();
            
            if (typeof selectHandler === 'function') {
                selectHandler(that.selectedList);
            }
        })
    }

    ret.select = function (func) {
        selectHandler = func;
    }

    function getSelectedIds() {
        var arr = [];
        $(conf.selector + " li").each(function () {
            var el = $(this);
            if (el.hasClass('active')) {
                arr.push(el.attr('ItemId'));
            }
        })
        return arr;
    }

    return ret;

})();