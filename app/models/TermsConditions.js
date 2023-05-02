const {sql} = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const TermsConditions = function (TermsConditions) {
	this.title = TermsConditions.title;
	this.content = TermsConditions.content;;
};

TermsConditions.AddTermsConditions = async (req, res) => {
	if (!req.body.title || req.body.title === '') {
		res.json({
			message: "Please Enter your title",
			status: false,
		});
	} else if (!req.body.content) {
		res.json({
			message: "Please Enter content",
			status: false,
		});
	} else {
		sql.query(`CREATE TABLE IF NOT EXISTS public.TermsConditions (
        id SERIAL,
        title text NOT NULL,
        content text,
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
				sql.query(`INSERT INTO TermsConditions (id, title , content, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1  ,  $2, 'NOW()', 'NOW()') 
							RETURNING * `,[req.body.title, req.body.content], (err, result) => {
					if (err) {
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					}
					else {
						res.json({
							message: "Term Of Use Added Successfully!",
							status: true,
							result: result.rows,
						});
					}

				})

			};
		});
	}
}

TermsConditions.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM TermsConditions WHERE id = $1;`,[req.body.id], (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Term Of Use Details",
				status: true,
				result: result.rows
			});
		}
	});
}

TermsConditions.ViewTermsConditions = (req, res) => {
	sql.query(`SELECT * FROM TermsConditions;`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Term Of Use Details",
				status: true,
				result: result.rows,
			});
		}
	});

}

TermsConditions.UpdateTermsConditions = (req, res) => {
	if (!req.body.title || req.body.title === '') {
		res.json({
			message: "Please Enter your title",
			status: false,
		});
	} else if (req.body.content === '') {
		res.json({
			message: "Please Enter your content",
			status: false,
		});
	} else {
		sql.query(`UPDATE TermsConditions SET title = $1, content = $2 WHERE
		 id = $3;`, [req.body.title,req.body.content, req.body.id] ,async (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				if(result.rowCount === 1){	
				const data = await sql.query(`select * from TermsConditions where id = ${req.body.id}`);
				res.json({
					message: "Term Of Use Updated Successfully!",
					status: true,
					result:  data.rows,
				});
			}else if(result.rowCount === 0){
				res.json({
                    message: "Not Found",
                    status: false,
                });
			}
			}
		});
	}
}

TermsConditions.DeleteTermsConditions = async (req, res) => {
	const data = await sql.query(`select * from TermsConditions where id = ${req.params.id}`);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM TermsConditions WHERE id = $1;`,[req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Term Of Use Deleted Successfully!",
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
module.exports = TermsConditions;