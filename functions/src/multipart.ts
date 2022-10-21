/**
 * Parses a 'multipart/form-data' upload request
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
 const path = require('path');
 const os = require('os');
 const fs = require('fs');
 
 // Node.js doesn't have a built-in multipart/form-data parsing library.
 // Instead, we can use the 'busboy' library from NPM to parse these requests.
 const Busboy = require('busboy');
 
 // @ts-ignore
 exports.uploadFile = (req, res) => {
   if (req.method !== 'POST') {
     // Return a "method not allowed" error
     return res.status(405).end();
   }
   const busboy = Busboy({headers: req.headers});
   const tmpdir = os.tmpdir();
 
   // This object will accumulate all the fields, keyed by their name
   const fields = {};
 
   // This object will accumulate all the uploaded files, keyed by their name.
   const uploads = {};
 
   // This code will process each non-file field in the form.
    // @ts-ignore
   busboy.on('field', (fieldname, val) => {
     /**
      *  TODO(developer): Process submitted field values here
      */
     console.log(`Processed field ${fieldname}: ${val}.`);
      // @ts-ignore
     fields[fieldname] = val;
   });
 
    // @ts-ignore
   const fileWrites = [];
 
   // This code will process each file uploaded.
    // @ts-ignore
   busboy.on('file', (fieldname, file, {filename}) => {
     // Note: os.tmpdir() points to an in-memory file system on GCF
     // Thus, any files in it must fit in the instance's memory.
     console.log(`Processed file ${filename}`);
     const filepath = path.join(tmpdir, filename);
      // @ts-ignore
     uploads[fieldname] = filepath;
 
     const writeStream = fs.createWriteStream(filepath);
     file.pipe(writeStream);
 
     // File was processed by Busboy; wait for it to be written.
     // Note: GCF may not persist saved files across invocations.
     // Persistent files must be kept in other locations
     // (such as Cloud Storage buckets).
     const promise = new Promise((resolve, reject) => {
       file.on('end', () => {
         writeStream.end();
       });
       writeStream.on('finish', resolve);
       writeStream.on('error', reject);
     });
     fileWrites.push(promise);
   });
 
   // Triggered once all uploaded files are processed by Busboy.
   // We still need to wait for the disk writes (saves) to complete.
   busboy.on('finish', async () => {
     // @ts-ignore
     await Promise.all(fileWrites);
 
     /**
      * TODO(developer): Process saved files here
      */
     for (const file in uploads) {
       // @ts-ignore
       fs.unlinkSync(uploads[file]);
     }
     res.send();
   });
 
  if (req.rawBody) {
    busboy.end(req.rawBody);
  }
  else {
    req.pipe(busboy);
  }
 };
/* tslint:enable */
