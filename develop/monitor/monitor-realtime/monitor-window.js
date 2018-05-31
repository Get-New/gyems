$(function () {
    Page.init();
})

var Page = {
    init: function () {
        var pdi_path = window.location.search.replace('?', '');
        $('#for_pdi').append('<object classid="clsid:4F26B906-2854-11D1-9597-00A0C931BFC8" id="Pbd1" style="width:100%;height:100%"><param name="DisplayURL" id="param_pdi" value="' + pdi_path + '" /></object>');
    }
}