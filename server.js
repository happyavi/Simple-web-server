var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'html' :'test/html',
	'jpeg' :'image/jpeg',
	'jpg' : 'image/jpeg',
	'png' : 'image/png',
	'js' : 'text/javascript',
	'css' : 'text/css'
};

// create server

http.createServer(function(req,res){
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(process.cwd(),unescape(uri));
	console.log('Loading' + uri);
	var stats;

	try{
		stats = fs.lstatSync(fileName);

	} catch(e){
        res.writeHead(404,{'COntent-type': 'text/plain'});
        res.write('404 Not Found\n');
        res.end();
        return;
	}

	// check if file/directory
	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		res.writeHead(200,{'Content-type' : mimeType});

		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	} else if(stats.isDirectory()){
		res.writeHead(302,{
			'Location' : 'index.html'
		});
		res.end();
	} else{
		res.writeHead(500, {"COntent-Type": "text/plain"});
		res.write("500 Internal Error");
		res.end();
	}
}).listen(3000);
console.log('Server is listening');


// http.createServer(function(req,res) {
// 	res.writeHead(200, {'Content-Type' : 'text/plain'});
// 	res.send('Hello World\n');
// }).listen(1337, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:1337/');