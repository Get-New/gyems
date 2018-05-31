var Page = {
    excel_data: null, //存放数值数据

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
        $('#search-sdate').val(laydate.now(-31, 'YYYY-MM'));

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

            var input1 = $("<input>");
            input1.attr("type", "hidden");
            input1.attr("name", "filename");
            input1.attr("value", "电解车间能耗月度统计模板");//模板名称
            $("body").append(form);

            var input2 = $("<input>");
            input2.attr("type", "hidden");
            input2.attr("name", "body");
            input2.attr("value", Page.excel_data);//Excel数值数据
            $("body").append(form);

            form.append(input1);
            form.append(input2);

            form.submit();
            form.remove();
        }

        //初始化报表
        var tr = $("<tr ></tr>");
        var td = $("<th>t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 6; j++) {
            td = $("<td id='tddata" + (j + 1) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report #tr1").after(tr);

        //电
        tr = $("<tr></tr>");
        td = $("<th rowspan='3'>1电</th><th>车间</th><th>KWh/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 8) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        tr = $("<tr></tr>");
        td = $("<th>一系统</th><th>KWh/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 13) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        tr = $("<tr></tr>");
        td = $("<th>二系统</th><th>KWh/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 18) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        //蒸汽
        tr = $("<tr></tr>");
        td = $("<th rowspan='3'>2蒸汽</th><th>车间</th><th>Kg/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 23) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        tr = $("<tr></tr>");
        td = $("<th>一系统</th><th>Kg/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 24) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        tr = $("<tr></tr>");
        td = $("<th>二系统</th><th>Kg/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 33) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        //净化水
        tr = $("<tr></tr>");
        td = $("<th rowspan='3'>3.1净化水</th><th>车间</th><th>t/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 38) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        tr = $("<tr></tr>");
        td = $("<th>一系统</th><th>t/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 43) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        tr = $("<tr></tr>");
        td = $("<th>二系统</th><th>t/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 48) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        //循环水
        tr = $("<tr></tr>");
        td = $("<th rowspan='3'>3.2循环水</th><th>车间</th><th>t/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 53) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        tr = $("<tr></tr>");
        td = $("<th>一系统</th><th>t/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 58) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        tr = $("<tr></tr>");
        td = $("<th>二系统</th><th>t/t</th>");
        td.appendTo(tr);
        for (var j = 0; j < 5; j++) {
            td = $("<td id='tddata" + (j + 63) + "'></td>");
            td.appendTo(tr);
        }
        $("#table-electrolysis-report").append(tr);

        // 查询
        $('#query').click(function () {
            var date = $('#search-sdate').val();
            var year, month;
            var today_month = date.split('-')[1];
            var today_year = date.split('-')[0];

            $.ajax({
                url: '/api/ElectrolyticWorkshop/GetData',
                method: 'get',
                dataType: 'json',
                data: {
                    year: today_year,
                    month: today_month,
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

            //for (var i = 0; i < 67 ; i++) {
            //    if(i!=6)
            //    {
            //        $("td[id=\'tddata" + (i + 1) + "\']").replaceWith("<td id=\'tddata" + (i + 1) + "\'>" + i + "</td>");
            //    } else
            //    {
            //    $("th[id=\'tddata" + (i + 1) + "\']").replaceWith("<th id=\'tddata" + (i + 1) + "\' colspan='8' style='text-align:left'>能耗：" + i + "</th>")
            //    }

            //}
        });

        //加载时自动运行
        (function () {
            var date = $('#search-sdate').val();
            var year, month;
            var today_month = date.split('-')[1];
            var today_year = date.split('-')[0];

            $.ajax({
                url: '/api/ElectrolyticWorkshop/GetData',
                method: 'get',
                dataType: 'json',
                data: {
                    year: today_year,
                    month: today_month,
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

            //for (var i = 0; i < 67 ; i++) {
            //    if(i!=6)
            //    {
            //        $("td[id=\'tddata" + (i + 1) + "\']").replaceWith("<td id=\'tddata" + (i + 1) + "\'>" + i + "</td>");
            //    } else
            //    {
            //    $("th[id=\'tddata" + (i + 1) + "\']").replaceWith("<th id=\'tddata" + (i + 1) + "\' colspan='8' style='text-align:left'>能耗：" + i + "</th>")
            //    }

            //}
        }());
    },
};