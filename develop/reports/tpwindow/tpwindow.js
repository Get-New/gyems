
var options = (function () {
    var ret = {};

    // 是否在顶部选择项目
    ret.showCvs = false;

    // 是否允许多选
    ret.multiCvs = false;

    // 自动选择多少项
    ret.autoSelectNum = 1;

    // 默认时间类型（可选year、month、day）
    ret.defaultDateType = 'year';

    // 图表(可能有多个)
    ret.charts = [{
        // 容器的id
        containerId: 'chart1',
    }];

    return ret;
})();

$(function () {

    tp.init();

    mywin.config({
        width: 900,
        height: 650
    })
    mywin.init();

    var data = demoHelper.line();
    console.log(data);
    linechart.draw(options.charts[0], data);

    $("#clickme").click(function () {
        mywin.open();
    })

    $(".opacity-div-for-modelwin").click(function () {
        mywin.close();
    })

})
