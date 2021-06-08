const BusBoy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

var Busboy = function(req, res, next) {
  
  const busboy = new BusBoy({
    headers: req.headers,
  });

  const fields = {};
  const files = [];

  busboy.on('field', (key, value) => {
    // You could do additional deserialization logic here, values will just be
    // strings
    fields[key] = value;
    console.log(fields)
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log('filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    const extension = filename.split('.')[filename.split('.').length - 1];
    var fname=filename;
    var saveTo = path.join(os.tmpdir(), filename);
    file.pipe(fs.createWriteStream(saveTo));


    files.push({
      path: saveTo,
      name:fname,
      extension:extension
    })
  });


  busboy.on('finish', () => {
    req.files = files
    req.fields = fields
    next();
    
  });

  busboy.end(req.rawBody);
  }

  module.exports = Busboy
  