
const { sql } = require("../config/db.config");
let list = [];
const imagesToPdf = require("images-to-pdf");

// var im = require('imagemagick');
// const libre = require('libreoffice-convert');
// libre.convertAsync = require('util').promisify(libre.convert);
// const path = require('path');
// const fs = require('fs').promises;

// const {exec}  = require('child_process');
// const outputPathfile = Date.now()+ `example.pdf`;
// const imgToPDF = require('image-to-pdf')
// const ImagesToPDF = require('node-images-to-pdf').default

const ImgToPdf = function (ImgToPdf) {
	this.userid = ImgToPdf.userid;
	this.fileurl = ImgToPdf.fileurl;
};

ImgToPdf.ImgToPdf = async (req, res) => {
	console.log('file upload 1')
	console.log(req.files);
	// for (let i = 0; i < req.files.pdf.length; i++) {
	// 	req.files.pdf[i].mv(`/Users/mac/Desktop/PTWC/PTWC_Backend/imges_uploads/${req.files.pdf[i].name}`
	// 		, function (err) {
	// 			console.log('file upload')
	// 			if (err) {
	// 				console.log('file upload failed')
	// 				res.json({
	// 					status: false,
	// 					message: "file not converted successfully"
	// 				})
	// 			} else {
	// 				console.log('file upload' + [i]);
	// 				console.log(req.files.pdf[i].name)
	// 			}
	// 		})

	// }
	convert(req, res);
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
	console.log("list");
	console.log(list);
	var filename = `./imges_uploads/${Date.now()}new.pdf`
	await imagesToPdf(list, filename)
	// for (let i = 0; i < req.files.pdf.length; i++) {
	// 	fs.unlink(`/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/${req.files.pdf[i].name}`, (err) => {
	// 		if (err) {
	// 			throw err;
	// 		}
	// 		console.log("Delete File successfully.");
	// 	});
	// }
	sql.query(`CREATE TABLE IF NOT EXISTS public.imgtopdf (
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

				const query = `INSERT INTO "imgtopdf" (id,userid,fileurl , createdAt ,updatedAt )
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


	// const instance = new ImagesToPDF({
	// 	outputPath: `imageToPDF`
	//   })

	//   await instance.toPDF({
	// 	name: Date.now()+ '.pdf',
	// 	pdf: {
	// 	//   width: 520,
	// 	//   height: 1000
	// 	},
	// 	images: 
	// 	// list
	// 	[
	// 		'https://img.freepik.com/free-photo/closeup-focused-shot-branch-wheat-with-bright-background_181624-4872.jpg',
	// 		'img3.png',
	// 		'./img3.png',
	// 		'/models/img3.png',
	// 		'./img3.png',
	// 		'/img3.png',
	// 		'img3',
	// 		'../img3.png',
	// 		'/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/download.jpeg',
	// 		'https://img.freepik.com/free-photo/closeup-focused-shot-branch-wheat-with-bright-background_181624-4872.jpg',
	// 		'/Users/mac/Desktop/PTWC/PTWC_Backend/app/models/docx/download.jpeg',
	// 		'https://img.freepik.com/free-photo/closeup-focused-shot-branch-wheat-with-bright-background_181624-4872.jpg',
	// 		'https://img.freepik.com/free-photo/closeup-focused-shot-branch-wheat-with-bright-background_181624-4872.jpg',
	// 		'https://images.unsplash.com/photo-1533450718592-29d45635f0a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8anBnfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
	// 		'../docx/download (1).jpeg']

	//   })


	// const pages = [
	// 	list, // path to the image
	// 	"data:image/png;base64,iVBORw...", // base64
	// 	fs.readFile(list) // Buffer
	// ]

	// imgToPDF(pages, imgToPDF.sizes.A4)
	// .pipe(fs.createWriteStream('output.pdf'))

	// await imagesToPdf(['PTWC_Backend/app/models/docx/images.png'],'out.pdf');

	// im.identify(`magick convert ${list}${outputPathfile}`, (err,stdout, stderr) => {
	// 	if(err) {
	// 		console.log(err);
	// 		res.json(err)
	// 	} else{
	// 		res.download(outputPathfile,(err)=>{
	// 			if(err){
	// 				console.log(err);
	// 				res.json(err)
	// 			}
	// 		})
	// 	}
	// });

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


module.exports = ImgToPdf;
