// 手机号码验证
jQuery.validator.addMethod("mobile", function (value, element) {
	var length = value.length;
	return this.optional(element) || (length == 11 && /^(((10[0-9]{1})|(13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));
}, "请检查您的手机号码");

//手机号码验证(13位编码)
jQuery.validator.addMethod("replaceMobile", function (value, element) {
	var length = value.length;
	return this.optional(element) || (length == 13) || (length == 11 && /^(((10[0-9]{1})|(13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));
}, "请检查您的手机号码");
//电话号码验证
jQuery.validator.addMethod("phone", function (value, element) {
	var ph = /(^0[1-9][0-9]{1,2}\-[1-9][0-9]{6,7}$)|(^[1-9][0-9]{6,7}$)|(^0[1-9][0-9]{1,2}\-[1-9][0-9]{6,7}\-[0-9]{1,4}$)|(^[1-9][0-9]{6,7}\-[0-9]{1,4}$)|(^0{0,1}13[0-9]{9}$)|(^0{0,1}15[0-9]{9}$|^0{0,1}18[0-9]{9}$)/;
	return this.optional(element) || (ph.test(value));
}, "请检查您的电话号码");

//邮政编码验证
jQuery.validator.addMethod("zipcode", function (value, element) {
	var tel = /^\d{6}$/;
	return this.optional(element) || (tel.test(value));
}, "请检查您的邮政编码");
//身份证
jQuery.validator.addMethod("idCode", function (value, element) {
	if (this.optional(element))
		return "dependency-mismatch";
	var exp = /(^[0-9]{18}$)|(^[0-9]{17}[Xx]$)/;
	var reg = value.match(exp);
	if (reg == null)
		return false;

	var inYear = (value.length == 18) ? value.substring(6, 10) : "19" + value.substring(6, 8);
	var inMonth = (value.length == 18) ? value.substring(10, 12) - 1 : value.substring(8, 10) - 1;
	var inDay = (value.length == 18) ? value.substring(12, 14) : value.substring(10, 12);
	var d = new Date(inYear, inMonth, inDay);
	var now = new Date();
	var year = d.getFullYear();
	if (year < 1900)
		return false;
	var month = d.getMonth();
	var day = d.getDate();
	if (inYear != year || inMonth != month || inDay != day || d > now || year < 1800) return false;

	var no = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
	var id = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
	var i = 0, wi = 0, sum = 0;
	for (; i < 17; i++) {
		wi = value.substring(i, i + 1) * no[i];
		sum += wi;
	}
	var idIndex = sum % 11;
	return id[idIndex] == value.toUpperCase().charAt(17);
}, "请检查您的身份证号码");
//密码8-12位
jQuery.validator.addMethod("password", function (value, element) {
	if (this.optional(element))
		return "dependency-mismatch";
	if (value.length < 8 || value.length > 12) return false;
	var ch1 = 0, ch2 = 0, ch3 = 0;
	for (var i = 0; i < value.length; i++) {
		var inputType = value.charCodeAt(i);
		if (inputType >= 65 && inputType <= 90 || inputType >= 97 && inputType <= 122) //输入大写字母或小写字母
		{
			ch1 = 1;
		}
		else if (inputType >= 48 && inputType <= 57)  //输入为数字
		{
			ch2 = 1;
		}
		else  //输入为其他字符
		{
			ch3 = 1;
		}
	}
	if (ch1 == 1 && ch2 == 1) {
		return true;
	}
	return false;
}, "请检查密码,密码为8-12位，包括数字和字母");
//IP验证
jQuery.validator.addMethod("ip", function (value, element) {
	var tel = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
	return this.optional(element) || (tel.test(value));
}, "请检查IP地址");

//域名验证
jQuery.validator.addMethod("domain", function (value, element) {
	var tel = /^(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/;
	return this.optional(element) || (tel.test(value));
}, "请检查服务器地址");