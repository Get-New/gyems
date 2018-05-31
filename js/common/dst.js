
// 封装年月日报表的时间选择部分

var dst = (function () {
    var ret = {};

    // daysrc负责返回某区间内的所有年、月、日
    var daysrc = (function () {
        // 某年某月有几天
        function getDaysNum(year, month) {
            return new Date(year, month, 0).getDate();
        }

        function ret() { }

        ret.getYears = function (startYear, endYear) {
            var arr = [];
            for (var i = startYear; i <= endYear; i++) {
                arr.push({
                    year: i
                });
            }
            return arr;
        }

        ret.getMonths = function (startYear, startMonth, endYear, endMonth) {

            var arr = [];
            for (var i = startYear; i <= endYear; i++) {

                var m0 = 1, m1 = 12;
                if (i == startYear) {
                    m0 = startMonth;
                } else if (i == endYear) {
                    m1 = endMonth;
                }

                var year = {
                    year: i,
                    months: []
                }

                for (var j = m0; j <= m1; j++) {
                    year.months.push({
                        month: j
                    })
                }

                arr.push(year);
            }
            return arr;
        }

        ret.getDays = function (startYear, startMonth, startDay, endYear, endMonth, endDay) {
            var arr = [];
            for (var i = startYear; i <= endYear; i++) {

                var m0 = 1, m1 = 12;
                if (i == startYear) {
                    m0 = startMonth;
                } else if (i == endYear) {
                    m1 = endMonth;
                }

                var year = {
                    year: i,
                    months: []
                };
                arr.push(year);

                for (var j = m0; j <= m1; j++) {

                    var month = {
                        month: j,
                        days: []
                    };
                    year.months.push(month);

                    var d0 = 1;
                    var d1 = getDaysNum(i, j);
                    if (i == startYear && j == startMonth) {
                        d0 = startDay;
                    } else if (i == endYear && j == endMonth) {
                        d1 = endDay;
                    }

                    for (var k = d0; k <= d1; k++) {
                        month.days.push({
                            day: k
                        });
                    }
                }
            }
            return arr;
        }

        return ret;
    }())

    // dwin负责维护弹出的日期选框
    var dwin = (function () {
        var ret = {};

        var startYear, startMonth, startDay, endYear, endMonth, endDay;

        // daysrc组件返回的对象数组
        var list;

        // 当前的类型
        var currType;

        // 目前正在选中的年月日
        var activeYear, activeMonth, activeDay;

        // 选择之后的处理函数
        var selectHandler;

        // 修改窗体div的class
        function setTypeClass(type) {
            var cls = 'window-' + type;
            $('.window-date').removeClass('window-year').removeClass('window-month').removeClass('window-day').addClass(cls);
        }

        // 清空某类型的li
        function clear(type) {
            if (typeof type === 'string') {
                $(".window-date .sub-" + type + " li").remove();
            } else {
                $(".window-date li").remove();
            }
        }

        // 清空某类型的选中状态
        function clearActive(type) {
            var ul = getul(type);
            $('li', ul).removeClass('active');
        }

        // 添加li
        function appendItem(type, num, active) {
            var ul = getul(type);
            var li = $("<li></li>");
            var typeStr = (function (t) {
                switch (t) {
                    case 'year': return '';
                    case 'month': return '月';
                    case 'day': return '日';
                }
            })(type)

            li.html(num + typeStr);
            li.attr('type', type);
            li.attr('num', num);

            if (active) {
                li.addClass('active');
            }

            ul.append(li);
        }

        // 绘制年
        function drawYears() {
            clear('year');
            var actived = false;
            for (var i = 0; i < list.length; i++) {
                var objYear = list[i];
                if (objYear.year == activeYear) {
                    appendItem('year', objYear.year, true);
                    actived = true;
                } else {
                    appendItem('year', objYear.year, false);
                }
            }
            if (!actived) {
                var ul = getul('year');
                var firstLi = $('li:first', ul);
                firstLi.addClass('active');
                activeYear = firstLi.attr('num');
            }
        }

        // 绘制月
        function drawMonths() {
            clear('month');
            var actived = false;
            for (var i = 0; i < list.length; i++) {
                var objYear = list[i];
                if (activeYear == objYear.year) {
                    for (var i = 0; i < objYear.months.length; i++) {
                        var objMonth = objYear.months[i];
                        if (objMonth.month == activeMonth) {
                            appendItem('month', objMonth.month, true);
                            actived = true;
                        } else {
                            appendItem('month', objMonth.month, false);
                        }
                    }
                }
            }
            if (!actived) {
                var ul = getul('month');
                var firstLi = $('li:first', ul);
                firstLi.addClass('active');
                activeMonth = firstLi.attr('num');
            }
        }

        // 绘制日
        function drawDays() {
            clear('day');
            var actived = false;
            for (var i = 0; i < list.length; i++) {
                var objYear = list[i];
                if (activeYear == objYear.year) {
                    for (var j = 0; j < objYear.months.length; j++) {
                        var objMonth = objYear.months[j];
                        if (activeMonth == objMonth.month) {
                            for (var k = 0; k < objMonth.days.length; k++) {
                                var objDay = objMonth.days[k];
                                if (objDay.day == activeDay) {
                                    appendItem('day', objDay.day, true);
                                    actived = true;
                                } else {
                                    appendItem('day', objDay.day, false);
                                }
                            }
                        }
                    }
                }
            }
            if (!actived) {
                var ul = getul('day');
                var firstLi = $('li:first', ul);
                firstLi.addClass('active');
                activeDay = firstLi.attr('num');
            }
        }

        function getul(type) {
            return $(".sub-" + type + " ul");
        }

        function onclick(el, e, clicktime, thisArg) {
            var type = el.attr('type');
            var num = parseInt(el.attr('num'));
            var ul = getul(type);
            clearActive(type);
            el.addClass('active');

            switch (type) {
                case 'year':
                    activeYear = num;
                    if (currType == type) {
                        if (clicktime == 2) {
                            selectHandler(activeYear);
                            thisArg.close();
                        }
                    } else {
                        drawMonths();
                        if (currType == 'day') {
                            drawDays();
                        }
                    }

                    break;
                case 'month':
                    activeMonth = num;
                    if (currType == type) {
                        if (clicktime == 2) {
                            selectHandler(activeYear, activeMonth);
                            thisArg.close();
                        }
                    } else {
                        if (currType == 'day') {
                            drawDays();
                        }
                    }
                    break;
                case 'day':
                    activeDay = num;
                    if (currType == type && clicktime == 2) {
                        selectHandler(activeYear, activeMonth, activeDay);
                        thisArg.close();
                    }
                    break;
            }
        }

        ret.open = function (type, year, month, day) {
            currType = type;
            setTypeClass(type);
            clear();
            activeYear = year;
            activeMonth = month;
            activeDay = day;

            switch (type) {
                case 'year':
                    list = daysrc.getYears(startYear, endYear);
                    drawYears();
                    break;
                case 'month':
                    list = daysrc.getMonths(startYear, startMonth, endYear, endMonth);
                    drawYears();
                    drawMonths();
                    break;
                case 'day':
                    list = daysrc.getDays(startYear, startMonth, startDay, endYear, endMonth, endDay);
                    drawYears();
                    drawMonths();
                    drawDays();
                    break;
            }

            $('.window-date').fadeIn(200);
        }

        ret.close = function () {
            $('.window-date').hide();
        }

        ret.setEdge = function (sYear, sMonth, sDay, eYear, eMonth, eDay) {
            startYear = sYear;
            startMonth = sMonth;
            startDay = sDay;
            endYear = eYear;
            endMonth = eMonth;
            endDay = eDay;
        }

        ret.init = function () {
            var that = this;
            $(".window-date").on('click', 'li', function (e) {
                onclick($(this), e, 1, that);
            });
            $(".window-date").on('dblclick', 'li', function (e) {
                onclick($(this), e, 2, that);
            });
            $(".window-date .window-cancel").click(function () { that.close(); });
            $(".window-date .window-save").click(function () {
                selectHandler(activeYear, activeMonth, activeDay);
                that.close();
            });
        }

        ret.select = function (func) {
            selectHandler = func;
        }

        return ret;
    }());

    var currType, currYear, currMonth, currDay, changeHandler;
    var _startYear, _startMonth, _startDay, _endYear, _endMonth, _endDay;

    // 获得此时此刻的年月日
    function nowYMD() {
        var date = new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }

    // 根据情况，把向前或向后的箭头变灰
    function checkPrePost(type, year, month, day) {
        var now = nowYMD();
        var start = { y: _startYear, m: _startMonth, d: _startDay };
        var end = { y: _endYear, m: _endMonth, d: _endDay };
        switch (type) {
            case 'year':
                setPre(year > start.y);
                setPost(year < end.y);
                break;
            case 'month':
                setPre(year > start.y || month > start.m);
                setPost(year < end.y || month < end.m);
                break;
            case 'day':
                setPre(year > start.y || month > start.m || day > start.d);
                setPost(year < end.y || month < end.m || day < end.d);
                break;
        }

        function setPre(flag) {
            if (flag) {
                $('.pre').removeClass('disabled');
            } else {
                $('.pre').addClass('disabled');
            }
        }

        function setPost(flag) {
            if (flag) {
                $('.next').removeClass('disabled');
            } else {
                $('.next').addClass('disabled');
            }
        }
    }

    function go(type, year, month, day) {
        switch (type) {
            case 'year':
                currType = 'year';
                currYear = year;
                setTitle(year);
                changeHandler('year', year);
                break;
            case 'month':
                currType = 'month';
                currYear = year;
                currMonth = month;
                setTitle(year, month);
                changeHandler('month', year, month);
                break;
            case 'day':
                currType = 'day';
                currYear = year;
                currMonth = month;
                currDay = day;
                setTitle(year, month, day);
                changeHandler('day', year, month, day);
                break;
        }
        checkPrePost(type, year, month, day);
    }

    // 切换到年模式
    function switchYear() {
        $(".tab-date-type li").removeClass('active');
        $('#year').addClass('active');
        $('.pre i').html('前一年');
        $('.next i').html('后一年');
        go('year', nowYMD().year);
    }

    // 切换到月模式
    function switchMonth() {
        $(".tab-date-type li").removeClass('active');
        $('#month').addClass('active');
        $('.pre i').html('前一月');
        $('.next i').html('后一月');
        var now = nowYMD();
        go('month', now.year, now.month);
    }

    // 切换到天模式
    function switchDay() {
        $(".tab-date-type li").removeClass('active');
        $('#day').addClass('active');
        $('.pre i').html('前一天');
        $('.next i').html('后一天');
        var now = nowYMD();
        go('day', now.year, now.month, now.day);
    }

    function update() {
        go(currType, currYear, currMonth, currDay);
    }

    // 向前
    function preOrNext(n) {
        switch (currType) {
            case 'year':
                currYear += n;
                break;
            case 'month':
                currMonth += n;
                if (currMonth == 0 || currMonth == 13) {
                    currMonth = Math.abs(currMonth - 12);
                    currYear += n;
                }
                break;
            case 'day':
                var date = new Date(currYear, currMonth - 1, currDay);
                var n_date = new Date(date.getTime() + 24 * 60 * 60 * 1000 * n);
                currYear = n_date.getFullYear();
                currMonth = n_date.getMonth() + 1;
                currDay = n_date.getDate();
                break;
        }
        update();
    }

    // 设置标题
    function setTitle(year, month, day) {
        var str = year + '年';

        if (typeof month === 'number' && month >= 1 && month <= 12) {
            var zero = month < 10 ? '0' : '';
            str += zero + month + '月';
        }

        if (typeof day === 'number' && day >= 1 && day <= 31) {
            var zero = day < 10 ? '0' : '';
            str += zero + day + '日';
        }

        $("#title").html(str);
    }

    ret.change = function (func) {
        changeHandler = func;
    }

    var conf = {
        type: 'month',
        startYear: 2015,
        startMonth: 11,
        startDay: 29,
        endYear: 0,
        endMonth: 0,
        endDay: 0
    };

    ret.config = function (config) {
        conf = $.extend(true, {}, conf, config)
    }

    ret.init = function () {
        var type = conf.type;
        var now = nowYMD();
        _startYear = conf.startYear;
        _startMonth = conf.startMonth;
        _startDay = conf.startDay;
        _endYear = conf.endYear || now.year;
        _endMonth = conf.endMonth || now.month;
        _endDay = conf.endDay || now.day;

        switch (type) {
            case 'year':
                switchYear();
                break;
            case 'day':
                switchDay();
                break;
            default:
                switchMonth();
                break;
        }

        $("#title").click(function () {
            dwin.open(currType, currYear, currMonth, currDay);
        })
        $('#year').click(function () {
            switchYear();

        })
        $('#month').click(function () {
            switchMonth();
        })
        $('#day').click(function () {
            switchDay();
        })
        $('#pre').click(function () {
            if ($(this).hasClass('disabled')) return;
            preOrNext(-1);
        })
        $('#next').click(function () {
            if ($(this).hasClass('disabled')) return;
            preOrNext(1);
        })

      
        dwin.setEdge(_startYear, _startMonth, _startDay, _endYear, _endMonth, _endDay);
        dwin.select(function (y, m, d) {
            go(currType, y, m, d);
        })
        dwin.init();
    }

    ret.getCurrType = function () {
        return currType;
    }

    ret.getCurrYear = function () {
        return currYear
    }

    ret.getCurrMonth = function () {
        return currMonth;
    }

    ret.getCurrDay = function () {
        return currDay;
    }

    return ret;
}())