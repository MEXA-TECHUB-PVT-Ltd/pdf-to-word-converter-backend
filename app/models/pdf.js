const { sql } = require("../config/db.config");
const path = require('path');
const exec = require("child_process").exec;
const fs = require('fs').promises;
var qpdf = require('node-qpdf');
const PDFMerger = require('pdf-merger-js');

const pdf = function (pdf) {
	this.userid = pdf.userid;
	this.fileurl = pdf.fileurl;
};
pdf.lockPdf = async (req, res) => {
	if (!req.files) {
		res.json({
			status: false,
			message: 'please select a file'
		})
	} else {
		var options = {
			keyLength: 128,
			password: '123456'
		}
		qpdf.encrypt(req.files[0].path, options);
		console.log(req.files);
	}

	// convert(req, res);
}
pdf.unlockPdf = async (req, res) => {
	if (!req.files) {
		res.json({
			status: false,
			message: 'please select a file'
		})
	} else {
		console.log(req.files);
	}

	// convert(req, res);


}

pdf.mergePdf = async (req, res) => {
	if (!req.files) {
		res.json({
			status: false,
			message: 'please select a file'
		})
	} else
		var check = true;
	for (let i; i = req.files.length; i++) {
		if (!req.files[i].originalname.endsWith('pdf')) {
			check = false
		}
	}
	if (check = true) {
		var merger = new PDFMerger();
		console.log("starting merger");
		(async () => {
			for (let i = 0; i < req.files.length; i++) {
				merger.add(req.files[i].path);
			}
			console.log(merger);
			let mergedFiles = `./imges_uploads/${Date.now()}new.pdf`
			await merger.save(mergedFiles);
			//save under given name and reset the internal document
			console.log("MERGED");

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
							[userID, mergedFiles]);
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
									message: "PDF Files Merged Successfully!",
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
			for (let i = 0; i < req.files.length; i++) {
				fs.unlink(req.files[i].path, (err) => {
					if (err) {
						throw err;
					}
					console.log("Delete File successfully.");
				});
			}

		})();
	} else {
		res.json({
			status: false,
			message: 'Select pdf file'
		})
	}
}

module.exports = pdf;