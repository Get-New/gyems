var mycht1 = echarts.init(document.getElementById('echt'));


function getdata(min, max) {
    return (min + (max - min) * Math.random()).toFixed(2);
}


$(function () {
    $('#goback').click(function () {
        window.history.go(-1);
    })
})


var option = {
    title: {
        text: '标题'
    },
    legend: {
        data: ['锅炉效率', '蒸汽温度', '蒸汽压力', '给水温度', '给水压力', '蒸汽总流量', '焦炉煤气总流量'],

    },
    tooltip: {
        trigger:'axis'
    },
    yAxis: {
        type: 'value',
        max: 1000,
        min: 500
    },
    xAxis: {
        type: 'category',
        data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12'],
        axisLabel: {
            rotate:-90
        }
    },
    series: [
        {
            type: 'line',
            name: '锅炉效率',
            smooth: true,
            //lineStyle: {
            //    normal: {
            //        color: 'blue'
            //    }
            //},
            //markLine: {
            //    //name:'标准运行区间',
            //    silent: true,
            //    data: [{
            //        yAxis: 540,
            //        label: {
            //            normal: {
            //                position: 'start',
            //                show: true
            //            }
            //        }

            //    }]
            //},
            data: [
                  getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
  
            ]
        },
        {
            type: 'line',
            name: '蒸汽温度',
            smooth: true,
            //lineStyle: {
            //    normal: {
            //        color: 'blue'
            //    }
            //},
            markLine: {
                //name:'标准运行区间',
                silent: true,
                data: [{
                    yAxis: 540,
                    label: {
                        normal: {
                            position: 'start',
                            show: true
                        }
                    }

                }]
            },
            data: [
                  getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),

            ]
        },
        {
            type: 'line',
            name: '蒸汽压力',
            smooth: true,
            //lineStyle: {
            //    normal: {
            //        color: 'blue'
            //    }
            //},
            markLine: {
                //name:'标准运行区间',
                silent: true,
                data: [{
                    yAxis: 540,
                    label: {
                        normal: {
                            position: 'start',
                            show: true
                        }
                    }

                }]
            },
            data: [
                  getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),

            ]
        },
        {
            type: 'line',
            name: '给水温度',
            smooth: true,
            //lineStyle: {
            //    normal: {
            //        color: 'blue'
            //    }
            //},
            markLine: {
                //name:'标准运行区间',
                silent: true,
                data: [{
                    yAxis: 540,
                    label: {
                        normal: {
                            position: 'start',
                            show: true
                        }
                    }

                }]
            },
            data: [
                  getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),

            ]
        },
        {
            type: 'line',
            name: '给水压力',
            smooth: true,
            //lineStyle: {
            //    normal: {
            //        color: 'blue'
            //    }
            //},
            markLine: {
                //name:'标准运行区间',
                silent: true,
                data: [{
                    yAxis: 540,
                    label: {
                        normal: {
                            position: 'start',
                            show: true
                        }
                    }

                }]
            },
            data: [
                  getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),

            ]
        },
        {
            type: 'line',
            name: '蒸汽总流量',
            smooth: true,
            //lineStyle: {
            //    normal: {
            //        color: 'blue'
            //    }
            //},
            markLine: {
                //name:'标准运行区间',
                silent: true,
                data: [{
                    yAxis: 540,
                    label: {
                        normal: {
                            position: 'start',
                            show: true
                        }
                    }

                }]
            },
            data: [
                  getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),

            ]
        },
        {
            type: 'line',
            name: '焦炉煤气总流量',
            smooth: true,
            //lineStyle: {
            //    normal: {
            //        color: 'blue'
            //    }
            //},
            markLine: {
                //name:'标准运行区间',
                silent: true,
                data: [{
                    yAxis: 540,
                    label: {
                        normal: {
                            position: 'start',
                            show: true
                        }
                    }

                }]
            },
            data: [
                  getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),
                getdata(500, 600),

            ]
        },

    ]

}















mycht1.setOption(option);


