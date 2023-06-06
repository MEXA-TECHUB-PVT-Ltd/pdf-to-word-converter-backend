const { sql } = require("../config/db.config");
// s// const { nanoid } = require('nanoid');
// const validateUrl = require('../utils/utils');
// var docxConverter = require('docx-pdf');
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
const path = require('path');
// var toPdf = require("custom-soffice-to-pdf")
const fs = require('fs').promises;

const docToPdf = function (docToPdf) {
	this.userid = docToPdf.userid;
	this.fileurl = docToPdf.fileurl;
};
docToPdf.docToPdf = async (req, res) => {
	console.log(req.files);
	if (!req.files) {
		res.json({
			status: false,
			message: 'please select a file'
		})
	} else {
		if (req.files[0].originalname.endsWith('docx') || req.files[0].originalname.endsWith('doc')) {
			console.log(req.files.length)
			if (req.files.length > 1) {
				for (let i = 0; i < req.files.length; i++) {
					fs.unlink(req.files[i].path, (err) => {
						if (err) {
							throw err;
						}
						console.log("Delete File successfully.");
					});
				}			
				res.json({
					status: false,
					message: 'Select Single File'
				})	
			} else {
				convert(req, res);
			}
		} else {
			for (let i = 0; i < req.files.length; i++) {
				fs.unlink(req.files[i].path, (err) => {
					if (err) {
						throw err;
					}
					console.log("Delete File successfully.");
				});
			}		
			res.json({
				status: false,
				message: 'Select Docx Or Doc File'
			})
		}
	}

}

const convert = async (req, res) => {
	const ext = '.pdf'
	const inputPath = path.join(req.files[0].path);
	console.log("inputPath")
	console.log(inputPath)
	const outputPath = path.join(`imges_uploads/${Date.now()}new${ext}`);
	const docxBuf = await fs.readFile(inputPath);
	// Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
	let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
	var filename = ``

	// Here in done you have pdf file which you can save or transfer in another stream
	await fs.writeFile(outputPath, pdfBuf);
	console.log(pdfBuf)

	for (let i = 0; i < req.files.length; i++) {
		fs.unlink(req.files[i].path, (err) => {
			if (err) {
				throw err;
			}
			console.log("Delete File successfully.");
		});
	}
	sql.query(`CREATE TABLE IF NOT EXISTS public.pdf (
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

				const query = `INSERT INTO pdf (id,userid,fileurl , createdAt ,updatedAt )
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



}


module.exports = docToPdf;