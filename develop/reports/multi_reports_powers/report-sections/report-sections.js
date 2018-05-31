var Page = {
    excel_data: null, //存放数值数据

    init: function () {
        //空表格
        for (i = 0; i < 11; i++) {
            for (j = 0; j < 12; j++) {
                var td = $('<td></td>');
                td.attr('id', 're1' + i + '-' + j)
                td.html('');
                $('#re1 #tr' + i).append(td);
            }
        }

        var _startedYear = 2014;
        var L = parseInt(laydate.now(0, "YYYY")) + 2;
        for (i = _startedYear; i < L ; i++) {
            var opt = $('<option>');
            opt.val(i).html(i + '年');
            if (opt.val() == parseInt(laydate.now(0, "YYYY"))) {
                opt.attr('selected', 'selected')
            }
            $('#s1').append(opt);
        }

        //初始化时进行一次查询
        get_table_data();

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
            input1.attr("value", "电力统计表 各车间");//模板名称
            $("body").append(form);

            var input2 = $("<input>");
            input2.attr("type", "hidden");
            input2.attr("name", "body");
            input2.attr("value", Page.excel_data);//Excel数值数据
            $("body").append(form);

            //var input3 = $("<input>");
            //input3.attr("type", "hidden");
            //input3.attr("name", "titles");
            //input3.attr("value", changeable_ths);//可变表头数据
            //$("body").append(form);

            form.append(input1);
            form.append(input2);
            //form.append(input3);

            form.submit();
            form.remove();
        }

        // 统计报表
        $('#query').click(function () {
            get_table_data();
        });

        function get_table_data() {
            var year = $('#s1').val();

            Page.excel_data = null;

            $.ajax({
                url: '/api/AllFactoryElectricPower/GetData5',
                method: 'get',
                dataType: 'json',
                data: { year: year },
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
                            if (list[index] == null) {
                                $(this).html('');
                            }
                            else {
                                $(this).html(Math.round(list[index]));
                            }

                            index++;
                        })
                    }
                }
            });
        }
    }
}