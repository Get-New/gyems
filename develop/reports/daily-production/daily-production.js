var Page = {
    init: function () {
        laydate({
            elem: '#search-sdate',
            event: 'click',
            istime: false,
            format: 'YYYY-MM-DD',
            istoday: true
        });
        $('#search-sdate').val(laydate.now(-1, "YYYY-MM-DD"));
        laydate({
            elem: '#search-sdate-start',
            event: 'click',
            istime: false,
            format: 'YYYY-MM-DD',
            istoday: true
        });
        $('#search-sdate-start').val(laydate.now(-1, "YYYY-MM-DD"));
        laydate({
            elem: '#search-sdate-end',
            event: 'click',
            istime: false,
            format: 'YYYY-MM-DD',
            istoday: true
        });
        $('#search-sdate-end').val(laydate.now(-1, "YYYY-MM-DD"));

        //初始化时进行一次查询
        get_table_data();

        // 统计报表
        $('#query').click(function () {
            $('#search-sdate-start').val($('#search-sdate').val());
            $('#search-sdate-end').val($('#search-sdate').val());
            get_table_data();
        });

        //导出Excel
        $('#export').click(function () {
            get_excel();
        });

        //获取报表数据
        function get_table_data() {
            $("td").html('');

            //Util.alert("天然气结算API未绑定"); //备注提示

            //查询条件
            var date = $('#search-sdate').val();
            var today_year = Number(date.split('-')[0]);
            var today_month = Number(date.split('-')[1]);
            var today_day = Number(date.split('-')[2]);

            //给table中的可变<th>赋值
            //date_title
            $('#date_title').html(today_year + "年" + today_month + "月" + today_day + "日");

            //前后台数据交互
            $.ajax({
                url: '/api/DailyProduction/GetPage',
                method: 'get',
                dataType: 'json',
                data: {
                    Cycle: 'day',
                    QDate: date
                },
                success: function (data) {
                    if (!data.Models || !data.Models.length) {
                        return;
                    }
                    else {
                        var list = data.Models;
                        var index = 0;

                        $("td").each(function () {
                            $(this).html(list[index++]);
                        })
                    }
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    alert('出现错误 错误信息为：' + errorThrown)
                }
            });
        }

        //导出Excel
        function get_excel() {
            var excel_data = get_excel_data();
            if (!excel_data) {
                Util.alert('数据查询失败，无法导出Excel');
                return false;
            }
            var filename = "生产日报导出数据";

            var form = $("<form>");
            form.attr("style", "display:none");
            form.attr("target", "_blank");
            form.attr("method", "post");
            form.attr("action", '/api/ExcelOut/GetExcel');
            $("body").append(form);

            var input1 = $("<input>");
            input1.attr("type", "hidden");
            input1.attr("name", "filename");
            input1.attr("value", filename);//命名Excel

            var input2 = $("<input>");
            input2.attr("type", "hidden");
            input2.attr("name", "datatype");
            input2.attr("value", "data");//传参类型

            var input3 = $("<input>");
            input3.attr("type", "hidden");
            input3.attr("name", "body");
            input3.attr("value", excel_data);//Excel数据

            form.append(input1);
            form.append(input2);
            form.append(input3);

            form.submit();
            form.remove();
        }

        //获取Excel数据
        function get_excel_data() {
            var temp_excel_data = '';
            var date_start = $('#search-sdate-start').val();
            var date_end = $('#search-sdate-end').val();

            $.ajax({
                url: '/api/DailyProduction/GetExcelData',
                method: 'get',
                dataType: 'json',
                data: {
                    DateStart: date_start,
                    DateEnd: date_end
                },
                async: false,
                success: function (data) {
                    if (!data.Models || !data.Models.length) {
                        return;
                    }
                    else {
                        temp_excel_data = data.Models[0];
                    }
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    alert('出现错误 错误信息为：' + errorThrown)
                }
            });
            return temp_excel_data;
        }
    },
};