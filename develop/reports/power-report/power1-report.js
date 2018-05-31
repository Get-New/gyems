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
            input1.attr("value", "1#总降压月电量统计报表模板New");//模板名称
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

        // 统计报表
        $('#query').click(function () {
            //查询条件
            var date = $('#search-sdate').val();
            var year, month;
            var today_month = date.split('-')[1];
            var today_year = date.split('-')[0];

            //前后台数据交互
            $.ajax({
                url: '/api/PowerRoomReport/GetDownOneMonth',
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
        });

        //加载时自运行
        (function () {
            //查询条件
            var date = $('#search-sdate').val();
            var year, month;
            var today_month = date.split('-')[1];
            var today_year = date.split('-')[0];

            //前后台数据交互
            $.ajax({
                url: '/api/PowerRoomReport/GetDownOneMonth',
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
        }());
    },
};