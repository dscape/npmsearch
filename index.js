var request        = require('request')
  , JSONStream     = require('JSONStream')
  , config         = require('./config') // config.json
  , npm            = config.npm
  , search         = config.search
  , parser         = JSONStream.parse(['rows', true])
  , errs           = []
  ;

request(npm).pipe(parser);

parser.on('data', function(module) {
  var url = "documents?format=json&uri=/" + module.id;
  request({uri: search + url, method: "PUT", body: JSON.stringify(module) }, 
  function (err, headers, data) {
    if(err) {
      console.log("exc:", err);
      errs.push({err: err, module: module});
    }
    if (headers.statusCode >= 200 && headers.statusCode < 400) { 
      console.log('ok:', url);
    } else {
      console.log("err:", url);
      errs.push(
        { err: "status code was " + headers.statusCode
        , module: module
        , response_body: data
      });
    }
  });
});

parser.on('end', function () { console.log(errs); });
