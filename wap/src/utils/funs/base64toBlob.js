export default function (base64Data, fileName, contentType) {
	fileName = fileName || 'BlobFile.png';
	contentType = contentType || '';
	// btoa和atob是window对象的两个函数，其中btoa是binary to ascii，用于将binary的数据用ascii码表示，即Base64的编码过程，
	// 而atob则是ascii to binary，用于将ascii码解析成binary数据，看一个例子：
	/* //Define the string
		var string = 'Hello World!';
		// Encode the String
		var encodedString = btoa(string);
		console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"
		// Decode the String
		var decodedString = atob(encodedString);
		console.log(decodedString); // Outputs: "Hello World!"
	*/
	// 可以看到，字符串“Hello World!”已被Base64编码和解码。但是，atob和btoa不能编码Unicode字符：
	/*
		var string = "Hello, 中国！";
		window.btoa(string);
	*/
	// 那如何用这种方式支持汉字呢？这里我们可以先将带有非Latin1字符的串先用encodeURIComponent编码：
	/*
		var string = "Hello, 中国！";
		//"SGVsbG8lMkMlMjAlRTQlQjglQUQlRTUlOUIlQkQlRUYlQkMlODE="
		var encodedString = btoa(encodeURIComponent(string));
		var decodedString = decodeURIComponent(atob(encodedString));
		console.log(decodedString); //"Hello, 中国！"
	*/
	// 注意，编码的过程是先encodeURI，再编码，那么解码的过程应该是先解码，再decodeURI。
	// 另外，在使用atob和btoa这两个函数时需要注意的是，IE9是不支持的(可以使用公共类库)
	var sliceSize = 1024;
	var byteCharacters = atob(base64Data.replace('data:image/jpeg;base64,', ''));
	// ① 获取字符/字节数量（每个ascii字符占一个字节）  
	var bytesLength = byteCharacters.length;
	// ② 所有字符划分为若干个区域，每个区域包含1024B = 1KB 
	var slicesCount = Math.ceil(bytesLength / sliceSize);
	// ③ 创建一个数组，成员数量为划分的区域数量，每个成员为最多包含1024个字节的Uint8Array的类型化数组
	var byteArrays = new Array(slicesCount);
	for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		var begin = sliceIndex * sliceSize;
		var end = Math.min(begin + sliceSize, bytesLength);
		var bytes = new Array(end - begin);
		for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}
	var blobFile = new Blob(byteArrays, { type: contentType });
	blobFile.name = fileName;
	blobFile.lastModifiedDate = new Date();
	return blobFile;
};