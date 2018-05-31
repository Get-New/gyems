
var options = (function () {
    var ret = {};

    // 是否在顶部选择项目
    ret.showCvs = true;

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

    dst.config({
        startYear: 2013,
        startMonth: 5,
        startDay: 1,
        endYear: 2018,
        endMonth: 10,
        endDay: 20
    })

    tp.init();

    tp.bindDrawMethod(function () {
        draw();
    })

    tp.bindCvsData(demoHelper.cvs());
    draw();
})

function draw() {

    if (tp.isReady() == false)
        return;

    var type = dst.getCurrType();
    var year = dst.getCurrYear();
    var month = dst.getCurrMonth();
    var day = dst.getCurrDay();

    var cvsList = cvs.selectedList;

    //console.log(type, year, month, day, cvsList);

    /* 折线图 */
    //var data = demoHelper.line();
    //linechart.changeEchartsOption(options.charts[0], function (echartOption) {
    //    echartOption.grid.left = '10%';
    //});
    //linechart.draw(options.charts[0], data);    
    //linechart.click(options.charts[0], function (pms) {
    //    console.log(pms);
    //})



    /* 堆叠图图 */
    var data = demoHelper.stack();
    stackchart.draw(options.charts[0], data);
    stackchart.click(options.charts[0], function (pms) {
        alert('您点击了' + pms.seriesName + '上的节点，x轴为' + pms.data + '，y轴为' + pms.name);
    })

    /* 单个饼图 */
    //var data = demoHelper.pie1();
    //piechart.draw1(options.charts[0], data);
    //piechart.click(options.charts[0], function (pms) {
    //    alert('您点击了' + pms.name);
    //})

    /* 双饼图 */
    //var data = demoHelper.pie2();
    //piechart.draw2(options.charts[0], data);
    //piechart.click(options.charts[0], function (pms) {
    //    alert('您点击了' + pms.name);
    //})

    /* 柱状图 */
    //var data = demoHelper.bar();
    //stackchart.draw(options.charts[0], data);
    //stackchart.click(options.charts[0], function (pms) {
    //    alert('您点击了' + pms.seriesName + '上的节点，x轴为' + pms.data + '，y轴为' + pms.name);
    //})

    /*表盘图*/
    //var data = demoHelper.gaugechart();
    //gaugechart.draw(options.charts[0], data);
    //gaugechart.click(options.charts[0], function (pms) {
    //    console.log('您点击了' + pms.seriesName + '上的节点，x轴为' + pms.name + '，y轴为' + pms.data);
    //})

}




