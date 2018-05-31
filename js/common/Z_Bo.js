
var Z = (function () {

    var ret = {};
    //从数组中删除特定值的元素(data为操作数组，x为定义值)
    ret.remove = function (data, x) {
        var L = data.length;
        for (i = 0; i < L; i++) {
            if (data[i] === x) {
                var temp1 = data.slice(0, i);
                var temp2 = data.slice(i + 1, data.length);
                data = temp1.concat(temp2);
                i--
            };
        };
        return data
    };
    //从数组中删掉第i个元素(data为操作数组，i表示第几个)
    ret.del_i = function (data, i) {
        var temp1, temp2;
        if (i == 1) {
            data.shift();
        }
        else if (i == data.length) {
            data.pop();
        }
        else {
            temp1 = data.slice(0, i - 1);
            temp2 = data.slice(i, data.length);
            data = temp1.concat(temp2);
        }
        return data
    }










    return ret;

})();









