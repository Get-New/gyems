/* 能源流向图模块*/''

define(function (require) {
    var $ = require('jquery');
    var dao = require('dao');

    var EnergyMediumID = "1d22868d659ed3bA27bc86aa";
    var EnergyType = "gas";		//介质类型 ele:电 gas:天然气
    var ModelBaseIDArray = [''];	//流向图层级记录
    var levelChange = false;		//流向图等级改变
    var subColor = ["#81bab8", "#FFA54F", "#FF4040"];	//误差颜色数组 <1% 1%~5% >5%

    var ret = {
        //itemClickHandler: null,			//流量下拉菜单点击事件
        boxRClickHandler: null			//流向图box元素右键点击事件
    };

    var energytypeClickable = false; //介质类别是否可点击（点击事件是否触发）

    //获取查询条件
    function getCondition() {
        return {
            ConfigID: $('.energy-button').filter(".click").attr('configid'),
            SubConfigID: ModelBaseIDArray[ModelBaseIDArray.length - 1]
        }
    }

    //根据级别调整左侧图标
    function drawLeftIcon(data) {
        //if (!levelChange) return;

        var fontSize = window.top.document.documentElement.clientWidth / 19.19759;
        fontSize = fontSize < 60 ? 60 : fontSize;

        if (!data[0].WithLevelOne) {
            $(".middle-panel-bottom .left-content #icon").hide();
            $(".middle-panel-bottom .left-content .arrow1").hide();
            $(".middle-panel-bottom .left-content .sub-buy").hide();
            $(".middle-panel-bottom .left-content .total-text").hide();
            $(".middle-panel-bottom .left-content .total-buy").hide();
            $(".middle-panel-bottom .left-content .box").show();
            $(".middle-panel-bottom .left-content .arrow2").show();
            $(".middle-panel-bottom .left-content .sub-user").show();
            if (ModelBaseIDArray.length > 1) {
                $("#goback").show();
            }
            else {
                $("#goback").hide();
            }

            $(".middle-panel-bottom .left-content .box").css({ "left": 1.45 * fontSize + "px" });
            $(".middle-panel-bottom .left-content .arrow2").css({ "left": 3 * fontSize + "px", "width": 2.15 * fontSize + "px" });
            $(".middle-panel-bottom .left-content .sub-user").css({ "left": 1.6 * fontSize + "px" });
        }

        else {
            $(".middle-panel-bottom .left-content #icon").show();
            $(".middle-panel-bottom .left-content .arrow1").show();
            $(".middle-panel-bottom .left-content .sub-buy").show();
            $(".middle-panel-bottom .left-content .total-text").show();
            $(".middle-panel-bottom .left-content .total-buy").show();
            $("#goback").hide();
            $(".middle-panel-bottom .left-content .box").removeAttr("style");
            $(".middle-panel-bottom .left-content .arrow2").removeAttr("style");
            $(".middle-panel-bottom .left-content .sub-user").removeAttr("style");
            $(".middle-panel-bottom .left-content .box").show();
            $(".middle-panel-bottom .left-content .arrow2").show();
            $(".middle-panel-bottom .left-content .sub-user").show();
        }
    }

    //根据介质变化调整显示信息
    function energyChange() {
        if (EnergyType == "ele") {
            $(".middle-panel-bottom .left-content li").eq(0).children(".item-text").html("功率&nbsp");
            $(".middle-panel-bottom .left-content li").eq(0).children(".item-value").removeClass("flow").addClass("power");
            var li = $("<li class='hide'><span class='item-text'>功率因数&nbsp</span><span class='item-value factor'>--</span></li>");
            $(".middle-panel-bottom .left-content .data-list").append(li);
        }

        if (EnergyType == "gas") {
            $(".middle-panel-bottom .left-content li").eq(0).children(".item-text").html("流量&nbsp");
            $(".middle-panel-bottom .left-content li").eq(0).children(".item-value").removeClass("power").addClass("flow");
            $(".middle-panel-bottom .left-content li").last().remove();
        }
    }

    //介质切换清除左侧数据
    function clearLeftData() {
        $(".middle-panel-bottom .left-content .box-head span").html("");
        $(".middle-panel-bottom .left-content .sub-buy .sub-value").html("--");
        $(".middle-panel-bottom .left-content .sub-buy .sub-text").css({ "background-color": subColor[0] });
        $(".middle-panel-bottom .left-content .total-buy").html("")
        $(".middle-panel-bottom .left-content .sub-user .sub-value").html("--");
        $(".middle-panel-bottom .left-content .sub-user .sub-text").css({ "background-color": subColor[0] });
        $(".middle-panel-bottom .left-content .day").html("--");
        $(".middle-panel-bottom .left-content .month").html("--");
        $(".middle-panel-bottom .left-content .year").html("--");
        $(".middle-panel-bottom .left-content .power").html("--");  //功率
        $(".middle-panel-bottom .left-content .flow").html("--");  //功率
        $(".middle-panel-bottom .left-content .factor").html("--");  //功率因数
    }

    //加载左侧流向图数据
    function loadLeftData(data) {
        if (!data || data.length < 2) return;

        $(".middle-panel-bottom .left-content .box-head span").html(data[1].ModelBaseName);
        $(".middle-panel-bottom .left-content .box").attr("id", data[1].ModelBaseID);

        if (EnergyType == "gas") {
            if (data[0].WithLevelOne) {
                $(".middle-panel-bottom .left-content .sub-buy .sub-value").html(data[0].DifferFlowData != null ? data[0].DifferFlowData : "--");
                $(".middle-panel-bottom .left-content .sub-buy .sub-text").css({ "background-color": subColor[data[0].DifferLevel] });
                $(".middle-panel-bottom .left-content .total-buy").html(data[0].CurrentFlowData != null ? data[0].CurrentFlowData : "--");
            }
            $(".middle-panel-bottom .left-content .sub-user .sub-value").html(data[1].DifferFlowData != null ? data[1].DifferFlowData : "--");
            $(".middle-panel-bottom .left-content .sub-user .sub-text").css({ "background-color": subColor[data[1].DifferLevel] });
            $(".middle-panel-bottom .left-content .day").html(data[1].SumDayData != null ? data[1].SumDayData : "--");
            $(".middle-panel-bottom .left-content .month").html(data[1].SumMonthData != null ? data[1].SumMonthData : "--");
            $(".middle-panel-bottom .left-content .year").html(data[1].SumYearData != null ? data[1].SumYearData : "--");
            $(".middle-panel-bottom .left-content .flow").html(data[1].CurrentFlowData != null ? data[1].CurrentFlowData : "--");
        }
        else {
            if (data[0].WithLevelOne) {
                $(".middle-panel-bottom .left-content .sub-buy .sub-value").html(data[0].DifferPData != null ? data[0].DifferPData : "--");
                $(".middle-panel-bottom .left-content .sub-buy .sub-text").css({ "background-color": subColor[data[0].DifferLevel] });
                $(".middle-panel-bottom .left-content .total-buy").html(data[0].CurrentPData != null ? data[0].CurrentPData : "--");
            }
            $(".middle-panel-bottom .left-content .sub-user .sub-value").html(data[1].DifferPData != null ? data[1].DifferPData : "--");
            $(".middle-panel-bottom .left-content .sub-user .sub-text").css({ "background-color": subColor[data[1].DifferLevel] });
            $(".middle-panel-bottom .left-content .day").html(data[1].SumDayData != null ? data[1].SumDayData : "--");
            $(".middle-panel-bottom .left-content .month").html(data[1].SumMonthData != null ? data[1].SumMonthData : "--");
            $(".middle-panel-bottom .left-content .year").html(data[1].SumYearData != null ? data[1].SumYearData : "--");
            $(".middle-panel-bottom .left-content .power").html(data[1].CurrentPData != null ? data[1].CurrentPData : "--");  //功率
            $(".middle-panel-bottom .left-content .factor").html(data[1].CurrentCOSData != null ? data[1].CurrentCOSData : "--");  //功率因数
        }
    }

    //加载右侧流向图数据
    function loadData(data) {
        //loadLeftData(data);

        if (!data || !data[0] || data[0].length < 1) {
            energytypeClickable = true; //如果返回数据为空 亦可点击
            return;
        }

        for (var i = 0; i < data[0].DataIn.length; i++) {
            var item = data[0].DataIn[i];
            $("#" + item.SubConfigID + " .flow").html(item.CurrentIn != null ? item.CurrentIn : "--");
            $("#" + item.SubConfigID + " .day").html(item.DayIn != null ? item.DayIn : "--");
            $("#" + item.SubConfigID + " .month").html(item.MonthIn != null ? item.MonthIn : "--");
            $("#" + item.SubConfigID + " .year").html(item.YearIn != null ? item.YearIn : "--");
        }

        for (var i = 0; i < data[0].DataOut.length; i++) {
            var item = data[0].DataOut[i];
            $("#" + item.SubConfigID + " .flow").html(item.CurrentOut != null ? item.CurrentOut : "--");
            $("#" + item.SubConfigID + " .day").html(item.DayOut != null ? item.DayOut : "--");
            $("#" + item.SubConfigID + " .month").html(item.MonthOut != null ? item.MonthOut : "--");
            $("#" + item.SubConfigID + " .year").html(item.YearOut != null ? item.YearOut : "--");
        }

        $(".total-in .flow").html(data[0].SumDataIn[0].SumCurrentIn != null ? data[0].SumDataIn[0].SumCurrentIn : "--");
        $(".total-in .day").html(data[0].SumDataIn[0].SumDayIn != null ? data[0].SumDataIn[0].SumDayIn : "--");
        $(".total-in .month").html(data[0].SumDataIn[0].SumMonthIn != null ? data[0].SumDataIn[0].SumMonthIn : "--");
        $(".total-in .year").html(data[0].SumDataIn[0].SumYearIn != null ? data[0].SumDataIn[0].SumYearIn : "--");

        $(".total-out .flow").html(data[0].SumDataOut[0].SumCurrentOut != null ? data[0].SumDataOut[0].SumCurrentOut : "--");
        $(".total-out .day").html(data[0].SumDataOut[0].SumDayOut != null ? data[0].SumDataOut[0].SumDayOut : "--");
        $(".total-out .month").html(data[0].SumDataOut[0].SumMonthOut != null ? data[0].SumDataOut[0].SumMonthOut : "--");
        $(".total-out .year").html(data[0].SumDataOut[0].SumYearOut != null ? data[0].SumDataOut[0].SumYearOut : "--");

        $(".total-sub .flow").html(data[0].DifferData[0].DifferCurrent != null ? data[0].DifferData[0].DifferCurrent : "--");
        $(".total-sub .day").html(data[0].DifferData[0].DifferDay != null ? data[0].DifferData[0].DifferDay : "--");
        $(".total-sub .month").html(data[0].DifferData[0].DifferMonth != null ? data[0].DifferData[0].DifferMonth : "--");
        $(".total-sub .year").html(data[0].DifferData[0].DifferYear != null ? data[0].DifferData[0].DifferYear : "--");
        $(".total-sub .box-head").css({ "background-color": subColor[data[0].DifferData[0].DifferLevel] });

        energytypeClickable = true; //数据加载完成之后 方可点击
    }

    //绘制右侧流向图
    function drawFactoryList(data) {
        $(".factoy-list-out li").remove();
        $(".factoy-list-in li").remove();
        $(".vertical").remove();

        if (!data[0] || data[0].length < 1) return;

        //右侧元素
        for (var i = 0; i < data[0].StructOut.length; i++) {
            var item = data[0].StructOut[i];
            var li = $("<li id='factory-item'></li>");
            var arrow = $("<div class='arrow'></div>");
            var box = $("<div class='box'></div>");
            box.attr("id", item.SubConfigID);
            box.attr("child", item.NextCount);
            box.attr("modelbase", item.CurrentModelBaseID);
            var box_head = $("<div class='box-head'><img id='box-img' src='/images2/factory_icon.png' /><span>" + item.SubConfigName + "</span></div>");
            var data_list = $("<ul class='data-list'><li><span class='item-text'>实时&nbsp</span><span class='item-value flow'>--</span></li><li class='hide'><span class='item-text'>日累&nbsp</span><span class='item-value day'>--</span></li><li class='hide'><span class='item-text'>月累&nbsp</span><span class='item-value month'>--</span></li><li class='hide'><span class='item-text'>年累&nbsp</span><span class='item-value year'>--</span></li></ul>");
            box.append(box_head);
            box.append(data_list);
            li.append(arrow);
            li.append(box);

            $(".factoy-list-out").append(li);
        }

        //左侧元素
        for (var i = 0; i < data[0].StructIn.length; i++) {
            var item = data[0].StructIn[i];
            var li = $("<li id='factory-item'></li>");
            var arrow = $("<div class='arrow'></div>");
            var box = $("<div class='box'></div>");
            box.attr("id", item.SubConfigID);
            box.attr("child", item.NextCount);
            box.attr("modelbase", item.CurrentModelBaseID);
            var box_head = $("<div class='box-head'><img id='box-img' src='/images2/factory_icon.png' /><span>" + item.SubConfigName + "</span></div>");
            var data_list = $("<ul class='data-list'><li><span class='item-text'>实时&nbsp</span><span class='item-value flow'>--</span></li><li class='hide'><span class='item-text'>日累&nbsp</span><span class='item-value day'>--</span></li><li class='hide'><span class='item-text'>月累&nbsp</span><span class='item-value month'>--</span></li><li class='hide'><span class='item-text'>年累&nbsp</span><span class='item-value year'>--</span></li></ul>");
            box.append(box_head);
            box.append(data_list);
            li.append(arrow);
            li.append(box);

            $(".factoy-list-in").append(li);
        }

        location(data);
        drawVerticalLine(data);
        addEventHandler();

        dao.queryGraphData(getCondition(), loadData);
    }

    //加载流向图类型
    function drawEleList(data) {
        $(".middle-panel-bottom .left-title li").remove();

        if (!data || data.length < 1) return;

        for (var i = 0; i <= data.length - 1; i++) {
            var item = data[i];
            if (i == 0) {
                var li = $("<li class='energy-button click' configid='" + item.ConfigID + "'>" + item.ConfigReportName + "</li>");
            }
            else {
                var li = $("<li class='energy-button' configid='" + item.ConfigID + "'>" + item.ConfigReportName + "</li>");
            }

            $(".middle-panel-bottom .left-title").append(li);
        }

        dao.queryGraphStruct(getCondition(), drawFactoryList);
    }

    //右侧流向图重定位
    function location(data) {
        var fontSize = window.top.document.documentElement.clientWidth / 19.19759;
        fontSize = fontSize < 60 ? 60 : fontSize;

        var countOut = data[0].StructOut.length;
        var countIn = data[0].StructIn.length;
        var panelHeight = $(".right-content").height();
        var offsetTopOut = (panelHeight - countOut * 0.7 * fontSize) > 0 ? (panelHeight - countOut * 0.7 * fontSize) / 2 : 0;
        var offsetTopIn = (panelHeight - countIn * 0.7 * fontSize) > 0 ? (panelHeight - countIn * 0.7 * fontSize) / 2 : 0;

        $(".factoy-list-out").css({ "top": offsetTopOut + "px" });
        $(".factoy-list-in").css({ "top": offsetTopIn + "px" });
    }

    //绘制右侧流向图竖线
    function drawVerticalLine(data) {
        var fontSize = window.top.document.documentElement.clientWidth / 19.19759;
        fontSize = fontSize < 60 ? 60 : fontSize;

        var countOut = data[0].StructOut.length;
        var countIn = data[0].StructIn.length;

        var topOut = parseFloat($(".factoy-list-out").css("top")) + 0.4 * fontSize;
        var topIn = parseFloat($(".factoy-list-in").css("top")) + 0.4 * fontSize;
        var heightOut = 0.7 * (countOut - 1) * fontSize;
        var heightIn = 0.7 * (countIn - 1) * fontSize;

        var verticalLineOut = $("<div class='vertical'></div>");
        var verticalLineIn = $("<div class='vertical'></div>");
        verticalLineOut.css({ "top": topOut + "px", "height": heightOut + "px" });
        verticalLineIn.css({ "top": topIn + "px", "height": heightIn + "px" });

        $(".left-content").prepend(verticalLineIn);
        $(".right-content").prepend(verticalLineOut);
    }

    //返回按钮显示
    function showBack() {
        if (ModelBaseIDArray.length > 1) {
            $("#goback").show();
        }
        else {
            $("#goback").hide();
        }
    }

    //添加事件
    function addEventHandler() {
        var fontSize = window.top.document.documentElement.clientWidth / 19.19759;
        fontSize = fontSize < 60 ? 60 : fontSize;

        //鼠标移入事件
        $(".data-list li").mouseover(function () {
            $(this).parent().children().each(function () {
                var li = $(this);
                if (li.hasClass("hide")) {
                    li.removeClass("hide");
                }
            })
            $(this).addClass("color");
            $(this).parent().parent().addClass("cover");
            if (EnergyType == "gas") {
                $(this).parent().parent().height(1.51 * fontSize + "px");
            }
            else {
                $(this).parent().parent().height(1.82 * fontSize + "px");
            }
        })

        //鼠标移出事件
        $(".data-list li").mouseout(function () {
            $(this).parent().children().each(function (index) {
                var li = $(this);
                if (index != 0) {
                    li.addClass("hide");
                }
            })
            $(this).removeClass("color");
            $(this).parent().parent().removeClass("cover");
            $(this).parent().parent().height(0.61 * fontSize + "px");
        })

        //鼠标点击事件(流量、日累计、月累计、年累计)
        //$(".data-list li").click(function (event) {
        //	var e = event || window.event;
        //	if (e.stopPropagation) {
        //		e.stopPropagation();
        //	}
        //	else {
        //		e.cancelBubble = true;
        //	}
        //	var id = $(this).parent().parent().attr("id");
        //	//var type = $(this).attr("type");

        //	if (typeof ret.itemClickHandler !== 'function') return;

        //	ret.itemClickHandler(id, EnergyType);
        //})

        //右侧 鼠标点击事件(box元素)
        $(".right-content .box").click(function () {
            if ($(this).attr("child") == 0) return;

            //clearLeftData();
            var len = ModelBaseIDArray.length;
            ModelBaseIDArray.push($(this).attr("id"));
            showBack();
            dao.queryGraphStruct(getCondition(), drawFactoryList);
        })

        //右侧 右键点击事件
        $(".right-content .box").bind('contextmenu', function (event) {
            var e = event || window.event;
            var id = $(this).attr("id");
            var name = $(this).children('.box-head').html();
            var modelbaseid = $(this).attr("modelbase");
            var energymediumname = $('.energy-button').filter(".click").html();
            if (e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }

            if (typeof ret.boxRClickHandler !== 'function') return;

            ret.boxRClickHandler({ ModelBaseID: modelbaseid, EnergyMediumID: energymediumname });
        });

        //左侧 鼠标点击事件(box元素)
        $(".left-content .box").click(function () {
            if ($(this).attr("child") == 0) return;

            //clearLeftData();
            var len = ModelBaseIDArray.length;
            ModelBaseIDArray.push($(this).attr("id"));
            showBack();
            dao.queryGraphStruct(getCondition(), drawFactoryList);
        })

        //左侧 右键点击事件
        $(".left-content .box").bind('contextmenu', function (event) {
            var e = event || window.event;
            var id = $(this).attr("id");
            var name = $(this).children('.box-head').html();
            var modelbaseid = $(this).attr("modelbase");
            var energymediumname = $('.energy-button').filter(".click").html();
            if (e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }

            if (typeof ret.boxRClickHandler !== 'function') return;

            ret.boxRClickHandler({ ModelBaseID: modelbaseid, EnergyMediumID: energymediumname });
        });
    }

    function addStaticHandle() {
        //返回按钮点击事件
        $(".left-content").on("click", "#goback ", function (event) {
            var e = event || window.event;
            if (e.stopPropagation)
                e.stopPropagation();
            else
                e.cancelBubble = true;

            if (e.preventDefault)
                e.preventDefault();
            else
                e.returnValue = false;

            //clearLeftData();
            var len = ModelBaseIDArray.length;
            ModelBaseIDArray.pop();
            showBack();
            dao.queryGraphStruct(getCondition(), drawFactoryList);
        });

        //介质切换事件
        $(".left-title").on("click", ".energy-button", function () {
            if (!energytypeClickable) {
                return false;
            }
            else {
                energytypeClickable = false;
            }

            ModelBaseIDArray = [""];
            //var oldEnergy = $(".middle-panel-bottom .left-title .click").attr("id");

            $(this).parent().children().each(function () {
                $(this).removeClass("click");
            });

            $(this).addClass("click");

            //EnergyType = $(".middle-panel-bottom .left-title .click").attr("id");
            //EnergyMediumID = $(".middle-panel-bottom .left-title .click").attr("energymediumid");
            //if (oldEnergy != EnergyType) {
            //    energyChange();
            //}
            //clearLeftData();
            showBack();
            dao.queryGraphStruct(getCondition(), drawFactoryList);
        });
    }

    ret.init = function () {
        addStaticHandle();
        dao.queryGraphEle('', drawEleList);
    };

    //ret.itemClick = function (func) {
    //	this.itemClickHandler = func;
    //};

    ret.boxClick = function (func) {
        this.boxClickHandler = func;
    };

    ret.boxRClick = function (func) {
        this.boxRClickHandler = func;
    };

    ret.condition = function () {
        return getCondition();
    }

    return ret;
})