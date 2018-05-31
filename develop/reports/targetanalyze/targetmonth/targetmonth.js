var mycht1 = echarts.init(document.getElementById('echt'));

function getdata(min, max) {
    return min + (max - min) * Math.random();
}

$(function () {
    $('#goback').click(function () {
        window.history.go(-1);
    })
})

//console.log(getdata(500, 600))


var option = {
    title: {
        text:''
    },
    legend: {
        //data:['趋势图']
        },
    tooltip: {

    },
    yAxis: {
        type: 'value',
        max: 900,
        min:200
    },
    xAxis: {
        type: 'category',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    series: [
        {
            type: 'line',
            name: '趋势图',
            smooth: true,
            lineStyle:{
                normal: {
                    color:'blue'
                }
            },
            markLine: {
                //name:'标准运行区间',
                silent: true,
                data: [{
                    yAxis: 540,
                    label: {
                        normal: {
                            position: 'start',
                            show:true
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
        }
    ]

};


mycht1.setOption(option);
















