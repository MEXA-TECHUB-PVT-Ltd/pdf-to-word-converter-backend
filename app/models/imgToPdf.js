
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
	else if (req.files.length > 20){
		res.json({
			status: false,
			message: 'Images must be less than 20'
		})
	} else {
		let check = false;
		for (let i = 0; i < req.files.length; i++) {
			if (req.files[i].originalname.endsWith('jpg') ||
				req.files[i].originalname.endsWith('png') ||
				req.files[i].originalname.endsWith('jpeg')) {
				check = true;
			}

		}
		if (check === true) {
			convert(req, res);
		} else {
			res.json({
				status: false,
				message: 'Select jpg 0r png or jpeg file'
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



	var filename = `./imges_uploads/${Date.now()}new.pdf`
	await imagesToPdf(list, filename)

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

				const query = `INSERT INTO "pdf" (id,userid,fileurl , createdAt ,updatedAt )
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


module.exports = ImgToPdf;
