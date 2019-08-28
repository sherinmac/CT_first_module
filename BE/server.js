var express = require('express');
var app = express();

// CORS options
var cors = require('cors');
const corsOptions = {
  origin(origin, callback) {
    callback(null, true);
  },
  credentials: true,
};
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
  next();
};
app.use(cors(corsOptions));
app.use(allowCrossDomain);



var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



var path = require('path');
var fs = require("fs");
const unzipper = require("unzipper");
const filetempPath = '/home/sherin_ag/project_express/unzip_temp.txt';


var unzipFile = (filePath) => {

    return new Promise((resolve, reject) => {

        try {
            fs.createReadStream(filePath)
                .pipe(unzipper.Parse())
                .on('entry', function (entry) {
                    const fileName = entry.path;
                    // console.log(fileName);
                    const type = entry.type; // 'Directory' or 'File'
                    const size = entry.vars.uncompressedSize; // There is also compressedSize;
                    if (fileName) {
                        console.log(fileName);
                        entry.pipe(fs.createWriteStream(filetempPath));
                        resolve("success");
                    } else {
                        entry.autodrain();
                    }
                });

        } catch (error) {
            reject(error);
        }

    });

};

const writeJson = () => {

    return new Promise((resolve, reject) => {
        try {
            let res = [];
            var LineByLineReader = require('line-by-line'),
            lr = new LineByLineReader(filetempPath,{ encoding: 'utf8',skipEmptyLines: false });

            lr.on('error', function (err) {
                reject(err);
            });

            lr.on('line', function (line) {
                res.push({ filename: line ,selected : false,type : "content"});
            });

            lr.on('end', function () {
                fs.unlinkSync(filetempPath);
                resolve(res);
            });
        }
        catch (err) {
            reject(err);

        }
    });

}

app.get('/', function (req, res) {
    res.send('Hi i am,Default');
    //res.end('Hi i am,Default');
});


app.get('/filesTypes', function (req, res) {

    // console.log(req.body.filepath);
    // var filePath = req.body.filepath;
    var filePath = '/home/sherin_ag/project_workshop/start.zip';
    if (fs.existsSync(filePath)) {
        (async () => {
            await unzipFile(filePath);
            console.log("Unzip completed");
            console.log("Reading  file started");
            await writeJson().then(result => {
                console.log(result);
                res.send(result);
            });
            console.log('End of File');
        })();
    }
    else {
        console.log('File not exist');
        res.end('File not exist');
    }

});


app.post('/filesTypes', function (req, res) {
    console.log(req.body);
    console.log(req.body.filepath);
    var filePath = req.body.filepath;
    // var filePath = '/home/sherin_ag/project_workshop/start.zip';
    if (fs.existsSync(filePath)) {
        (async () => {
            await unzipFile(filePath);
            console.log("Unzip completed");
            console.log("Reading  file started");
            await writeJson().then(result => {
                //result.shift();
                result[0].type='head';
                console.log(result);
                res.json(result);
            });
            console.log('End of File');
        })();
    }
    else {
        console.log('File not exist');
        res.end('File not exist');
    }

});


app.post('/writefilesTypes', function (req, res) {
    // console.log(req);
    // process.exit(0);
    var  jsonData=req.body;
    var  writeString='';
    //console.log(jsonData);

    jsonData.forEach(function(data) {
   
    if(data.selected == true || data.type=='head'){
        console.log(data.filename);
        writeString += data.filename+ '\n' ;
    }
    });

    try {
      fs.writeFileSync('/home/sherin_ag/project_express/result.csv', writeString, { mode: 0o755 });
      console.log("Finished");
      res.send("Writing finished");
    } catch(err) {
      // An error occurred
      console.error(err);
    }


});



var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

});