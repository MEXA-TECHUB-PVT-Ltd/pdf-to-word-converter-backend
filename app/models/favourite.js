const {sql} = require("../config/db.config");

const favourite = function (favourite) {
	this.userID = favourite.userID
	this.docID = favourite.docID;
};

favourite.addPdfInFav = async (req, res) => {
	if (!req.body.userID || req.body.userID === '') {
		res.json({
			message: "Please Enter userID",
			status: false,
		});
	} else if (!req.body.docID) {
		res.json({
			message: "Please Enter docID",
			status: false,
		});
	} else {
		sql.query(`CREATE TABLE IF NOT EXISTS public.favpdf (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        docid SERIAL NOT NULL,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id))  ` , (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				sql.query(`INSERT INTO favpdf (id, userid , docid, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, 'NOW()', 'NOW()') RETURNING * `
							,[req.body.userID, req.body.docID], (err, result) => {
					if (err) {
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					}
					else {
						res.json({
							message: "PDF added to Fav Successfully!",
							status: true,
							result: result.rows,
						});
					}

				})

			};
		});
	}
}
favourite.viewAllPdfInFav = (req, res) => {
	sql.query(`SELECT "pdf".* FROM "favpdf" JOIN "pdf" 
	ON "favpdf".docid = "pdf".id  WHERE "favpdf".userid = $1 ORDER BY "createdat" DESC;`,[req.body.userID], (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Fav PDF Details",
				status: true,
				result: result.rows,
			});
		}
	});

}
favourite.deletePdfInFav = async (req, res) => {
	const data = await sql.query(`select * from favpdf where id = ${req.params.id}`);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM favpdf WHERE id = ${req.params.id};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Pdf Remove Deleted Successfully!",
					status: true,
					result: data.rows,

				});
			}
		});
	} else {
		res.json({
			message: "Not Found",
			status: false,
		});
	}
}

favourite.addWordInFav = async (req, res) => {
	if (!req.body.userID || req.body.userID === '') {
		res.json({
			message: "Please Enter userID",
			status: false,
		});
	} else if (!req.body.docID) {
		res.json({
			message: "Please Enter docID",
			status: false,
		});
	} else {
		sql.query(`CREATE TABLE IF NOT EXISTS public.favword (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        docid SERIAL NOT NULL,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id))  ` , (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				sql.query(`INSERT INTO favword (id, userid , docid, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, 'NOW()', 'NOW()') RETURNING * `
							,[req.body.userID, req.body.docID], (err, result) => {
					if (err) {
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					}
					else {
						res.json({
							message: "Word added to Fav Successfully!",
							status: true,
							result: result.rows,
						});
					}

				})

			};
		});
	}
}
favourite.viewAllWordInFav = (req, res) => {
	sql.query(`SELECT "pdf".* FROM "favword" JOIN "pdf"
	 ON "favword".docid = "pdf".id  WHERE "favword".userid = $1 ORDER BY "createdat" DESC;`,[req.body.userID], (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Fav word Details",
				status: true,
				result: result.rows,
			});
		}
	});

}
favourite.deleteWordInFav = async (req, res) => {
	const data = await sql.query(`select * from favword where id = ${req.params.id}`);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM favword WHERE id = ${req.params.id};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Word Remove from Fav Successfully!",
					status: true,
					result: data.rows,

				});
			}
		});
	} else {
		res.json({
			message: "Not Found",
			status: false,
		});
	}
}

module.exports = favourite;