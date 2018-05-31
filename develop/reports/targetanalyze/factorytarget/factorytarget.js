
var Page = {

     

    init: function () {
         
        var t = dst.getCurrType();
        dst.change(function (t, y, m, d) {
        });
        dst.init();

        $('#goback').click(function () {
            window.history.go(-1);
        })
    } 
}
