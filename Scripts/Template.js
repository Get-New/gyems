///***************************************************************************************************///
/// api URL 说明
/// /sessionID/authorityKey/parameters/ 部分为预制参数,可以省略, 省略后的URL: api/ManageDictionary/Add/?[参数表]
/// 若是预制参数包括特殊字符请转换成: api/ManageDictionary/GetEvery?sessionID=&authorityKey=&parameters=
/// _dc=' + (new Date().getTime()) 为时间戳,可以省略
///***************************************************************************************************///

/// Posts the specified value.
/// POST api/Controller/Add/
$.ajax({
	type: 'POST',
	url: '',
	data: { "": "Send...", "": "Send...", "": "Send..." },
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
});

/// Puts the specified value.
/// PUT api/Controller/Edit/
$.ajax({
	type: 'PUT',
	url: '',
	data: { "Id": "", "": "Send...", "": "Send...", "": "Send..." },
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
});

/// Queries the list.
/// GET api/Controller/GetPage/
$.ajax({
	type: 'GET',
	url: 'api/ModelStruct/GetPage?ModelStructName=&RootId=&ofs=99&ps=9&sort_column=&sort_desc=',
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
})

/// Deletes the specified value.
/// DELETE api/Controller/Delete/
$.ajax({
	type: 'DELETE',
	url: '',
	data: { "Id": "" },
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
});

///***************************************************************************************************///

/// Posts the specified value.
/// POST api/ManageDictionary/Add/
$.ajax({
	type: 'POST',
	url: 'api/ManageDictionary/Add/sessionID/authorityKey/parameters/?_dc=' + (new Date().getTime()),
	data: { "DictionaryName": "Send...DictionaryName" },
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
});

/// Posts the specified value.
/// POST api/ManageDictionary/AddList/
$.ajax({
	type: 'POST',
	url: 'api/ManageDictionary/AddList/sessionID/authorityKey/parameters/?_dc=' + (new Date().getTime()),
	data: { "DictionaryName": "Send...DictionaryName" },
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
})

/// Puts the specified value.
/// PUT api/ManageDictionary/Edit/
$.ajax({
	type: 'PUT',
	url: 'api/ManageDictionary/Edit/sessionID/authorityKey/parameters/?_dc=' + (new Date().getTime()),
	data: { "DictionaryName": "Send...DictionaryName" },
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
});

/// Puts the specified value.
/// PUT api/ManageDictionary/EditList/
$.ajax({
	type: 'PUT',
	url: 'api/ManageDictionary/EditList/sessionID/authorityKey/parameters/?_dc=' + (new Date().getTime()),
	data: { "DictionaryName": "Send...DictionaryName" },
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
})

/// Gets this instance.
/// GET api/ManageDictionary/GetModel/?primaryId=
$.ajax({
	type: 'GET',
	url: 'api/ManageDictionary/GetModel/sessionID/authorityKey/parameters/?primaryId=&_dc=' + (new Date().getTime()),
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
})

/// Gets the list.
/// GET api/ManageDictionary/GetList/
$.ajax({
	type: 'GET',
	url: 'api/ManageDictionary/GetList/sessionID/authorityKey/parameters/?_dc=' + (new Date().getTime()),
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
})

/// Queries the list.
/// GET api/ManageDictionary/GetSome/
$.ajax({
	type: 'GET',
	url: 'api/ManageDictionary/GetSome/sessionID/authorityKey/parameters/?_dc=' + (new Date().getTime()),
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
})

/// Queries the list.
/// GET api/ManageDictionary/GetEvery/
$.ajax({
	type: 'GET',
	url: 'api/ManageDictionary/GetEvery/sessionID/authorityKey/parameters/?_dc=' + (new Date().getTime()),
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
})

/// Deletes the specified value.
/// DELETE api/ManageDictionary/Delete/
$.ajax({
	type: 'DELETE',
	url: 'api/ManageDictionary/Delete/sessionID/authorityKey/parameters/?_dc=' + (new Date().getTime()),
	data: { "DictionaryName": "Send...DictionaryName" },
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
});

/// Deletes the specified value.
/// DELETE api/ManageDictionary/DeleteList/
$.ajax({
	type: 'DELETE',
	url: 'api/ManageDictionary/DeleteList/sessionID/authorityKey/parameters/?_dc=' + (new Date().getTime()),
	data: { "DictionaryName": "Send...DictionaryName" },
	dataType: 'json',
	success: function (responseData) {
		console.log(responseData);
	}
})