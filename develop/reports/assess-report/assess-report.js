
var Page = {
   
    init: function () {

        //初始化报表
        var tr = $("<tr></tr>");
        var td = $("<td colspan='2'>一工段</td><td>一系列总</td><td id='tddata1'></td>");
        td.appendTo(tr);
        $("#table-assess-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>二工段</td><td>一系列总</td><td id='tddata2'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>三工段</td><td>一系列总</td><td id='tddata3'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>四工段</td><td>一系统净液总</td><td id='tddata4'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>六工段</td><td>二系列总</td><td id='tddata5'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>七工段</td><td>二系列总</td><td id='tddata6'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>八工段</td><td>三系列总</td><td id='tddata7'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>九工段</td><td>三系列总</td><td id='tddata8'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>十工段</td><td>二系统净液总</td><td id='tddata9'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>一设备</td><td>一系统总</td><td id='tddata10'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>二设备</td><td>二系统总</td><td id='tddata11'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>技术组</td><td>车间总</td><td id='tddata12'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);

        tr = $("<tr></tr>");
        td = $("<td colspan='2'>管理组</td><td>车间总</td><td id='tddata13'></td>");
        td.appendTo(tr);
        $("#table-electrolysis-report #tr1").before(tr);


        // 统计报表
        $('#query').click(function () {
            //$.ajax({
            //    url: '/api/DeviceMonitor/GetRecord1',
            //    method: 'get',
            //    dataType: 'json',
            //    success: function (data) {
            //        var list = data;
            //        var index = 0;
            //        for (var i = 0; i < list.length ; i++) {
            //            $("td[id=\'tddata" + (i + 1) + "\']").replaceWith("<td id=\'tddata" + (i + 1) + ">" + list[i] + "</td>");
            //        }
            //    }
            //});

            for (var i = 0; i < 16 ; i++) {
               $("td[id=\'tddata" + (i + 1) + "\']").replaceWith("<td id=\'tddata" + (i + 1) + "\'>" + i + "</td>");
            }
        });
    },
};