//imports
const { sql } = require("../config/db.config");
const path = require('path');
// const fs = require('fs').promises;
const PDFMerger = require('pdf-merger-js');
const Processor = require('encrypt-decrpt-pdf').PDFProcessor;
const PDFWatermark = require('pdf-watermark');
const mammoth = require('mammoth');
const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module');
const officegen = require('officegen');
const fs = require('fs');


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
		} else if (result.rowCount === 1) {
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
					else {
						res.json({
							status: false,
							message: "Already encrypted, First Remove Encryption",
						})
						console.log(data)
					}
				})
				.catch(err => {
					if (err.error === false) {
						res.json({
							status: true,
							message: "Pdf File Encrypted Successfully",
							result: result.rows
						})
						console.log(err)
					} else {
						res.json({
							status: false,
							message: err.message,
						})
						console.log(err)
					}
				});
		} else {
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
		} else if (result.rowCount === 1) {
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
					else {
						res.json({
							status: false,
							message: 'invalid password',
						})
						console.log(data)
					}
				})
				.catch(err => {
					console.log(err)
					if (err.error === false) {
						res.json({
							status: true,
							message: "Pdf File Decrypt Successfully",
							result: result.rows
						})
						console.log(err)
					} else {
						res.json({
							status: false,
							message: err.message,
						})
						console.log(err)
					}
				});
		} else {
			res.json({
				status: false,
				message: 'No File Exists',
			})
		}
	});
	// convert(req, res);
}


pdf.AddWatermark = async (req, res) => {
	console.log(req.files);
	const sourceFilePath = path.resolve(req.files[0].path);
	// const sourceFilePath = path.resolve(req.files[0].path);
	const outputFilePath = `imges_uploads/${Date.now()}new.pdf`
	console.log(outputFilePath);
	// Watermark text


	await PDFWatermark({
		pdf_path: sourceFilePath,
		// image_path: "./everest.png",
		text: "Converted using Doc Megician",
		output_dir: outputFilePath, // remove to override file
		textOption: {
			size: 32,
			x: 100,
			y: 20,
			diagonally: true
		},
	});
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
			const { userID } = req.body;

			const query = `INSERT INTO pdf (id,userid,fileurl , createdAt ,updatedAt )
	                        VALUES (DEFAULT, $1, $2 ,  'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[userID, outputFilePath]);
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
						message: "Watermark Added to PDF Successfully!",
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

	});


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
				let mergedFiles = `imges_uploads/${Date.now()}new.pdf`
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
	sql.query(`SELECT "pdf".*, "user".username AS Uname FROM "pdf" JOIN "user" ON "user".id = "pdf".userid ;`, (err, result) => {
		if (err) {
			console.log(err);
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
// mergepdf
// word
// sql.query(`SELECT "pdf".fileurl AS PDF_File, "mergepdf".fileurl AS Merged_PDF,
// "word".fileurl AS Word_File, "imagepdf".fileurl AS Images_PDF,
// "user".username AS Uname FROM "pdf" JOIN "user" ON "user".id = "pdf".userid 
// JOIN "mergepdf" ON "user".id = "mergepdf".userid JOIN "word" ON "user".id = "word".userid 
// JOIN "imagepdf" ON "user".id = "imagepdf".userid `, (err, result) => {

// imagepdf
pdf.getAllFiles = async (req, res) => {
	const PDF = await sql.query(`SELECT fileurl AS PDF  FROM "pdf"`)
	const mergepdf = await sql.query(`SELECT fileurl AS MergedPDF  FROM "mergepdf"`)
	const word = await sql.query(`SELECT fileurl AS Word  FROM "word"`)
	const imagepdf = await sql.query(`SELECT fileurl AS ImagePDF  FROM "imagepdf"`)
	res.json({
		message: "ALL FILES",
		status: true,
		PDF: PDF.rows,
		mergepdf: mergepdf.rows,
		word: word.rows,
		imagepdf: imagepdf.rows
	});

}



pdf.getAllMergedPDF = (req, res) => {
	sql.query(`SELECT "mergepdf".*, "user".username AS Uname FROM "mergepdf" JOIN "user" ON "user".id = "mergepdf".userid ;`, (err, result) => {
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

pdf.getAllPDFCount = (req, res) => {
	sql.query(`SELECT COUNT(*) FROM "pdf";`, (err, result) => {
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


pdf.getAllMergedPdfYear = (req, res) => {
	sql.query(`SELECT EXTRACT(year FROM  createdat) AS year
	FROM "mergepdf" 
	GROUP BY EXTRACT(year FROM createdat )
	ORDER BY year `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Merged Pdf years",
				status: true,
				result: result.rows,
			});
		}
	});

}

pdf.getAllPdfYear = (req, res) => {
	sql.query(`SELECT EXTRACT(year FROM  createdat) AS year
	FROM "pdf" 
	GROUP BY EXTRACT(year FROM createdat )
	ORDER BY year `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Word to pdf years",
				status: true,
				result: result.rows,
			});
		}
	});

}



pdf.getAllPdf_MonthWise_count = (req, res) => {
	// sql.query(`SELECT date_trunc('Month', createdat) AS month, count(*) AS count
	// FROM mergepdf
	// GROUP BY 1
	// ORDER BY 1`, (err, result) => {
	console.log(req.body.year);
	sql.query(`SELECT EXTRACT(month FROM  createdat) AS month, COUNT(*) AS count
	FROM "pdf" Where EXTRACT(year FROM createdat ) = $1
	GROUP BY EXTRACT(month FROM createdat )
	ORDER BY month `, [req.body.year], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Monthly added Word to pdf",
				status: true,
				result: result.rows,
			});
		}
	});

}


pdf.getMergedPdf_MonthWise_count = (req, res) => {
	// sql.query(`SELECT date_trunc('Month', createdat) AS month, count(*) AS count
	// FROM mergepdf
	// GROUP BY 1
	// ORDER BY 1`, (err, result) => {
	sql.query(`SELECT EXTRACT(month FROM  createdat) AS month, COUNT(*) AS count
	FROM mergepdf Where EXTRACT(year FROM createdat ) = $1
	GROUP BY EXTRACT(month FROM createdat )
	ORDER BY month`, [req.body.year], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Monthly added Merged pdf",
				status: true,
				result: result.rows,
			});
		}
	});

}



pdf.getAllMergedPDFCount = (req, res) => {
	sql.query(`SELECT COUNT(*) FROM "mergepdf";`, (err, result) => {
		if (err) {
			console.log(err);
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