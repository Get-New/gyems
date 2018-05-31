﻿var Page = {
    excel_data: null, //存放数值数据

    init: function () {
        laydate({
            elem: '#search-sdate',
            event: 'click',
            istime: false,
            format: 'YYYY-MM',
            ismonth: true
        });
        $('#search-sdate').val(laydate.now(-31, "YYYY-MM"));

        //初始化时进行一次查询
        get_table_data();

        //导出Excel
        $('#export').click(function () {
            get_excel();
        });

        function get_excel() {
            //获取可变标头数据
            var changeable_ths = [];
            for (var i = 0; i < $('.changeable_th').length; i++) {
                changeable_ths[i] = $('.changeable_th')[i].innerHTML;
            }
            changeable_ths = changeable_ths.join(","); //转换为","分隔字符串

            var form = $("<form>");
            form.attr("style", "display:none");
            form.attr("target", "_blank");
            form.attr("method", "post");
            form.attr("action", '/api/ExcelOut/GetTempletExcel');

            var input1 = $("<input>");
            input1.attr("type", "hidden");
            input1.attr("name", "filename");
            input1.attr("value", "动力车间内部用电统计表模板");//模板名称
            $("body").append(form);

            var input2 = $("<input>");
            input2.attr("type", "hidden");
            input2.attr("name", "body");
            input2.attr("value", Page.excel_data);//Excel数值数据
            $("body").append(form);

            var input3 = $("<input>");
            input3.attr("type", "hidden");
            input3.attr("name", "titles");
            input3.attr("value", changeable_ths);//可变表头数据
            $("body").append(form);

            form.append(input1);
            form.append(input2);
            form.append(input3);

            form.submit();
            form.remove();
        }

        // 统计报表
        $('#query').click(function () {
            get_table_data();
        });

        //获取数据
        function get_table_data() {
            $("td").html('');

            //Util.alert("动力车间内部用电统计API未绑定"); //备注提示

            //查询条件
            var date = $('#search-sdate').val();
            var year, month;
            var today_year = Number(date.split('-')[0]);
            var today_month = Number(date.split('-')[1]);

            //给table中的可变<th>赋值
            //date_title
            $('#date_title').html(today_year + "年动力车间" + today_month + "月份" + "内部用电统计表");

            //前后台数据交互
            Page.excel_data = null;
            $.ajax({
                url: '/api/PowerRoomReport/GetPowerEMonthObject',
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
                        Page.excel_data = data.Models; //导出Excel所需数据

                        var list = data.Models;
                        var index = 0;

                        $("td").each(function () {
                            $(this).html(parseInt(list[index++]));
                        })
                    }
                }
            });
        }
    },
};