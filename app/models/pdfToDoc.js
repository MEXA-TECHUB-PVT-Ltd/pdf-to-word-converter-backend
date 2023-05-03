
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { nanoid } = require('nanoid');
const validateUrl = require('../utils/utils');
var docxConverter = require('docx-pdf');
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
const path = require('path');
const fs = require('fs').promises;
var toPdf = require("custom-soffice-to-pdf")
// var fs = require("fs")
const { PDFNet } = require('@pdftron/pdfnet-node');

var GroupDocs = require('groupdocs-conversion-cloud');

global.clientId = "3d689a28-3d66-4f30-b77a-afb4660135dc";
global.clientSecret = "eea042a9d1384bcf8b80eeb2665e5ce9";
global.myStorage = "";

const config = new GroupDocs.Configuration(clientId, clientSecret);
config.apiBaseUrl = "https://api.groupdocs.cloud";

const pdfToDoc = function (pdfToDoc) {
	this.userid = pdfToDoc.userid;
	this.fileurl = pdfToDoc.fileurl;
};

pdfToDoc.pdfToDoc = async (req, res) => {
	console.log(req.files[0].path);

	console.log(req.files.path);

	console.log('file upload 1')

	// req.files.pdf.mv('/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/file.pdf', function (err) {
	// 	console.log('file upload')
	// 	if (err) {
	// 		console.log('file upload failed')
	// 		res.json({
	// 			status: false,
	// 			message: "file not converted successfully"
	// 		})
	// 	} else {
	// 		console.log('file uploaded ')
			convert(req,res);
	// 	}


	// })

	// sql.query(`CREATE TABLE IF NOT EXISTS public.pdfToDoc (
	//     id SERIAL NOT NULL,
	// 	userID SERIAL NOT NULL,
	// 	title text ,
	//     urlId text ,
	//     link text,
	// 	shortenLink text,
	// 	status text,
	//     createdAt timestamp,
	//     updatedAt timestamp ,
	//     PRIMARY KEY (id))  ` , async (err, result) => {
	// 	if (err) {
	// 		res.json({
	// 			message: "Try Again",
	// 			status: false,
	// 			err
	// 		});
	// 	} else {
	// 		if (!req.body.link) {
	// 			res.json({
	// 				message: "Please Enter link",
	// 				status: false,
	// 			});
	// 		} else {
	// 			const { userID, title, link, status } = req.body;
	// 			const urlId = nanoid();
	// 			const shortUrl = `https://staging-bitly-be.mtechub.com/${urlId}`

	// 			const query = `INSERT INTO "pdfToDoc" (id,userID,title,urlId ,link, shortenLink, status , createdAt ,updatedAt )
	//                         VALUES (DEFAULT, $1, $2, $3, $4  , $5 , $6 ,  'NOW()','NOW()' ) RETURNING * `;
	// 			const foundResult = await sql.query(query,
	// 				[userID, title, urlId, link, shortUrl, status]);
	// 			if (foundResult.rows.length > 0) {
	// 				if (err) {
	// 					res.json({
	// 						message: "Try Again",
	// 						status: false,
	// 						err
	// 					});
	// 				}
	// 				else {
	// 					res.json({
	// 						message: "pdfToDoc Added Successfully!",
	// 						status: true,
	// 						result: foundResult.rows,
	// 					});
	// 				}
	// 			} else {
	// 				res.json({
	// 					message: "Try Again",
	// 					status: false,
	// 					err
	// 				});
	// 			}
	// 		}
	// 	}
	// });

}

const convert = async (req,res) => {
	try {
		console.log(req.files[0].path);
		var resourcesFolder =req.files[0].path;
		fs.readFile(resourcesFolder, (err, fileStream) => {
			// construct FileApi
			var fileApi = GroupDocs.FileApi.fromConfig(config);
			// create upload file request
			var request = new GroupDocs.UploadFileRequest("sample.pdf", fileStream, myStorage);
			// upload file
			fileApi.uploadFile(request);
		});


		// initialize api
		let convertApi = GroupDocs.ConvertApi.fromKeys(clientId, clientSecret);
		console.log("Document1");
		// define convert settings
		let settings = new GroupDocs.ConvertSettings();
		settings.filePath = "sample.pdf"; // input file path on the cloud
		settings.format = "docx";         // output format
		settings.outputPath = "PTW";   // output file folder on the cloud

		// create convert document request
		let request = new GroupDocs.ConvertDocumentRequest(settings);
		console.log("Document1.1");
		// convert document
		console.log(request);
		let result = await  convertApi.convertDocument(request);
		console.log("request");
		console.log("Document converted successfully: " + result[0].url);
		console.log("Document2");


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
		console.log("Document3");
		// download file
		console.log(request);
		let response = await fileApi.downloadFile(request);
		console.log("Document4");
		console.log(response);
		var filename = `./imges_uploads/${Date.now()}new.docx`
		// fs.writeFile("C:\\Files\\sample.docx", response, "binary", function (err) { });
		fs.writeFile(filename, response, "binary", function (err) { });
		// save file in your working directory
		console.log(response);

		sql.query(`CREATE TABLE IF NOT EXISTS public.pdftodoc (
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
	
					const query = `INSERT INTO "pdftodoc" (id,userid,fileurl , createdAt ,updatedAt )
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
	// await PDFNet.addResourceSearchPath('./');

	// // check if the module is available
	// if (!(await PDFNet.StructuredOutputModule.isModuleAvailable())) {
	//   return;
	// }

	// await PDFNet.Convert.fileToWord('/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/file.pdf', 'output.docx');


	//   }

	//   PDFNet.runWithCleanup(main, 'YOUR_LICENSE_KEY');

	// 	var wordBuffer = fs.readFileSync("./x`.docx")

	// 	toPdf(wordBuffer).then(
	// 	  (pdfBuffer) => {
	// 		fs.writeFileSync("./test.docx", pdfBuffer)
	// 	  }, (err) => {
	// 		console.log(err)
	// 	  }
	// 	)


	// const ext = '.pdf'
	// const inputPath = path.join('/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/file.docx');
	// console.log("inputPath")
	// console.log(inputPath)
	// const outputPath = path.join(`./example${ext}`);
	// const docxBuf = await fs.readFile(inputPath);
	// // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
	// let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);

	// // Here in done you have pdf file which you can save or transfer in another stream
	// await fs.writeFile(outputPath, pdfBuf);
	// // console.log(pdfBuf)

	// console.log('file upload3')
	// docxConverter('/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/file.docx', "./out.pdf", function (err, result) {
	// 	if (err) {
	// 		res.json({
	// 			status: false,
	// 			message: "file not converted successfully"
	// 		})
	// 	} else {

	// 		res.status(200).send({
	// 			'Content-Type': 'application/pdf',
	// 			'Content-Disposition': 'attachment; filename=(./out.pdf)',
	// 			'Content-Transfer-Encoding': 'Binary'
	// 		});
	// 		// res.send(
	// 		// 	'true',
	// 		// 	{
	// 		// 		'Content-Type': 'application/pdf',
	// 		// 		'Content-Disposition': 'attachment; filename=(./out.pdf)',
	// 		// 		'Content-Transfer-Encoding': 'Binary'
	// 		// 	},
	// 		// )
	// 		console.log(result);
	// 	}

	// })

}

// pdfToDoc.ViewHiddenpdfToDocUser = (req, res) => {
// 	sql.query(`SELECT * FROM "pdfToDoc" WHERE status = $1 AND userid = $2`, ['hide', req.params.id], (err, result) => {
// 		if (err) {
// 			res.json({
// 				message: "Try Again",
// 				status: false,
// 				err
// 			});
// 		} else {
// 			res.json({
// 				message: "Link Details",
// 				status: true,
// 				result: result.rows
// 			});
// 		}
// 	});
// }



module.exports = pdfToDoc;
