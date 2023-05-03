const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { nanoid } = require('nanoid');
const validateUrl = require('../utils/utils');
var docxConverter = require('docx-pdf');
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
const path = require('path');
var toPdf = require("custom-soffice-to-pdf")
const fs = require('fs').promises;

const docToPdf = function (docToPdf) {
	this.userid = docToPdf.userid;
	this.fileurl = docToPdf.fileurl;
};
docToPdf.docToPdf = async (req, res) => {
	console.log(req.files.pdf);
	if(!req.files){
		res.json({
			status:false,
			message:'please select a file'
	})
	}
	console.log('file upload 1')
	
	// req.files.pdf.mv('/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/file.docx', function (err) {
	// 	console.log('file upload')
	// 	if (err) {
	// 		console.log('file upload failed')
	// 		res.json({
	// 			status: false,
	// 			message: "file not converted successfully"
	// 		})
	// 	} else {
	// 		console.log('file uploaded ')
			convert(req, res);

	// 	}

	// })

}

const convert = async ( req, res) => {
	const ext = '.pdf'
	const inputPath = path.join(req.files[0].path);
	console.log("inputPath")
	console.log(inputPath)
	const outputPath = path.join(`./imges_uploads/${Date.now()}new${ext}`);
	const docxBuf =  await fs.readFile(inputPath);
	// Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
	let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
	var filename = ``

	// Here in done you have pdf file which you can save or transfer in another stream
	await fs.writeFile(outputPath, pdfBuf);
	console.log(pdfBuf)
	sql.query(`CREATE TABLE IF NOT EXISTS public.doctopdf (
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

				const query = `INSERT INTO doctopdf (id,userid,fileurl , createdAt ,updatedAt )
	                        VALUES (DEFAULT, $1, $2 ,  'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[userID, outputPath]);
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
							message: "doc To Pdf Added Successfully!",
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

	// console.log('file upload3')
	// docxConverter('/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/file.docx', "./out.pdf", function (err, result) {
	// 	if (err) {
	// 		res.json({
	// 			status: false,
	// 			message: "file not converted successfully"
	// 		})
	// 	} else {

	// 		res.status(200).send({
				// 'Content-Type': 'application/pdf',
				// 'Content-Disposition': 'attachment; filename=(./out.pdf)',
				// 'Content-Transfer-Encoding': 'Binary'
			// });
			// res.send(
			// 	'true',
			// 	{
			// 		'Content-Type': 'application/pdf',
			// 		'Content-Disposition': 'attachment; filename=(./out.pdf)',
			// 		'Content-Transfer-Encoding': 'Binary'
			// 	},
			// )
			// console.log(result);
		// }
// 
	// })

}


module.exports = docToPdf;

// 		// console.log('file upload 1')
// 		// for (let i = 0; i < req.files.pdf.length; i++) {
// 		// 	req.files.pdf[i].mv('/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/file'+i+'.png', function (err) {
// 		// 		console.log('file upload')
// 		// 		if (err) {
// 		// 			console.log('file upload failed')
// 		// 			res.json({
// 		// 				status: false,
// 		// 				message: "file not converted successfully"
// 		// 			})
// 		// 		} else {
// 		// 			console.log('file uploaded successfully')
// 		// 		}
// 		// 	})
	
// 		// }





// const { sql } = require("../config/db.config");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { nanoid } = require('nanoid');
// const validateUrl = require('../utils/utils');
// var docxConverter = require('docx-pdf');
// const libre = require('libreoffice-convert');
// libre.convertAsync = require('util').promisify(libre.convert);
// const path = require('path');
// var toPdf = require("custom-soffice-to-pdf")
// var fs = require("fs")

// const docToPdf = function (docToPdf) {
// 	this.userID = docToPdf.userID;
// 	this.title = docToPdf.title;
// 	this.urlId = docToPdf.urlId;
// 	this.link = docToPdf.link;
// 	this.shortenLink = docToPdf.shortenLink;
// 	this.status = docToPdf.status;
// };
// docToPdf.docToPdf = async (req, res) => {

	
// 	console.log(req.files.pdf);


// 	console.log('file upload 1')
	
// 	req.files.pdf.mv('/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/file.pdf', function (err) {
// 		console.log('file upload')
// 		if (err) {
// 			console.log('file upload failed')
// 			res.json({
// 				status: false,
// 				message: "file not converted successfully"
// 			})
// 		} else {
// 			console.log('file uploaded ')
// 		}


// 		// console.log('file upload 1')
// 		// for (let i = 0; i < req.files.pdf.length; i++) {
// 		// 	req.files.pdf[i].mv('/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/file'+i+'.png', function (err) {
// 		// 		console.log('file upload')
// 		// 		if (err) {
// 		// 			console.log('file upload failed')
// 		// 			res.json({
// 		// 				status: false,
// 		// 				message: "file not converted successfully"
// 		// 			})
// 		// 		} else {
// 		// 			console.log('file uploaded successfully')
// 		// 		}
// 		// 	})
	
// 		// }

// 	})
// 	convert(req.files.pdf.name, req, res);
// 	// sql.query(`CREATE TABLE IF NOT EXISTS public.docToPdf (
// 	//     id SERIAL NOT NULL,
// 	// 	userID SERIAL NOT NULL,
// 	// 	title text ,
// 	//     urlId text ,
// 	//     link text,
// 	// 	shortenLink text,
// 	// 	status text,
// 	//     createdAt timestamp,
// 	//     updatedAt timestamp ,
// 	//     PRIMARY KEY (id))  ` , async (err, result) => {
// 	// 	if (err) {
// 	// 		res.json({
// 	// 			message: "Try Again",
// 	// 			status: false,
// 	// 			err
// 	// 		});
// 	// 	} else {
// 	// 		if (!req.body.link) {
// 	// 			res.json({
// 	// 				message: "Please Enter link",
// 	// 				status: false,
// 	// 			});
// 	// 		} else {
// 	// 			const { userID, title, link, status } = req.body;
// 	// 			const urlId = nanoid();
// 	// 			const shortUrl = `https://staging-bitly-be.mtechub.com/${urlId}`

// 	// 			const query = `INSERT INTO "docToPdf" (id,userID,title,urlId ,link, shortenLink, status , createdAt ,updatedAt )
// 	//                         VALUES (DEFAULT, $1, $2, $3, $4  , $5 , $6 ,  'NOW()','NOW()' ) RETURNING * `;
// 	// 			const foundResult = await sql.query(query,
// 	// 				[userID, title, urlId, link, shortUrl, status]);
// 	// 			if (foundResult.rows.length > 0) {
// 	// 				if (err) {
// 	// 					res.json({
// 	// 						message: "Try Again",
// 	// 						status: false,
// 	// 						err
// 	// 					});
// 	// 				}
// 	// 				else {
// 	// 					res.json({
// 	// 						message: "docToPdf Added Successfully!",
// 	// 						status: true,
// 	// 						result: foundResult.rows,
// 	// 					});
// 	// 				}
// 	// 			} else {
// 	// 				res.json({
// 	// 					message: "Try Again",
// 	// 					status: false,
// 	// 					err
// 	// 				});
// 	// 			}
// 	// 		}
// 	// 	}
// 	// });

// }

// const convert = async (file, req, res) => {
// 	const ext = '.pdf'
// 	const inputPath = path.join('/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/file.docx');
// 	console.log("inputPath")
// 	console.log(inputPath)
// 	const outputPath = path.join(`./example${ext}`);
// 	console.log("inputPath2")
// 	const docxBuf = await fs.readFile(inputPath);
// 		console.log("inputPath")

// 	// Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
// 	let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);

// 	// Here in done you have pdf file which you can save or transfer in another stream
// 	await fs.writeFile(outputPath, pdfBuf);
// 	console.log(pdfBuf)

// 	// console.log('file upload3')
// 	// docxConverter('/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/file.docx', "./out.pdf", function (err, result) {
// 	// 	if (err) {
// 	// 		res.json({
// 	// 			status: false,
// 	// 			message: "file not converted successfully"
// 	// 		})
// 	// 	} else {

// 	// 		res.status(200).send({
// 				// 'Content-Type': 'application/pdf',
// 				// 'Content-Disposition': 'attachment; filename=(./out.pdf)',
// 				// 'Content-Transfer-Encoding': 'Binary'
// 			// });
// 			// res.send(
// 			// 	'true',
// 			// 	{
// 			// 		'Content-Type': 'application/pdf',
// 			// 		'Content-Disposition': 'attachment; filename=(./out.pdf)',
// 			// 		'Content-Transfer-Encoding': 'Binary'
// 			// 	},
// 			// )
// 			// console.log(result);
// 		// }
// // 
// 	// })

// }


// module.exports = docToPdf;


