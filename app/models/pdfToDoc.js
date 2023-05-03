
const { sql } = require("../config/db.config");
// const fs = require('fs').promises;
var GroupDocs = require('groupdocs-conversion-cloud');
global.clientId = "3d689a28-3d66-4f30-b77a-afb4660135dc";
global.clientSecret = "eea042a9d1384bcf8b80eeb2665e5ce9";
global.myStorage = "";
const path = require('path');
const unoconv = require('awesome-unoconv');
const fs = require('fs');
const exec = require('child_process').exec;

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
const inputPath = req.files[0].path;

// path to the output Word document file
const outputPath = './file.docx';

// command to convert PDF to DOCX using LibreOffice
const command = `libreoffice --convert-to docx --outdir ${outputPath} ${inputPath}`;

// execute the command using child_process.exec
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error converting PDF to Word: ${error}`);
    return;
  }
  
  console.log(`PDF converted to Word successfully: ${stdout}`);
});









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
