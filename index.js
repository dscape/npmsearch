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
  var url = "document?format=json&uri=/" + module.id;
  request.put(search + url, 
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