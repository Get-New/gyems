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

        var that = this;

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
            input1.attr("value", "电解车间电单耗模板");//模板名称
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

        $('#query').click(function () {
            that.get_report_data();
        });

        that.get_report_data();
    },

    //请求报表数据
    get_report_data: function () {
        var date = $('#search-sdate').val();
        var year = date.split('-')[0];
        var month = date.split('-')[1];

        $.ajax({
            url: '/api/ElectricityRoom/GetElectricityRoomCost',
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
                        $(this).html(list[index++]);
                    })
                }
            }
        });
    },
};