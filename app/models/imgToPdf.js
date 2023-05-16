
const { sql } = require("../config/db.config");
let list = [];
const imagesToPdf = require("images-to-pdf");
const fs = require('fs').promises;

const ImgToPdf = function (ImgToPdf) {
	this.userid = ImgToPdf.userid;
	this.fileurl = ImgToPdf.fileurl;
};

ImgToPdf.ImgToPdf = async (req, res) => {
	if (!req.files) {
		res.json({
			status: false,
			message: 'please select a file'
		})
	}
	else if (req.files.length > 20) {
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
			message: 'Images must be less than 20'
		})
	} else {
		let check = true;
		for (let i = 0; i < req.files.length; i++) {
			if (req.files[i].originalname.endsWith('jpg')) {

			} else if (req.files[i].originalname.endsWith('png')) {

			} else if (req.files[i].originalname.endsWith('jpeg')) {

			} else {
				check = false;
			}
		}
		if (check === true) {
			convert(req, res);
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
				message: 'Select jpg or png or jpeg file'
			})

		}
	}
}


const convert = async (req, res) => {
	list = [];
	if (req.files) {
		for (let i = 0; i < req.files.length; i++) {
			console.log(req.files[i].path);
			list[i] = `${req.files[i].path}`;
			// list[i] = `/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/${req.files.pdf[i].name}`;
		}
	}
	var filename = `imges_uploads/${Date.now()}new.pdf`
	await imagesToPdf(list, filename)

	for (let i = 0; i < req.files.length; i++) {
		fs.unlink(req.files[i].path, (err) => {
			if (err) {
				throw err;
			}
			console.log("Delete File successfully.");
		});
	}
	sql.query(`CREATE TABLE IF NOT EXISTS public.imagepdf (
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

				const query = `INSERT INTO "imagepdf" (id,userid,fileurl , createdAt ,updatedAt )
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

}


ImgToPdf.getAllImgToPdfYear = (req, res) => {
	sql.query(`SELECT EXTRACT(year FROM  createdat) AS year
	FROM "imagepdf" 
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
				message: "Images to pdf years",
				status: true,
				result: result.rows,
			});
		}
	});

}



ImgToPdf.getAllImgPdf_MonthWise_count = (req, res) => {
	// sql.query(`SELECT date_trunc('Month', createdat) AS month, count(*) AS count
	// FROM mergepdf
	// GROUP BY 1
	// ORDER BY 1`, (err, result) => {
	sql.query(`SELECT EXTRACT(month FROM  createdat) AS month, COUNT(*) AS count
	FROM imagepdf  Where EXTRACT(year FROM createdat ) = $1
	GROUP BY EXTRACT(month FROM createdat )
	ORDER BY month`,[req.body.year], (err, result) => {
	if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Monthly added Images to PDF File",
				status: true,
				result: result.rows,
			});
		}
	});

}



ImgToPdf.getAllImagePdf = (req, res) => {
	sql.query(`SELECT "imagepdf".*, "user".username AS Uname FROM "imagepdf" JOIN "user" ON "user".id = "imagepdf".userid ;`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "ALL Images to  PDF FILES",
				status: true,
				result: result.rows,
			});
		}
	});

}

ImgToPdf.getAllImagePdfCount = (req, res) => {
	sql.query(`SELECT COUNT(*) FROM "imagepdf";`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "ALL Images to PDF FILES",
				status: true,
				result: result.rows,
			});
		}
	});

}


module.exports = ImgToPdf;
