$('#content1').attr('style', 'height:8rem')
/****************************************//*全局准备*//***************************/
$('#pie-fig-title1').attr('style', 'display:none');
$('#pie-fig-title2').attr('style', 'display:none');
var current_day_for_modelbaseid;

var tooltip_name;
//判断现在查询的是什么类型的变量
var bar_current_type = 'month';
var pie_current_type = 'month';


//echarts实例化全局变量
var chart_id1 = 'G-echarts11';
var myChart1 = echarts.init(document.getElementById(chart_id1));
var chart_id2 = 'G-echarts41';
var myChart2 = echarts.init(document.getElementById(chart_id2));
var chart_id3 = 'G-echarts413';
var myChart3 = echarts.init(document.getElementById(chart_id3));



var current_e1_name;

var Page = {
    //*******************************************************************************************

    //画柱状图（如果有折线图也一起画了）
    draw_bar_charts: function (legend_data, bar_axis_data, bar_data) {
        if (myChart1) { myChart1.clear() }
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },

            },
            toolbox: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: legend_data
            },
            xAxis: [{
                type: 'category',
                data: bar_axis_data,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0
                }
            }],
            yAxis: [{
                type: 'value'
            }],
            series: bar_data
        };
        myChart1.setOption(option);
    },

    //画饼图(两个兵)
    draw_pie_charts: function (legend_data, pie_data_2, pie_data_1) {
        var option2 = {
            legend: {
                data: legend_data,
                //orient: 'vertical',
                y: '90%'
            },
            tooltip: {

                trigger: 'item',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:'{b}:{c} <br/>占比例{d}%'
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    //magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            //visualMap: {
            //    show: true,
            //    min: 80,
            //    max: 600,
            //    inRange: {
            //        colorLightness: [0.5, 1]
            //    }
            //},
            series: [{
                center: ['30%', '50%'],
                name: '去年同期比较',
                type: 'pie',
                radius: '50%',
                //roseType: 'angle',
                silent: false,
                data: pie_data_2,
                label: {
                    normal: {
                        show: true
                    }
                },
                labelLine: { normal: { show: true } },
                itemStyle: {

                    //鼠标hover时的高亮模式
                    emphasis: {
                        shadowBlur: 250,
                        shadowColor: 'rgba(0,255,255,0.5)'
                    }
                },

            }, {
                center: ['70%', '50%'],
                name: '当月各厂数据',
                type: 'pie',
                radius: '50%',
                //roseType: 'angle',
                silent: false,
                data: pie_data_1,
                label: {
                    normal: {
                        show: true
                    }
                },
                labelLine: { normal: { show: true } },
                itemStyle: {

                    //鼠标hover时的高亮模式
                    emphasis: {
                        shadowBlur: 250,
                        shadowColor: 'rgba(0,255,255,0.5)'
                    }
                }
            }]
        }
        myChart2.setOption(option2);

    },


    draw_pie_charts2: function (legend_data, pie_data_2, pie_data_1) {
        var option2 = {
            legend: {
                data: legend_data,
                //orient: 'vertical',
                y: '90%'
            },
            tooltip: {
                trigger: 'item',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:'{b}:{c} <br/>占比例{d}%'

            },
            toolbox: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    //magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            //visualMap: {
            //    show: true,
            //    min: 80,
            //    max: 600,
            //    inRange: {
            //        colorLightness: [0.5, 1]
            //    }
            //},
            series: [{
                center: ['30%', '50%'],
                name: '去年同期比较',
                type: 'pie',
                radius: '50%',
                //roseType: 'angle',
                //silent: true,
                data: pie_data_2,
                label: {
                    normal: {
                        show: true
                    }
                },
                labelLine: { normal: { show: true } },
                itemStyle: {

                    //鼠标hover时的高亮模式
                    emphasis: {
                        shadowBlur: 250,
                        shadowColor: 'rgba(0,255,255,0.5)'
                    }
                },

            }, {
                center: ['70%', '50%'],
                name: '当月各厂数据',
                type: 'pie',
                radius: '50%',
                //roseType: 'angle',
                //silent: true,
                data: pie_data_1,
                label: {
                    normal: {
                        show: true
                    }
                },
                labelLine: { normal: { show: true } },
                itemStyle: {

                    //鼠标hover时的高亮模式
                    emphasis: {
                        shadowBlur: 250,
                        shadowColor: 'rgba(0,255,255,0.5)'
                    }
                }
            }]
        }
        myChart3.setOption(option2);

    },


    //********************************************新方法**************************************************

    //根据点击是否是去年而定
    find_it2: function (e, data) {
        var i = 0;
        if (data[0] && data[0].ModelBase_ID) {
            for (; i < data.length; i++) {
                //console.log(data[i].ModelBase_Name)
                if (e == data[i].ModelBase_Name)
                    break;
            }
            //console.log(data[i])

            return data[i].ModelBase_ID
        }
    },


    //得到条形图/折线图基础数据
    get_bar_data: function (item) {
        var temp = [];
        //console.log(item)
        if (item) {
            for (i = 0; i < item.length; i++) {
                if (item[i]) {
                    temp.push(item[i].Report_ComputeValue);
                }
            }
        }
        return temp;
    },

    //获得条形图axis数据
    get_bar_axis: function (item) {
        var temp = [];
        if (item) {
            for (i = 0; i < item.length; i++) {
                if (item[i].Report_DateDescription) {
                    temp.push(item[i].Report_DateDescription)
                }
            }
        }
        return temp;
    },

    //获得饼图series组
    get_pie_series: function (item) {
        var temp = [];
        if (item) {
            for (i = 0; i < item.length; i++) {
                if (item[i].ModelBase_Name) {
                    temp.push({ value: item[i].Report_ComputeValue, name: item[i].ModelBase_Name, label: { normal: { show: true, formatter: '{b}  {c}' } } })
                }
            }
        }
        return temp;
    },

    //获得饼图各车间名称
    get_pie_legend: function (item) {
        var temp = [];
        if (item) {
            for (i = 0; i < item.length; i++) {
                if (item[i].ModelBase_Name) {
                    temp.push(item[i].ModelBase_Name)
                }
            }
        }
        return temp;
    },



    //******************************************************************************************************
    init: function () {
        $('#pre').click(function () {
            $('#pie-fig-title1').html('');
            $('#pie-fig-title2').html('');
        })
        $('#next').click(function () {
            $('#pie-fig-title1').html('');
            $('#pie-fig-title2').html('');
        })


        var that = this;
        $('#year').click(function () {
            myChart2.clear();

            //query('year', year, month, strDate)
            $('#pie-fig-title1').attr('style', 'display:none');
            $('#pie-fig-title2').attr('style', 'display:none');
            $('.for-human-input').attr('style', 'display:block;bottom:0rem');
            $('#pie-fig-title2').html('当月各车间数据');
            pie_current_type = 'year';
            bar_current_type = 'year';
        })
        $('#month').click(function () {
            myChart2.clear();

            //query('year', year, month, strDate)
            $('#pie-fig-title1').attr('style', 'display:none');
            $('#pie-fig-title2').attr('style', 'display:none');
            $('.for-human-input').attr('style', 'display:block;bottom:0rem');
            $('#pie-fig-title2').html('当日各车间数据');
            pie_current_type = 'month';
        })
        $('#day').click(function () {
            myChart2.clear();

            //query('year', year, month, strDate)
            $('#pie-fig-title1').attr('style', 'display:none');
            $('#pie-fig-title2').attr('style', 'display:none');
            $('.for-human-input').attr('style', 'display:block;bottom:0rem')
            $('#pie-fig-title2').html('此时段各车间数据');
            pie_current_type = 'day';
        })

        function query(type, year, month, day) {
            $('#G-echarts11').attr('style', 'display:block');
            $('#G-echarts41').attr('style', 'display:none');
            $('#G-echarts413').attr('style', 'display:none');

            //console.log(type, year, month, day);
            $('#pie-fig-title1').html('');
            $('#pie-fig-title2').html('');
            if (type == 'day') {
                $.ajax({
                    url: '/api/AllFactoryReport/GetSelfEveryCycle',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        year: year,
                        month: month,
                        day: '',
                        energyname: '天然气',
                    },
                    success: function (data) {
                        $.ajax({
                            url: '/api/AllFactoryReport/GetSelfEveryCycle',
                            type: 'get',
                            dataType: 'json',
                            data: {
                                year: year - 1,
                                month: month,
                                day: '',
                                energyname: '天然气',
                            },
                            success: function (data2) {
                                bar_current_type = 'day';
                                tooltip_name = '当时'
                                //console.log(data, data2);
                                var bar_axis_data = [];             //条形图横坐标数据组
                                var bar_legend = [];                //条形图legend数据组
                                var bar_data = [];                  //bar数据组
                                //***********************************************
                                var item = data.Models;
                                var item2 = data2.Models;

                                //var item = DATA1.Models;
                                //var item2 = DATA2.Models;

                                var bar_base = that.get_bar_data(item);
                                bar_data.push({ name: tooltip_name, type: 'bar', data: bar_base, label: { normal: { show: true, position: 'top' } } });
                                var line_base = that.get_bar_data(item2);
                                bar_data.push({ name: '去年同期', type: 'line', data: line_base });
                                //已得到柱状图基础数据和折线图数据组
                                bar_axis_data = that.get_bar_axis(item);//得到了柱状图横坐标数据组


                                that.draw_bar_charts(tooltip_name, bar_axis_data, bar_data);

                            }
                        });
                    }
                })
            };

            if (type == 'month') {
                $.ajax({
                    url: '/api/AllFactoryReport/GetSelfEveryCycle',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        year: year,
                        month: '',
                        day: '',
                        energyname: '天然气',
                    },
                    success: function (data) {
                        $.ajax({
                            url: '/api/AllFactoryReport/GetSelfEveryCycle',
                            type: 'get',
                            dataType: 'json',
                            data: {
                                year: year - 1,
                                month: '',
                                day: '',
                                energyname: '天然气',
                            },
                            success: function (data2) {
                                bar_current_type = 'month';
                                tooltip_name = '当日'
                                //console.log(data, data2, data3);
                                var bar_axis_data = [];             //条形图横坐标数据组
                                var bar_legend = [];                //条形图legend数据组
                                var bar_data = [];                  //bar数据组
                                //***********************************************
                                var item = data.Models;
                                var item2 = data2.Models;

                                var bar_base = that.get_bar_data(item);
                                bar_data.push({ name: tooltip_name, type: 'bar', data: bar_base, label: { normal: { show: true, position: 'top' } } });
                                var line_base = that.get_bar_data(item2);
                                bar_data.push({ name: '去年同期', type: 'line', data: line_base });
                                //已得到柱状图基础数据和折线图数据组
                                bar_axis_data = that.get_bar_axis(item);//得到了柱状图横坐标数据组

                                that.draw_bar_charts(tooltip_name, bar_axis_data, bar_data);


                            }
                        });
                    }
                })
            };

            if (type == 'year') {
                $.ajax({
                    url: '/api/AllFactoryReport/GetSelfEveryCycle',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        year: '',
                        month: '',
                        day: '',
                        energyname: '天然气',
                    },
                    success: function (data) {
                        $.ajax({
                            url: '/api/AllFactoryReport/GetSelfEveryCycle',
                            type: 'get',
                            dataType: 'json',
                            data: {
                                year:  '',
                                month: '',
                                day: '',
                                energyname: '天然气',
                            },
                            success: function (data2) {
                                bar_current_type = 'month';
                                tooltip_name = '当月'
                                $('#G-echarts41').attr('style', 'display:none');
                                $('#G-echarts11').attr('style', 'display:block');

                                //console.log(data, data2, data3,data4);
                                var bar_axis_data = [];             //条形图横坐标数据组
                                var bar_legend = [];                //条形图legend数据组
                                var bar_data = [];                  //bar数据组
                                //***********************************************
                                var item = data.Models;
                                var item2 = data2.Models;

                                //var item = DATA1.Models;
                                //var item2 = DATA2.Models;

                                //***********************************************
                                var bar_base = that.get_bar_data(item);
                                bar_data.push({ name: tooltip_name, type: 'bar', data: bar_base, label: { normal: { show: true, position: 'top' } } });
                                var line_base = that.get_bar_data(item2);
                                bar_data.push({ name: '去年同期', type: 'line', data: line_base });
                                //已得到柱状图基础数据和折线图数据组
                                bar_axis_data = that.get_bar_axis(item);//得到了柱状图横坐标数据组

                                that.draw_bar_charts(tooltip_name, bar_axis_data, bar_data);

                            }
                        });
                    }
                })
            }
        }






        dst.change(function (t, y, m, d) {
            query(t, y, m, d);
        })
        dst.init();
    }
}





myChart1.on('click', function (e1) {
    //console.log($('#title').text().slice(8, 10))
    var dayday = e1.name.slice(3, 5);
    current_day_for_modelbaseid = dayday;


    //console.log(e1.name)
    if ($('#year').hasClass('active')) {
        //console.log(e1.name)
        $('#pie-fig-title1').html('去年同期比较');
        $('#pie-fig-title2').html('当月各车间数据');
        current_e1_name = e1.name;
        $.ajax({
            url: '/api/AllFactoryReport/GetChildEveryCycle',
            type: 'get',
            dataType: 'json',
            data: {
                year: e1.name-1,
                month: '',
                day: '',
                hour:'',
                energyname: '天然气',
            },
            success: function (cdata_l1) {
                $.ajax({
                    url: '/api/AllFactoryReport/GetChildEveryCycle',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        year: e1.name,
                        month: '',
                        day: '',
                        hour: '',
                        energyname: '天然气',
                    },
                    success: function (cdata_l2) {
                        var item_cl1 = cdata_l1.Models
                        var item_cl2 = cdata_l2.Models

                        //var item_cl1 = DATA4.Models
                        //var item_cl2 = DATA4.Models

                        //console.log(cdata_l1,cdata_l2)
                        $('#G-echarts11').attr('style', 'display:none');
                        $('#G-echarts41').attr('style', 'display:block');
                        $('#pie-fig-title1').attr('style', 'display:block;bottom:5rem;width:1.4rem');
                        $('#pie-fig-title2').attr('style', 'display:block;bottom:6rem;left:10.8rem;width:2rem');
                        $('.for-human-input').attr('style', 'display:block;bottom:2rem')
                        var formodelbasename = [];
                        var pie_data_1 = [];
                        var pie_data_2 = [];
                        pie_data_1 = Page.get_pie_series(item_cl2);
                        pie_data_2 = Page.get_pie_series(item_cl1);
                        formodelbasename = Page.get_pie_legend(item_cl2);
                        Page.draw_pie_charts(formodelbasename, pie_data_2, pie_data_1);
                        //console.log(item_cl1, formodelbasename, pie_data_1, pie_data_2)



                    }
                })
            }
        })
        //return
    };

    if ($('#month').hasClass('active')) {
        //console.log($('#title').text().slice(5,7))
        $('#pie-fig-title1').html('去年同期比较');
        $('#pie-fig-title2').html('当天各车间数据');
        current_e1_name = e1.name;

        $.ajax({
            url: '/api/AllFactoryReport/GetChildEveryCycle',
            type: 'get',
            dataType: 'json',
            data: {
                year: $('#title').text().slice(0, 4) - 1,
                month: e1.name,
                day: '',
                hour: '',
                energyname: '天然气',
            },
            success: function (cdata_l1) {
                $.ajax({
                    url: '/api/AllFactoryReport/GetChildEveryCycle',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        year: $('#title').text().slice(0, 4),
                        month: e1.name,
                        day: '',
                        hour: '',
                        energyname: '天然气',
                    },
                    success: function (cdata_l2) {
                        var item_cl1 = cdata_l1.Models
                        var item_cl2 = cdata_l2.Models
                        //console.log(cdata_l1,cdata_l2)
                        $('#G-echarts11').attr('style', 'display:none');
                        $('#G-echarts41').attr('style', 'display:block');
                        $('#pie-fig-title1').attr('style', 'display:block;bottom:5rem;width:1.4rem');
                        $('#pie-fig-title2').attr('style', 'display:block;bottom:6rem;left:10.8rem;width:2rem');
                        $('.for-human-input').attr('style', 'display:block;bottom:2rem')
                        var formodelbasename = [];
                        var pie_data_1 = [];
                        var pie_data_2 = [];
                        pie_data_1 = Page.get_pie_series(item_cl2);
                        pie_data_2 = Page.get_pie_series(item_cl1);
                        formodelbasename = Page.get_pie_legend(item_cl2);
                        Page.draw_pie_charts(formodelbasename, pie_data_2, pie_data_1);
                        //console.log(item_cl1, formodelbasename, pie_data_1, pie_data_2)



                    }
                })
            }
        })
        //return
    };

    if ($('#day').hasClass('active')) {
        $('#pie-fig-title1').html('去年同期比较');
        $('#pie-fig-title2').html('当时段各车间数据');
        current_e1_name = e1.name;

        $.ajax({
            url: '/api/AllFactoryReport/GetChildEveryCycle',
            type: 'get',
            dataType: 'json',
            data: {
                year: $('#title').text().slice(0, 4) - 1,
                month: $('#title').text().slice(5, 7),
                day: e1.name,
                hour: '',
                energyname: '天然气',
            },
            success: function (cdata_l1) {
                $.ajax({
                    url: '/api/AllFactoryReport/GetChildEveryCycle',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        year: $('#title').text().slice(0, 4),
                        month: $('#title').text().slice(5, 7),
                        day: e1.name,
                        hour: '',
                        energyname: '天然气',
                    },
                    success: function (cdata_l2) {
                        var item_cl1 = cdata_l1.Models
                        var item_cl2 = cdata_l2.Models

                        //var item_cl1 = DATA4.Models
                        //var item_cl2 = DATA4.Models

                        //console.log(cdata_l1,cdata_l2)
                        $('#G-echarts11').attr('style', 'display:none');
                        $('#G-echarts41').attr('style', 'display:block');
                        $('#pie-fig-title1').attr('style', 'display:block;bottom:5rem;width:1.4rem');
                        $('#pie-fig-title2').attr('style', 'display:block;bottom:6rem;left:10.8rem;width:2rem');
                        $('.for-human-input').attr('style', 'display:block;bottom:2rem')
                        var formodelbasename = [];
                        var pie_data_1 = [];
                        var pie_data_2 = [];
                        pie_data_1 = Page.get_pie_series(item_cl2);
                        pie_data_2 = Page.get_pie_series(item_cl1);
                        formodelbasename = Page.get_pie_legend(item_cl2);
                        Page.draw_pie_charts(formodelbasename, pie_data_2, pie_data_1);
                        //console.log(item_cl1, formodelbasename, pie_data_1, pie_data_2)



                    }
                })
            }
        })
        //return
    }











})



myChart2.on('click', function (e2) {
    $('#G-echarts413').attr('style', 'display:block');
    $('#G-echarts41').attr('style', 'display:none');

    //console.log($('#title').text().slice(5, 7))



    if ($('#year').hasClass('active')) {
        var string = e2.name;
        //console.log(e2)
        if (string.indexOf('工序') == -1) {
            $('#pie-fig-title2').html(e2.name + '当月各工序数据')
        }
        else { }

        if (e2.name == '损耗') {
            var t_pie_data = [];
            t_pie_data.push({ value: e2.value, name: e2.name })
            Page.draw_pie_charts(e2.name, t_pie_data, t_pie_data)
        }
        else {
            $.ajax({
                url: '/api/AllFactoryReport/GetChildEveryCycle',
                type: 'get',
                dataType: 'json',
                data: {
                    year: current_e1_name,
                    month: '',
                    day: '',
                    hour: '',
                    energyname: '天然气',
                },
                success: function (data) {
                    var item_cl2 = data.Models;
                    var id = Page.find_it2(e2.name, item_cl2);
                    //console.log(id)
                    $.ajax({
                        url: '/api/AllFactoryReport/GetSelfEveryCycle',
                        type: 'get',
                        dataType: 'json',
                        data: {
                            year: current_e1_name - 1,
                            month: '',
                            day: '',
                            //hour: '',
                            energyname: '天然气',
                            modelbaseid: id,
                        },
                        success: function (data_l1) {
                            $.ajax({
                                url: '/api/AllFactoryReport/GetSelfEveryCycle',
                                type: 'get',
                                dataType: 'json',
                                data: {
                                    year: current_e1_name,
                                    month: '',
                                    day: '',
                                    //hour: '',
                                    energyname: '天然气',
                                    modelbaseid: id,
                                },
                                success: function (data_l2) {
                                    var item_l1 = data_l1.Models
                                    var item_l2 = data_l2.Models

                                    //var item_l1 = DATA31.Models
                                    //var item_l2 = DATA31.Models

                                    var formodelbasename = [];
                                    var pie_data_1 = [];
                                    var pie_data_2 = [];
                                    pie_data_1 = Page.get_pie_series(item_l2);
                                    pie_data_2 = Page.get_pie_series(item_l1);
                                    formodelbasename = Page.get_pie_legend(item_l2);
                                    Page.draw_pie_charts2(formodelbasename, pie_data_2, pie_data_1)
                                    //console.log(formodelbasename, pie_data_1, pie_data_2)
                                }
                            })
                        }
                    })
                }
            })
        }
    }

    if ($('#month').hasClass('active')) {
        var string = e2.name;
        //console.log(e2)
        if (string.indexOf('工序') == -1) {
            $('#pie-fig-title2').html(e2.name + '当月各工序数据')
        }
        else { }

        if (e2.name == '损耗') {
            var t_pie_data = [];
            t_pie_data.push({ value: e2.value, name: e2.name })
            Page.draw_pie_charts(e2.name, t_pie_data, t_pie_data)
        }
        else {
            //console.log(current_e1_name)
            $.ajax({
                url: '/api/AllFactoryReport/GetChildEveryCycle',
                type: 'get',
                dataType: 'json',
                data: {
                    year: $('#title').text().slice(0, 4),
                    month: current_e1_name,
                    day: '',
                    hour: '',
                    energyname: '天然气',
                },
                success: function (data) {
                    var item_cl2 = data.Models;
                    var id = Page.find_it2(e2.name, item_cl2);
                    //console.log(id)
                    $.ajax({
                        url: '/api/AllFactoryReport/GetSelfEveryCycle',
                        type: 'get',
                        dataType: 'json',
                        data: {
                            year: $('#title').text().slice(0, 4) - 1,
                            month: current_e1_name,
                            day: '',
                            //hour: '',
                            energyname: '天然气',
                            modelbaseid: id,
                        },
                        success: function (data_l1) {
                            $.ajax({
                                url: '/api/AllFactoryReport/GetSelfEveryCycle',
                                type: 'get',
                                dataType: 'json',
                                data: {
                                    year: $('#title').text().slice(0, 4),
                                    month: current_e1_name,
                                    day: '',
                                    //hour: '',
                                    energyname: '天然气',
                                    modelbaseid: id,
                                },
                                success: function (data_l2) {
                                    var item_l1 = data_l1.Models
                                    var item_l2 = data_l2.Models

                                    //var item_l1 = DATA31.Models
                                    //var item_l2 = DATA31.Models

                                    var formodelbasename = [];
                                    var pie_data_1 = [];
                                    var pie_data_2 = [];
                                    pie_data_1 = Page.get_pie_series(item_l2);
                                    pie_data_2 = Page.get_pie_series(item_l1);
                                    formodelbasename = Page.get_pie_legend(item_l2);
                                    Page.draw_pie_charts2(formodelbasename, pie_data_2, pie_data_1)
                                    //console.log(formodelbasename, pie_data_1, pie_data_2)
                                }
                            })
                        }
                    })
                }
            })
        }
    }



    if ($('#day').hasClass('active')) {
        var string = e2.name;
        //console.log(e2)
        if (string.indexOf('工序') == -1) {
            $('#pie-fig-title2').html(e2.name + '当月各工序数据')
        }
        else { }

        if (e2.name == '损耗') {
            var t_pie_data = [];
            t_pie_data.push({ value: e2.value, name: e2.name })
            Page.draw_pie_charts(e2.name, t_pie_data, t_pie_data)
        }
        else {
            $.ajax({
                url: '/api/AllFactoryReport/GetChildEveryCycle',
                type: 'get',
                dataType: 'json',
                data: {
                    year: $('#title').text().slice(0, 4),
                    month: $('#title').text().slice(5, 7),
                    day: current_e1_name,
                    hour: '',
                    energyname: '天然气',
                },
                success: function (data) {
                    var item_cl2 = data.Models;
                    var id = Page.find_it2(e2.name, item_cl2);
                    //console.log(id)
                    $.ajax({
                        url: '/api/AllFactoryReport/GetSelfEveryCycle',
                        type: 'get',
                        dataType: 'json',
                        data: {
                            year: $('#title').text().slice(0, 4) - 1,
                            month: $('#title').text().slice(5, 7),
                            day: current_e1_name,
                            //hour: '',
                            energyname: '天然气',
                            modelbaseid: id,
                        },
                        success: function (data_l1) {
                            $.ajax({
                                url: '/api/AllFactoryReport/GetSelfEveryCycle',
                                type: 'get',
                                dataType: 'json',
                                data: {
                                    year: $('#title').text().slice(0, 4),
                                    month: $('#title').text().slice(5, 7),
                                    day: current_e1_name,
                                    //hour: '',
                                    energyname: '天然气',
                                    modelbaseid: id,
                                },
                                success: function (data_l2) {
                                    var item_l1 = data_l1.Models
                                    var item_l2 = data_l2.Models

                                    //var item_l1 = DATA31.Models
                                    //var item_l2 = DATA31.Models

                                    var formodelbasename = [];
                                    var pie_data_1 = [];
                                    var pie_data_2 = [];
                                    pie_data_1 = Page.get_pie_series(item_l2);
                                    pie_data_2 = Page.get_pie_series(item_l1);
                                    formodelbasename = Page.get_pie_legend(item_l2);
                                    Page.draw_pie_charts2(formodelbasename, pie_data_2, pie_data_1)
                                    //console.log(formodelbasename, pie_data_1, pie_data_2)
                                }
                            })
                        }
                    })
                }
            })
        }
    }











})