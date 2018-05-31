var calc = (function () {
    var ret = {};

    // 常量
    var firstTop = 0.5;  // 第一行的格子的top  单位rem
    var secondTop = 1.5;  // 第二行的格子的top  单位rem
    var levelHeight = 1; // 每两行之间的高度差
    var boxWidth = 2.315; // 格子的宽度  单位rem
    var minBoxWidthPx = 193;
    var maxLineNum = 6; // 第一行最多允许的格子个数

    function responsivePx(x) {
        var curr_font = parseFloat(window.top.document.documentElement.style.fontSize);
        var ret = x * curr_font / 100;
        return ret;
    }

    var firstTopPx, secondTopPx, levelHeightPx, totalWidthPx, boxWidthPx;

    function calcPx() {
        firstTopPx = responsivePx(firstTop * 100);
        secondTopPx = responsivePx(secondTop * 100);
        levelHeightPx = responsivePx(levelHeight * 100);
        totalWidthPx = $('.panel').width();
        boxWidthPx = responsivePx(boxWidth * 100);
        if (boxWidthPx < minBoxWidthPx) {
            boxWidthPx = minBoxWidthPx;
        }

        for (var i = 1; i < 10; i++) {
            if (Math.floor(totalWidthPx / (i + 0.5)) <= boxWidthPx - 10)
                break;
            maxLineNum = i;
        }
    }

    // 每行最多max个，总数为n，返回各行数目
    function getGroups(n, max) {
        var arr = [];
        var left = n;

        // 递归的划分
        function divide() {
            // 跳出递归
            if (left <= 0) return;

            // 剩余的box，需要多少行
            var leftLevel = Math.ceil(left / max);

            // 下一行的数目
            var nextNum = Math.ceil(left / leftLevel);

            // 划分
            arr.push(nextNum);
            left -= nextNum;
            divide();
        }

        // 调用划分函数
        divide();

        return arr;
    }

    // 给定分组，计算第i个框在几行几列（行、列从0开始计数）
    function getPos(groups, index) {
        var arr = [];
        for (var i = 0 ; i < groups.length; i++) {
            for (var j = 0; j < groups[i]; j++) {
                arr.push({
                    row: i,
                    col: j
                });
            }
        }

        return {
            row: arr[index].row,
            column: groups.length * arr[index].col + arr[index].row
        }
    }

    // 给定分组，计算某一列的left
    function getLeft(groups, column, num) {
        // 计算分块数
        var block = groups[0];
        if (groups[1] === groups[0]) {
            block += 0.5;
        }

        // 每块占用的宽度
        var w = totalWidthPx / block;

        // 缩进
        var p = w <= boxWidthPx ? 0 : (w - boxWidthPx) / 2;

        // 第一列的left
        var firstLeft = p;

        // 最后一列的left
        var lastLeft = totalWidthPx - Math.max(w, boxWidthPx) + p;

        // 如果只有1块
        if (num == 1)
            return firstLeft;

        // 返回值
        return firstLeft + column * (lastLeft - firstLeft) / (num - 1);
    }

    ret.config = function (options) {
        if (options.firstTop) {
            firstTop = options.firstTop;
        }

        if (options.secondTop) {
            firstTop = options.secondTop;
        }

        if (options.boxWidth) {
            boxWidth = options.boxWidth;
        }
    }

    // 给定一个数字，计算绘制的数据细节
    ret.calculate = function (num) {
        calcPx();

        // 计算每一行有几个
        var groups = getGroups(num, maxLineNum);

        var list = [];

        for (var i = 0; i < num; i++) {
            var item = {};

            // 计算第i个框的位置
            var pos = getPos(groups, i);

            // 第i个框在哪一行
            var row = pos.row;

            // 第i个框在哪一列
            var column = pos.column;

            // 计算top
            var top = firstTopPx + levelHeightPx * row;

            // 计算left
            var left = getLeft(groups, column, num);

            // class名字
            var rowCls = 'row' + row;

            list.push({
                left: left,
                top: top,
                rowCls: rowCls
            });
        }

        return {
            list: list,
            levelNum: groups.length
        };
    }

    return ret;
})();

var drawer = (function () {
    var ret = {};

    ret.draw = function (selector, list) {
        drawChildren(selector, list);
    }

    ret.refresh = function (selector, list) {
        drawChildren(selector, list, true);
    }

    function drawChildren(selector, arr, isRefresh) {
        if (!ret.idField) {
            throw new Error('drawer.idField没有设置');
        }

        var num = arr.length;
        var calcResult = calc.calculate(num);
        var list = calcResult.list;
        var levelNum = calcResult.levelNum;
        for (var i = 0; i < arr.length; i++) {
            var id = arr[i][ret.idField];
            var left = list[i].left;
            var top = list[i].top;
            var rowCls = list[i].rowCls;
            var isLink = !!arr[i].State;
            if (isRefresh) {
                _refreshBox(selector, id, arr[i]);
            } else {
                _drawBox(selector, id, arr[i], left, top, rowCls, isLink);
                $(selector).addClass('panel-level' + levelNum);
            }
        }
    }

    var innerBuilder = null;
    var innerRefresher = null;
    var clickHandler = null;
    ret.drawBoxInner = function (func) {
        innerBuilder = func;
    }
    ret.refreshBoxData = function (func) {
        innerRefresher = func;
    }
    ret.click = function (func) {
        clickHandler = func;
    }

    function _drawBox(selector, id, data, left, top, rowCls, isLink) {
        var box = $("<div class='box box-child'></div>");
        box.css('left', left + 'px');
        box.attr('boxId', id);
        box.addClass(rowCls);
        $(selector).append(box);

        var arrow = $("<div class='arrow'></div>");
        box.append(arrow);

        var inner = $("<div class='inner'></div>");
        inner.attr('boxId', id);
        inner.attr('level', data.Level);
        box.append(inner);

        if (typeof innerBuilder === 'function') {
            innerBuilder(inner, data);
        }

        var strip = $("<div class='arrow-strip'></div>");
        strip.css('height', top + 'px');
        arrow.append(strip);

        var arrowImg = $("<img src='/images2/flow-arrow.png'>");
        arrow.append(arrowImg);

        if (isLink) {
            inner.addClass('link');

            var triangleImg = $("<img class='triangle' src='/images2/flow-triangle.png'>");
            inner.append(triangleImg);
        }

        $(".box-child").on('click', '.link', function () {
            var el = $(this);
            var id = el.attr('boxId');
            if (typeof clickHandler === 'function') {
                clickHandler(id);
            }
        })
    }

    function _refreshBox(selector, id, data) {
        var box = $("div[boxId='" + id + "']");

        if (typeof innerRefresher === 'function') {
            innerRefresher(box, data);
        }
    }

    return ret;
})()

//天然气流向图 部分右键菜单链接配置
var gasMenuConfig = {
    //能源消耗
    energyConsume: {
        "modelBaseID": "url",
        "1d255f1c8807aceA27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:1d256bd5579828018d5d42ab;", //贵溪冶炼厂
        "1d255f200288381A27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:1d254727995538018d5d42ab;", //备料车间
        "1d255f20d66acdaA27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:1d254728c0f8d0018d5d42ab;", //熔炼车间
        "1d255f220230f19A27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:1d254731a210e8018d5d42ab;", //动力车间
        "1d255f22d456dedA27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:1d25472ad70790018d5d42ab;", //倾动炉车间
        "1d255f23a7678a4A27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:1d25472bd88588018d5d42ab;", //新材料车间
        "1d255f243ee6a1fA27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:1d254724489010018d5d42ab;", //一车间
        "1d255f24fbf7632A27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:1d25472d09b288018d5d42ab;", //硫酸车间
        "1d255f94501bb49A27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:;" //铜材公司 //暂时配置为空
    },
    //能耗分析
    energyAnalyse: {
        "modelBaseID": "url",
        "1d255f1c8807aceA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d2598fc193ec0018d5d42ab;", //贵溪冶炼厂
        "1d255f200288381A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d257d874206c0018d5d42ab;", //备料车间
        "1d255f20d66acdaA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d257d79796e70018d5d42ab;", //熔炼车间
        "1d255f220230f19A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d257d1af6b6c8018d5d42ab;", //动力车间
        "1d255f22d456dedA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d257d90923650018d5d42ab;", //倾动炉车间
        "1d255f23a7678a4A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d257d96ddebf8018d5d42ab;", //新材料车间
        "1d255f243ee6a1fA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d257d9f100158018d5d42ab;", //一车间
        "1d255f24fbf7632A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d257da2a38858018d5d42ab;", //硫酸车间
        "1d255f94501bb49A27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:;" //铜材公司 //暂时配置为空
    },
    //绩效分析
    performanceAnalyse: {
        "modelBaseID": "url",
        "1d255f1c8807aceA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d2596fc193ec0018d5d42ab;", //贵溪冶炼厂
        "1d255f200288381A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d257e2a767f88018d5d42ab;", //备料车间
        "1d255f20d66acdaA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d257e2522be70018d5d42ab;", //熔炼车间
        "1d255f220230f19A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d257e048a17f8018d5d42ab;", //动力车间
        "1d255f22d456dedA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d260af686310ecA27bc86aa;", //倾动炉车间
        "1d255f23a7678a4A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d259e4d9e1438018d5d42ab;", //新材料车间
        "1d255f243ee6a1fA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d257e2d088890018d5d42ab;", //一车间
        "1d255f24fbf7632A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d259e4d9e1438018d5d42ab;", //硫酸车间
        "1d255f94501bb49A27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:;" //铜材公司 //暂时配置为空
    },
    //能源成本
    energyCost: {
        "modelBaseID": "url",
        "1d255f1c8807aceA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d259df1d38b38018d5d42ab;", //贵溪冶炼厂
        "1d255f200288381A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d256d874206c0018d5d42ab;", //备料车间
        "1d255f20d66acdaA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d256d79796e70018d5d42ab;", //熔炼车间
        "1d255f220230f19A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d256d1af6b6c8018d5d42ab;", //动力车间
        "1d255f22d456dedA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d256d90923650018d5d42ab;", //倾动炉车间
        "1d255f23a7678a4A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d256d96ddebf8018d5d42ab;", //新材料车间
        "1d255f243ee6a1fA27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d256d9f100158018d5d42ab;", //一车间
        "1d255f24fbf7632A27bc86aa": "/develop/reports/template/charts-line-single/charts-line-single.html?ConfigID:1d256da2a38858018d5d42ab;", //硫酸车间
        "1d255f94501bb49A27bc86aa": "/develop/reports/template/charts-line-multi/charts-line-multi.html?ConfigID:;" //铜材公司 //暂时配置为空
    }
}

//电力流向图 部分右键菜单链接配置
var energyMenuConfig = {
    //能源消耗
    energyConsume: {
        "modelBaseID": "url",
        "1d254e89a3dfb71A27bc86aa": "/develop/reports/power-report-electricity-days-1st/power-report-electricity-days-curves-1st.html?" //1#总降
    },
    //能耗分析
    energyAnalyse: {
    },
    //绩效分析
    performanceAnalyse: {
    },
    //能源成本
    energyCost: {
    }
}