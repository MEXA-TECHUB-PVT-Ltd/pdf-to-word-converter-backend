//imports
const { sql } = require("../config/db.config");
const path = require('path');
const fs = require('fs').promises;
const PDFMerger = require('pdf-merger-js');
const Processor = require('encrypt-decrpt-pdf').PDFProcessor;


const pdf = function (pdf) {
	this.userid = pdf.userid;
	this.fileurl = pdf.fileurl;
};


pdf.lockPdf = async (req, res) => {
	sql.query(`SELECT * FROM "pdf" WHERE id = ${req.body.fileID};`, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else if(result.rowCount === 1) {
			const password = req.body.password;
			const username = req.body.id;

			const processor = new Processor(password, username);
			const sourcepath = path.join(result.rows[0].fileurl);
			const destpath = '--replace-input';

			processor.encrypt(destpath, sourcepath)
				.then(data => {
					if (data.error === false) {
						res.json({
							status: true,
							message: "Pdf File Encrypted Successfully",
							result: result.rows
						})
						console.log(data)
					}
					else{
						res.json({
							status: false,
							message: "Already encrypted, First Remove Encryption",
						})
						console.log(data)
					}
				})
				.catch(err => {
					if(err.error === false){
						res.json({
							status: true,
							message: "Pdf File Encrypted Successfully",
							result: result.rows
						})
						console.log(err)
					}else{
					res.json({
						status: false,
						message: err.message,
					})
					console.log(err)
				}
				});
		}else{
			res.json({
				status: false,
				message: 'No File Exists',
			})
		}
	});
	// convert(req, res);
}

pdf.unlockPdf = async (req, res) => {
	sql.query(`SELECT * FROM "pdf" WHERE id = ${req.body.fileID};`, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else if(result.rowCount === 1) {
			const password = req.body.password;
			const username = req.body.id;

			const processor = new Processor(password, username);
			const sourcepath = path.join(result.rows[0].fileurl);
			const destpath = '--replace-input';

			processor
				.decrypt(destpath, sourcepath)
				.then(data => {
					if (data.error === false) {
						res.json({
							status: true,
							message: "Pdf File Decrypt Successfully",
							result: result.rows
						})
						console.log(data)
					}
					else{
						res.json({
							status: false,
							message: 'invalid password',
						})
						console.log(data)
					}
				})
				.catch(err => {
					console.log(err)
					if(err.error === false ){
						res.json({
							status: true,
							message: "Pdf File Decrypt Successfully",
							result: result.rows
						})
						console.log(err)
					}else{
					res.json({
						status: false,
						message: err.message,
					})
					console.log(err)
				}
				});
		}else{
			res.json({
				status: false,
				message: 'No File Exists',
			})
		}
	});
	// convert(req, res);
}

pdf.mergePdf = async (req, res) => {
	if (!req.files) {
		res.json({
			status: false,
			message: 'please select a file'
		})
	} else if (req.files.length > 20) {
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
			message: 'No more than 20 files!'
		})
	}
	else {
		var check = true;
		console.log(req.files[0].ori)
		for (let i = 0; i > req.files.length; i++) {
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
				for (let i = 0; i < req.files.length; i++) {
					fs.unlink(req.files[i].path, (err) => {
						if (err) {
							throw err;
						}
						console.log("Delete File successfully.");
					});
				}
				sql.query(`CREATE TABLE IF NOT EXISTS public.mergepdf (
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

							const query = `INSERT INTO mergepdf (id,userid,fileurl , createdAt ,updatedAt )
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
			})();
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
				message: 'Select pdf file'
			})
		}
	}
}

pdf.getAllPDF = (req, res) => {
	sql.query(`SELECT * FROM "pdf";`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "ALL PDF FILES",
				status: true,
				result: result.rows,
			});
		}
	});

}


pdf.getAllMergedPDF = (req, res) => {
	sql.query(`SELECT * FROM "mergepdf";`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "ALL Merged PDF FILES",
				status: true,
				result: result.rows,
			});
		}
	});

}







module.exports = pdf;