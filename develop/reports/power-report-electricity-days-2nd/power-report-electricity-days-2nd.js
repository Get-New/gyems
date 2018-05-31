// 全局设置ajax异步为false
$.ajaxSetup({
    async: false
});

var Page = {
    table: null, //页面table对象
    titles: null, //存放日期title
    excel_data: null, //存放数值数据
    titles_num: 0, //titles数量

    init: function () {
        $('#search-sdate').val('');

        laydate({
            elem: '#search-sdate',
            event: 'click',
            istime: false,
            ismonth: true,
            format: 'YYYY-MM',
            //choose: function () {
            //    Page.get_report_data();
            //}
        });
        $('#search-sdate').val(laydate.now(0, 'YYYY-MM'));

        var that = this;

        $('#query').click(function () {
            that.get_report_data();
        });

        //导出Excel
        $('#export').click(function () {
            get_excel();
        });

        function get_excel() {
            var form = $("<form>");
            form.attr("style", "display:none");
            form.attr("target", "_blank");
            form.attr("method", "post");
            form.attr("action", '/api/ExcelOut/GetTempletExcel');
            $("body").append(form);

            var input1 = $("<input>");
            input1.attr("type", "hidden");
            input1.attr("name", "filename");
            input1.attr("value", "2#总降压日电量统计报表模板");//模板名称

            var input2 = $("<input>");
            input2.attr("type", "hidden");
            input2.attr("name", "titles");
            input2.attr("value", Page.titles);//模板日期表头数据

            var input3 = $("<input>");
            input3.attr("type", "hidden");
            input3.attr("name", "body");
            input3.attr("value", Page.excel_data);//Excel数值数据

            //Excel设置 FixedHeader(左侧固定列数) FixedFoot(右侧固定列数) Titles(titles数量) Group(每个title所占列数)
            var input4 = $("<input>");
            input4.attr("type", "hidden");
            input4.attr("name", "setting");
            input4.attr("value", "FixedHeader:3,FixedFoot:1,Group:2,Titles:" + Page.titles_num);

            form.append(input1);
            form.append(input2);
            form.append(input3);
            form.append(input4);

            form.submit();
            form.remove();
        }

        that.get_report_data();
    },

    get_month_day: function () {
        var date = $('#search-sdate').val();
        var year = date.split('-')[0];
        var month = date.split('-')[1];

        $.ajax({
            url: '/api/PowerRoomReport/GetDownMonthDay',
            method: 'get',
            dataType: 'json',
            data: {
                year: year, month: month
            },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                Page.titles = null;
                Page.titles = data.Models;
                Page.titles_num = 0;
                Page.titles_num = data.Models.length;
            }
        });
    },

    //请求报表数据
    get_report_data: function () {
        var that = this;

        that.init_table();

        var date = $('#search-sdate').val();
        var year = date.split('-')[0];
        var month = date.split('-')[1];

        $.ajax({
            url: '/api/PowerRoomReport/GetDownTwoDay',
            method: 'get',
            dataType: 'json',
            data: {
                year: year, month: month
            },
            success: function (data) {
                if (!data.Models || !data.Models.length) {
                    return;
                }
                else {
                    Page.excel_data = null;
                    Page.excel_data = data.Models;

                    var list = data.Models;
                    var index = 0;

                    $("td").each(function () {
                        $(this).html(parseInt(list[index++]));
                    })
                }
            }
        });
    },

    init_table: function (data) {
        $('#table_container table').empty();

        Page.table = null;
        Page.table = $('#table_container table');

        var th, td;

        //获取日期数据
        Page.get_month_day();

        //存放临时日期数据
        var temp_titles = null;
        temp_titles = Page.titles;

        //console.log("temp_titles:");
        //console.log(temp_titles);

        var head = [];
        for (var i = 0; i < 38; i++) {
            head[i] = $("<tr></tr>");
            Page.table.append(head[i]);
        }

        //生成固定列1st
        init_table_stable_1st();

        //生成不定列1st
        for (var i = 0; i < temp_titles.length; i++) {
            var temp_titles_info = temp_titles[i];
            init_table_unstable_1st(temp_titles_info);
        }

        //生成固定列2nd
        init_table_stable_2nd();

        // 固定的列1st
        function init_table_stable_1st() {
            th = $("<th rowspan='2' colspan='1'>线路名称</th>");
            th.css('min-width', '150px');
            head[0].append(th);
            th = $("<th rowspan='2' colspan='2'>进线及编号</th>");
            th.css('min-width', '150px');
            head[0].append(th);

            th = $("<th rowspan='4' colspan='1'>进线</th>");
            th.css('min-width', '150px');
            head[2].append(th);
            th = $("<th rowspan='1' colspan='1'>贵冶3#进线</th>");
            th.css('min-width', '150px');
            head[2].append(th);
            th = $("<th rowspan='1' colspan='1'>113</th>");
            th.css('min-width', '150px');
            head[2].append(th);
            th = $("<th rowspan='1' colspan='1'>贵冶4#进线</th>");
            th.css('min-width', '150px');
            head[3].append(th);
            th = $("<th rowspan='1' colspan='1'>114</th>");
            th.css('min-width', '150px');
            head[3].append(th);
            th = $("<th rowspan='2' colspan='1'>动力输入电量</th>");
            th.css('min-width', '150px');
            head[4].append(th);
            th = $("<th rowspan='1' colspan='1'>6105</th>");
            th.css('min-width', '150px');
            head[4].append(th);
            th = $("<th rowspan='1' colspan='1'>6204</th>");
            th.css('min-width', '150px');
            head[5].append(th);

            th = $("<th rowspan='6' colspan='1'>熔炼车间</th>");
            th.css('min-width', '150px');
            head[6].append(th);
            th = $("<th rowspan='1' colspan='1'>闪速炉1#线</th>");
            th.css('min-width', '150px');
            head[6].append(th);
            th = $("<th rowspan='1' colspan='1'>6102</th>");
            th.css('min-width', '150px');
            head[6].append(th);
            th = $("<th rowspan='1' colspan='1'>闪速炉2#线</th>");
            th.css('min-width', '150px');
            head[7].append(th);
            th = $("<th rowspan='1' colspan='1'>6207</th>");
            th.css('min-width', '150px');
            head[7].append(th);
            th = $("<th rowspan='1' colspan='1'>转炉1#线</th>");
            th.css('min-width', '150px');
            head[8].append(th);
            th = $("<th rowspan='1' colspan='1'>6103</th>");
            th.css('min-width', '150px');
            head[8].append(th);
            th = $("<th rowspan='1' colspan='1'>转炉2#线</th>");
            th.css('min-width', '150px');
            head[9].append(th);
            th = $("<th rowspan='1' colspan='1'>6206</th>");
            th.css('min-width', '150px');
            head[9].append(th);
            th = $("<th rowspan='1' colspan='1'>阳极炉1#线</th>");
            th.css('min-width', '150px');
            head[10].append(th);
            th = $("<th rowspan='1' colspan='1'>6104</th>");
            th.css('min-width', '150px');
            head[10].append(th);
            th = $("<th rowspan='1' colspan='1'>阳极炉2#线</th>");
            th.css('min-width', '150px');
            head[11].append(th);
            th = $("<th rowspan='1' colspan='1'>6205</th>");
            th.css('min-width', '150px');
            head[11].append(th);

            th = $("<th rowspan='4' colspan='1'>电解车间</th>");
            th.css('min-width', '150px');
            head[12].append(th);
            th = $("<th rowspan='1' colspan='1'>电解1#线</th>");
            th.css('min-width', '150px');
            head[12].append(th);
            th = $("<th rowspan='1' colspan='1'>6303</th>");
            th.css('min-width', '150px');
            head[12].append(th);
            th = $("<th rowspan='1' colspan='1'>电解2#线</th>");
            th.css('min-width', '150px');
            head[13].append(th);
            th = $("<th rowspan='1' colspan='1'>6304</th>");
            th.css('min-width', '150px');
            head[13].append(th);
            th = $("<th rowspan='1' colspan='1'>净液1#线</th>");
            th.css('min-width', '150px');
            head[14].append(th);
            th = $("<th rowspan='1' colspan='1'>6305</th>");
            th.css('min-width', '150px');
            head[14].append(th);
            th = $("<th rowspan='1' colspan='1'>净液2#线</th>");
            th.css('min-width', '150px');
            head[15].append(th);
            th = $("<th rowspan='1' colspan='1'>6406</th>");
            th.css('min-width', '150px');
            head[15].append(th);

            th = $("<th rowspan='4' colspan='1'>动力车间</th>");
            th.css('min-width', '150px');
            head[16].append(th);
            th = $("<th rowspan='1' colspan='1'>动力1#线</th>");
            th.css('min-width', '150px');
            head[16].append(th);
            th = $("<th rowspan='1' colspan='1'>6105</th>");
            th.css('min-width', '150px');
            head[16].append(th);
            th = $("<th rowspan='1' colspan='1'>动力2#线</th>");
            th.css('min-width', '150px');
            head[17].append(th);
            th = $("<th rowspan='1' colspan='1'>6204</th>");
            th.css('min-width', '150px');
            head[17].append(th);
            th = $("<th rowspan='1' colspan='1'>所用变1#线</th>");
            th.css('min-width', '150px');
            head[18].append(th);
            th = $("<th rowspan='1' colspan='1'>6170</th>");
            th.css('min-width', '150px');
            head[18].append(th);
            th = $("<th rowspan='1' colspan='1'>所用变2#线</th>");
            th.css('min-width', '150px');
            head[19].append(th);
            th = $("<th rowspan='1' colspan='1'>6270</th>");
            th.css('min-width', '150px');
            head[19].append(th);

            th = $("<th rowspan='2' colspan='1'>硫酸车间</th>");
            th.css('min-width', '150px');
            head[20].append(th);
            th = $("<th rowspan='1' colspan='1'>硫酸1#线</th>");
            th.css('min-width', '150px');
            head[20].append(th);
            th = $("<th rowspan='1' colspan='1'>6106</th>");
            th.css('min-width', '150px');
            head[20].append(th);
            th = $("<th rowspan='1' colspan='1'>硫酸2#线</th>");
            th.css('min-width', '150px');
            head[21].append(th);
            th = $("<th rowspan='1' colspan='1'>6203</th>");
            th.css('min-width', '150px');
            head[21].append(th);

            th = $("<th rowspan='4' colspan='1'>备料车间</th>");
            th.css('min-width', '150px');
            head[22].append(th);
            th = $("<th rowspan='1' colspan='1'>备料1#线</th>");
            th.css('min-width', '150px');
            head[22].append(th);
            th = $("<th rowspan='1' colspan='1'>6301</th>");
            th.css('min-width', '150px');
            head[22].append(th);
            th = $("<th rowspan='1' colspan='1'>备料2#线</th>");
            th.css('min-width', '150px');
            head[23].append(th);
            th = $("<th rowspan='1' colspan='1'>6402</th>");
            th.css('min-width', '150px');
            head[23].append(th);
            th = $("<th rowspan='1' colspan='1'>预干燥1#线</th>");
            th.css('min-width', '150px');
            head[24].append(th);
            th = $("<th rowspan='1' colspan='1'>6306</th>");
            th.css('min-width', '150px');
            head[24].append(th);
            th = $("<th rowspan='1' colspan='1'>预干燥2#线</th>");
            th.css('min-width', '150px');
            head[25].append(th);
            th = $("<th rowspan='1' colspan='1'>6407</th>");
            th.css('min-width', '150px');
            head[25].append(th);

            th = $("<th rowspan='3' colspan='1'>制氧车间</th>");
            th.css('min-width', '150px');
            head[26].append(th);
            th = $("<th rowspan='1' colspan='1'>制氧1#线</th>");
            th.css('min-width', '150px');
            head[26].append(th);
            th = $("<th rowspan='1' colspan='1'>6302</th>");
            th.css('min-width', '150px');
            head[26].append(th);
            th = $("<th rowspan='1' colspan='1'>制氧2#线</th>");
            th.css('min-width', '150px');
            head[27].append(th);
            th = $("<th rowspan='1' colspan='1'>6403</th>");
            th.css('min-width', '150px');
            head[27].append(th);
            th = $("<th rowspan='1' colspan='1'>5#制氧机</th>");
            th.css('min-width', '150px');
            head[28].append(th);
            th = $("<th rowspan='1' colspan='1'>6405</th>");
            th.css('min-width', '150px');
            head[28].append(th);

            th = $("<th rowspan='2' colspan='1'>新产业</th>");
            th.css('min-width', '150px');
            head[29].append(th);
            th = $("<th rowspan='1' colspan='1'>反射炉1#线</th>");
            th.css('min-width', '150px');
            head[29].append(th);
            th = $("<th rowspan='1' colspan='1'>6101</th>");
            th.css('min-width', '150px');
            head[29].append(th);
            th = $("<th rowspan='1' colspan='1'>反射炉2#线</th>");
            th.css('min-width', '150px');
            head[30].append(th);
            th = $("<th rowspan='1' colspan='1'>6208</th>");
            th.css('min-width', '150px');
            head[30].append(th);

            th = $("<th rowspan='2' colspan='1'>铜材公司</th>");
            th.css('min-width', '150px');
            head[31].append(th);
            th = $("<th rowspan='1' colspan='1'>铜材1#线</th>");
            th.css('min-width', '150px');
            head[31].append(th);
            th = $("<th rowspan='1' colspan='1'>6108</th>");
            th.css('min-width', '150px');
            head[31].append(th);
            th = $("<th rowspan='1' colspan='1'>铜材2#线</th>");
            th.css('min-width', '150px');
            head[32].append(th);
            th = $("<th rowspan='1' colspan='1'>6201</th>");
            th.css('min-width', '150px');
            head[32].append(th);

            th = $("<th rowspan='3' colspan='1'>选矿车间</th>");
            th.css('min-width', '150px');
            head[33].append(th);
            th = $("<th rowspan='1' colspan='1'>渣选1#线</th>");
            th.css('min-width', '150px');
            head[33].append(th);
            th = $("<th rowspan='1' colspan='1'>6107</th>");
            th.css('min-width', '150px');
            head[33].append(th);
            th = $("<th rowspan='1' colspan='1'>渣选2#线</th>");
            th.css('min-width', '150px');
            head[34].append(th);
            th = $("<th rowspan='1' colspan='1'>6202</th>");
            th.css('min-width', '150px');
            head[34].append(th);
            th = $("<th rowspan='1' colspan='1'>渣选3#线</th>");
            th.css('min-width', '150px');
            head[35].append(th);
            th = $("<th rowspan='1' colspan='1'>6307</th>");
            th.css('min-width', '150px');
            head[35].append(th);

            th = $("<th rowspan='1' colspan='1'>厂办</th>");
            th.css('min-width', '150px');
            head[36].append(th);
            th = $("<th rowspan='1' colspan='1'>厂办线</th>");
            th.css('min-width', '150px');
            head[36].append(th);
            th = $("<th rowspan='1' colspan='1'>6211</th>");
            th.css('min-width', '150px');
            head[36].append(th);

            th = $("<th rowspan='1' colspan='1'>路灯</th>");
            th.css('min-width', '150px');
            head[37].append(th);
            th = $("<th rowspan='1' colspan='1'>路灯照明线</th>");
            th.css('min-width', '150px');
            head[37].append(th);
            th = $("<th rowspan='1' colspan='1'>6209</th>");
            th.css('min-width', '150px');
            head[37].append(th);
        }

        // 不固定的列1st
        function init_table_unstable_1st(day_info) {
            var temp_th = "<th rowspan='1' colspan='2'>" + day_info + "</th>"
            th = $(temp_th);
            th.css('min-width', '300px');
            head[0].append(th);
            th = $("<th rowspan='1' colspan='1'>当日线路累积 kwh</th>");
            th.css('min-width', '150px');
            head[1].append(th);
            th = $("<th rowspan='1' colspan='1'>当日车间累积 10^4kwh</th>");
            th.css('min-width', '150px');
            head[1].append(th);

            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[2].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[3].append(th);
            th = $("<td rowspan='2' colspan='1'></td>");
            th.css('min-width', '150px');
            head[2].append(th);

            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[4].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[5].append(th);
            th = $("<td rowspan='2' colspan='1'></td>");
            th.css('min-width', '150px');
            head[4].append(th);

            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[6].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[7].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[8].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[9].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[10].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[11].append(th);
            th = $("<td rowspan='6' colspan='1'></td>");
            th.css('min-width', '150px');
            head[6].append(th);

            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[12].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[13].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[14].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[15].append(th);
            th = $("<td rowspan='4' colspan='1'></td>");
            th.css('min-width', '150px');
            head[12].append(th);

            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[16].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[17].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[18].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[19].append(th);
            th = $("<td rowspan='4' colspan='1'></td>");
            th.css('min-width', '150px');
            head[16].append(th);

            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[20].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[21].append(th);
            th = $("<td rowspan='2' colspan='1'>/td>");
            th.css('min-width', '150px');
            head[20].append(th);

            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[22].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[23].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[24].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[25].append(th);
            th = $("<td rowspan='4' colspan='1'></td>");
            th.css('min-width', '150px');
            head[22].append(th);

            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[26].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[27].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[28].append(th);
            th = $("<td rowspan='3' colspan='1'></td>");
            th.css('min-width', '150px');
            head[26].append(th);

            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[29].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[30].append(th);
            th = $("<td rowspan='2' colspan='1'></td>");
            th.css('min-width', '150px');
            head[29].append(th);

            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[31].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[32].append(th);
            th = $("<td rowspan='2' colspan='1'></td>");
            th.css('min-width', '150px');
            head[31].append(th);

            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[33].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[34].append(th);
            th = $("<td rowspan='1' colspan='1'></td>");
            th.css('min-width', '150px');
            head[35].append(th);
            th = $("<td rowspan='3' colspan='1'></td>");
            th.css('min-width', '150px');
            head[33].append(th);

            th = $("<td rowspan='1' colspan='1'>6211</td>");
            th.css('min-width', '150px');
            head[36].append(th);
            th = $("<td rowspan='1' colspan='1'>厂办</td>");
            th.css('min-width', '150px');
            head[36].append(th);

            th = $("<td rowspan='1' colspan='1'>6209</td>");
            th.css('min-width', '150px');
            head[37].append(th);
            th = $("<td rowspan='1' colspan='1'>路灯</td>");
            th.css('min-width', '150px');
            head[37].append(th);
        }

        // 固定的列2nd
        function init_table_stable_2nd() {
            th = $("<th rowspan='2' colspan='1'>当月累积 10^4kwh</th>");
            th.css('min-width', '150px');
            head[0].append(th);

            th = $("<td rowspan='2' colspan='1'></td>");
            th.css('min-width', '150px');
            head[2].append(th);

            th = $("<td rowspan='2' colspan='1'></td>");
            th.css('min-width', '150px');
            head[4].append(th);

            th = $("<td rowspan='6' colspan='1'></td>");
            th.css('min-width', '150px');
            head[6].append(th);

            th = $("<td rowspan='4' colspan='1'></td>");
            th.css('min-width', '150px');
            head[12].append(th);

            th = $("<td rowspan='4' colspan='1'></td>");
            th.css('min-width', '150px');
            head[16].append(th);

            th = $("<td rowspan='2' colspan='1'>/td>");
            th.css('min-width', '150px');
            head[20].append(th);

            th = $("<td rowspan='4' colspan='1'></td>");
            th.css('min-width', '150px');
            head[22].append(th);

            th = $("<td rowspan='3' colspan='1'></td>");
            th.css('min-width', '150px');
            head[26].append(th);

            th = $("<td rowspan='2' colspan='1'></td>");
            th.css('min-width', '150px');
            head[29].append(th);

            th = $("<td rowspan='2' colspan='1'></td>");
            th.css('min-width', '150px');
            head[31].append(th);

            th = $("<td rowspan='3' colspan='1'></td>");
            th.css('min-width', '150px');
            head[33].append(th);

            th = $("<td rowspan='1' colspan='1'>厂办</td>");
            th.css('min-width', '150px');
            head[36].append(th);

            th = $("<td rowspan='1' colspan='1'>路灯</td>");
            th.css('min-width', '150px');
            head[37].append(th);
        }
    },
};