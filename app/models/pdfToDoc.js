
const { sql } = require("../config/db.config");
// const fs = require('fs').promises;
var GroupDocs = require('groupdocs-conversion-cloud');
global.clientId = "3d689a28-3d66-4f30-b77a-afb4660135dc";
global.clientSecret = "eea042a9d1384bcf8b80eeb2665e5ce9";
global.myStorage = "";
const unoconv = require('node-unoconv');
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
// const fs = require('fs');
// const unoconv = require('unoconv');
// const unoconv = require('awesome-unoconv');
// const fs = require('fs');
// const { exec } = require('child_process');
const path = require('path');
const { spawn } = require('child_process');
const pandoc = require('node-pandoc');
const fs = require('fs');

const convertApi = require('cloudmersive-convert-api-client');
const defaultClient = convertApi.ApiClient.instance;
const apikey = defaultClient.authentications['Apikey'];
apikey.apiKey = ''; // Replace with your own API key

const config = new GroupDocs.Configuration(clientId, clientSecret);
config.apiBaseUrl = "https://api.groupdocs.cloud";

const pdfToDoc = function (pdfToDoc) {
	this.userid = pdfToDoc.userid;
	this.fileurl = pdfToDoc.fileurl;
};

pdfToDoc.pdfToDoc = async (req, res) => {
// Read the input PDF file

// path to the input PDF file
// const inputPath = req.files[0].path;
// console.log(inputPath);
// // path to the output Word document file
// const outputPath = './';

// // command to convert PDF to DOCX using LibreOffice
// const command = `/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to docx --outdir "${outputPath}" -vvv "${inputPath}"`;
// const command = `export HOME=/tmp/ && /Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to docx:"MS Word 2009 XML" --outdir ${outputPath} -vvv ${inputPath}`;
// soffice --convert-to docx --outdir ${outputPath} ${inputPath}


const OUTPUT = `/Users/mac/Desktop/PTWC/PTWC_Backend/imges_uploads/${Date.now()}new.docx`;
// If our output already exists, remove it so we can run the application again.
// if(fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);

const INPUT = req.files[0].path;

const credentials = PDFServicesSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile('pdfservices-api-credentials.json')
        .build();

// Create an ExecutionContext using credentials
const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);



// This creates an instance of the Export operation we're using, as well as specifying output type (DOCX)
const exportPdfOperation = PDFServicesSdk.ExportPDF.Operation.createNew(PDFServicesSdk.ExportPDF.SupportedTargetFormats.DOCX);

// Set operation input from a source file
const inputPDF = PDFServicesSdk.FileRef.createFromLocalFile(INPUT);
exportPdfOperation.setInput(inputPDF);


try {

    exportPdfOperation.execute(executionContext)
    .then(result => result.saveAsFile(OUTPUT))
    .then(() => {
        console.log('Export Done')
    })
    .catch(err => {
        console.log('Exception encountered while executing operation', err);
    });

} catch(err) {
    console.error('Error:', err);
}

// const docxPath = req.files[0].path;
// console.log(`docx: ${docxPath}`);
// const pdfPath = '/Users/mac/Desktop/PTWC/PTWC_Backend/imges_uploads/';

// // Define the input and output file paths
// const inputPath = req.files[0].path;
// const outputPath = '/Users/mac/Desktop/PTWC/PTWC_Backend/imges_uploads/output.docx';
// const options = {
// 	from: 'pdf',
// 	to: 'docx',
// 	output: outputPath,
//   };
  
//   pandoc(inputPath, options, (err, result) => {
// 	if (err) {
// 	  console.error('Error converting PDF to DOC:', err);
// 	} else {
// 	  console.log('PDF successfully converted to DOC!');
// 	}
//   });

// const args = [
// 	'--from=pdf',
// 	'--to=docx',
// 	'--output=' + outputPath,
// 	inputPath
//   ];
  
//   pandoc(args, function (err, result) {
// 	if (err) {
// 	  console.error('Error converting PDF to Word:', err);
// 	} else {
// 	  console.log('PDF successfully converted to Word!');
// 	  // Read the output file and log its contents
// 	  fs.readFile(outputPath, 'utf8', (err, data) => {
// 		if (err) {
// 		  console.error('Error reading output file:', err);
// 		} else {
// 		  console.log('Output file contents:', data);
// 		}
// 	  });
// 	}
//   });
  


// // Define the conversion option
// var doc = {
//   format: 'docx',
//   output: '/Users/mac/Desktop/PTWC/PTWC_Backend/imges_uploads/output.docx',
// };
// console.log(typeof(doc));

// unoconv.convert(path);


// await unoconv.convert(inputPath)
//   .then(async (buffer) => {
//     console.log(buffer);
// 	const outputPath = path.join(`./imges_uploads/${Date.now()}new.docx`);
// 	unoconv.convert(path);
// 	await fs.writeFile(outputPath, buffer);
// 		// fs.writeFile('./converted.pdf', buffer);
//   }).catch((err) => {
//     console.log(err);
//   });
// await unoconv.convert(inputPath, 'pdf', function (err, result) {
// 	if(result){
// 	// result is returned as a Buffer
// 	console.log(result);
// 	fs.writeFile('./converted.pdf', result);
// 	}else{
// 		console.log(err);
// 	}
// 	console.log("err");
// });
console.log('2');

// Convert the file using unoconv
// unoconv.convert(inputPath, (err, result) => {
//   if (err) {
//     console.error('Error converting PDF to Word:', err);
//   } else {
//     console.log('PDF successfully converted to Word!');
//     // Read the output file and log its contents
//     fs.readFile(outputPath, 'utf8', (err, data) => {
//       if (err) {
//         console.error('Error reading output file:', err);
//       } else {
//         console.log('Output file contents:', data);
//       }
//     });
//   }
// });



// const unoconvProcess = spawn('unoconv', ['-f', 'docx', '-o', pdfPath, docxPath]);

// unoconvProcess.on('close', (code) => {
//   if (code === 0) {
//     console.log('File converted successfully!');
//   } else {
//     console.error(`Conversion process exited with code ${code}`);
//   }
// });

// unoconvProcess.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });

// unoconvProcess.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// const libreOfficeCmd = '/Applications/LibreOffice.app/Contents/MacOS/soffice';

// exec(`export HOME=/tmp/ && ${libreOfficeCmd} --headless --convert-to docx --outdir "${docxPath}" "${pdfPath}"`, (error, stdout, stderr) => {
// // execute the command using child_process.exec
// // exec(command, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error converting PDF to Word: ${error}`);
//     return;
//   }
  
//   console.log(`PDF converted to Word successfully: `);
//   console.log(`PDF stdout : ${stdout}`);
//   console.log(`PDF stderr : ${stderr}`);

// });









// const inputFile = fs.readFileSync(`/Users/mac/Desktop/PTWC/PTWC_Backend/merged.pdf`);
// const pdftodocx = require('pdftodocx');
// // Convert the PDF to a Word document
// pdftodocx(inputFile).then(outputDocx => {
//   // Write the output Word document to a file
//   fs.writeFileSync('./output.docx', outputDocx);
// }).catch(error => {
//   console.error(error);
// });

			// convert(req,res);
}

const convert = async (req,res) => {
	try {
		console.log(req.files);

		var resourcesFolder =req.files[0].path;
		fs.readFile(resourcesFolder, (err, fileStream) => {
			// construct FileApi
			var fileApi = GroupDocs.FileApi.fromConfig(config);
			// create upload file request
			var result = `https://api.groupdocs.cloud/v2.0/conversion/swagger/spec/conversion/storage/file/${req.file[0].path}`
			console.log(result);
			var request = new GroupDocs.UploadFileRequest("sample1.pdf", fileStream, myStorage);
			// upload file
			fileApi.uploadFile(request);
		});


		// initialize api
		let convertApi = GroupDocs.ConvertApi.fromKeys(clientId, clientSecret);
		// define convert settings
		let settings = new GroupDocs.ConvertSettings();
		settings.filePath = "sample.pdf"; // input file path on the cloud
		settings.format = "docx";         // output format
		settings.outputPath = "PTW";   // output file folder on the cloud

		// create convert document request
		let request = new GroupDocs.ConvertDocumentRequest(settings);
		// convert document
		console.log(request);
		let result = await  convertApi.convertDocument(request);
		console.log("Document converted successfully: " + result[0].url);
		download(req,res);
	} catch (err) {
		console.log(err);
	}
}

const download = async (req,res) => {
	try{
		// construct FileApi
		var fileApi = GroupDocs.FileApi.fromConfig(config);

		// create download file request
		let request = new GroupDocs.DownloadFileRequest("PTW/sample.docx", myStorage);
		// download file
		console.log(request);
		let response = await fileApi.downloadFile(request);
		console.log(response);
		var filename = `./imges_uploads/${Date.now()}new.docx`
		// fs.writeFile("C:\\Files\\sample.docx", response, "binary", function (err) { });
		fs.writeFile(filename, response, "binary", function (err) { });
		// save file in your working directory
		sql.query(`CREATE TABLE IF NOT EXISTS public.word (
			id SERIAL NOT NULL,
			userid SERIAL NOT NULL,
			fileurl text ,
			createdAt timestamp,
			updatedAt timestamp ,
			PRIMARY KEY (id)) ;` , async (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				if (!req.files) {
					res.json({
						message: "Please select file",
						status: false,
					});
				} else {
					const { userID } = req.body;
	
					const query = `INSERT INTO "word" (id,userid,fileurl , createdAt ,updatedAt )
								VALUES (DEFAULT, $1, $2 ,  'NOW()','NOW()' ) RETURNING * `;
					const foundResult = await sql.query(query,
						[userID, filename]);
					if (foundResult.rows.length > 0) {
						if (err) {
							res.json({
								message: "Try Again",
								status: false,
								err
							});
						}
						else {
							res.json({
								message: "img To Pdf Added Successfully!",
								status: true,
								result: foundResult.rows,
							});
						}
					} else {
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					}
				}
			}
		});




	} catch (err) {
		console.log('err');
		console.log(err);
	}
}
module.exports = pdfToDoc;




// const { sql } = require("../config/db.config");
// const fs = require('fs').promises;
// var GroupDocs = require('groupdocs-conversion-cloud');
// global.clientId = "3d689a28-3d66-4f30-b77a-afb4660135dc";
// global.clientSecret = "eea042a9d1384bcf8b80eeb2665e5ce9";
// global.myStorage = "";

// const config = new GroupDocs.Configuration(clientId, clientSecret);
// config.apiBaseUrl = "https://api.groupdocs.cloud";

// const pdfToDoc = function (pdfToDoc) {
// 	this.userid = pdfToDoc.userid;
// 	this.fileurl = pdfToDoc.fileurl;
// };

// pdfToDoc.pdfToDoc = async (req, res) => {
// 			convert(req,res);
// }

// const convert = async (req,res) => {
// 	try {
// 		console.log(req.files);

// 		var resourcesFolder =req.files[0].path;
// 		fs.readFile(resourcesFolder, (err, fileStream) => {
// 			// construct FileApi
// 			var fileApi = GroupDocs.FileApi.fromConfig(config);
// 			// create upload file request
// 			var request = new GroupDocs.UploadFileRequest("sample1.pdf", fileStream, myStorage);
// 			// upload file
// 			fileApi.uploadFile(request);
// 		});


// 		// initialize api
// 		let convertApi = GroupDocs.ConvertApi.fromKeys(clientId, clientSecret);
// 		// define convert settings
// 		let settings = new GroupDocs.ConvertSettings();
// 		settings.filePath = "sample.pdf"; // input file path on the cloud
// 		settings.format = "docx";         // output format
// 		settings.outputPath = "PTW";   // output file folder on the cloud

// 		// create convert document request
// 		let request = new GroupDocs.ConvertDocumentRequest(settings);
// 		// convert document
// 		console.log(request);
// 		let result = await  convertApi.convertDocument(request);
// 		console.log("Document converted successfully: " + result[0].url);
// 		download(req,res);
// 	} catch (err) {
// 		console.log(err);
// 	}
// }

// const download = async (req,res) => {
// 	try{
// 		// construct FileApi
// 		var fileApi = GroupDocs.FileApi.fromConfig(config);

// 		// create download file request
// 		let request = new GroupDocs.DownloadFileRequest("PTW/sample.docx", myStorage);
// 		// download file
// 		console.log(request);
// 		let response = await fileApi.downloadFile(request);
// 		console.log(response);
// 		var filename = `./imges_uploads/${Date.now()}new.docx`
// 		// fs.writeFile("C:\\Files\\sample.docx", response, "binary", function (err) { });
// 		fs.writeFile(filename, response, "binary", function (err) { });
// 		// save file in your working directory
// 		sql.query(`CREATE TABLE IF NOT EXISTS public.word (
// 			id SERIAL NOT NULL,
// 			userid SERIAL NOT NULL,
// 			fileurl text ,
// 			createdAt timestamp,
// 			updatedAt timestamp ,
// 			PRIMARY KEY (id)) ;` , async (err, result) => {
// 			if (err) {
// 				res.json({
// 					message: "Try Again",
// 					status: false,
// 					err
// 				});
// 			} else {
// 				if (!req.files) {
// 					res.json({
// 						message: "Please select file",
// 						status: false,
// 					});
// 				} else {
// 					const { userID } = req.body;
	
// 					const query = `INSERT INTO "word" (id,userid,fileurl , createdAt ,updatedAt )
// 								VALUES (DEFAULT, $1, $2 ,  'NOW()','NOW()' ) RETURNING * `;
// 					const foundResult = await sql.query(query,
// 						[userID, filename]);
// 					if (foundResult.rows.length > 0) {
// 						if (err) {
// 							res.json({
// 								message: "Try Again",
// 								status: false,
// 								err
// 							});
// 						}
// 						else {
// 							res.json({
// 								message: "img To Pdf Added Successfully!",
// 								status: true,
// 								result: foundResult.rows,
// 							});
// 						}
// 					} else {
// 						res.json({
// 							message: "Try Again",
// 							status: false,
// 							err
// 						});
// 					}
// 				}
// 			}
// 		});




// 	} catch (err) {
// 		console.log('err');
// 		console.log(err);
// 	}
// }
// module.exports = pdfToDoc;
