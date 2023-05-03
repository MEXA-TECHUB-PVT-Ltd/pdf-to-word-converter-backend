const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const admin = function (admin) {
	this.name = admin.name;
	this.email = admin.email;
	this.password = admin.password;
};
admin.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.admin (
        id SERIAL NOT NULL,
		name text,
		email text ,
        password text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id))  ` , async (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			if (!req.body.email || req.body.email === '') {
				res.json({
					message: "Please Enter your Email",
					status: false,
				});
			} else if (!req.body.password) {
				res.json({
					message: "Please Enter Password",
					status: false,
				});
			} else {
				const check = (`SELECT * FROM "admin" WHERE email = $1`);
				const checkResult = await sql.query(check,[req.body.email]);
				if (checkResult.rows.length > 0) {
					res.json({
						message: "admin Already Exists",
						status: false,
					});
				} else if (checkResult.rows.length === 0) {
					const salt = await bcrypt.genSalt(10);
					let hashpassword = await bcrypt.hash(req.body.password, salt);
					const { name, email} = req.body;
					const query = `INSERT INTO "admin" (id,name,email,password  , createdat ,updatedat )
                            VALUES (DEFAULT, $1, $2, $3, 'NOW()' ,'NOW()' ) RETURNING * `;
					const foundResult = await sql.query(query,
						[name, email, hashpassword]);
					if (foundResult.rows.length > 0) {
						if (err) {
							res.json({
								message: "Try Again",
								status: false,
								err
							});
						}
						else {
							const token = jwt.sign({ id: foundResult.rows[0].id }, 'IhTRsIsUwMyHAmKsA', {
								expiresIn: "7d",
							});
							res.json({
								message: "admin Added Successfully!",
								status: true,
								result: foundResult.rows,
								token: token
							});
						}
					} else {
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					}

				};
			}
		}
	});

}

admin.login = async function (req, res) {
	sql.query(`SELECT * FROM "admin" WHERE email = $1`, [req.body.email], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		}
		else {
			if (result.rows.length === 0) {
				res.json({
					message: "admin Not Found",
					status: false,
				});
			} else {
				if (bcrypt.compareSync(req.body.password, result.rows[0].password)) {
					const token = jwt.sign({ id: result.rows[0].id }, 'IhTRsIsUwMyHAmKsA', {
						expiresIn: "7d",
					});
					res.json({
						message: "Login Successful",
						status: true,
						result: result.rows,
						token
					});
				} else {
					res.json({
						message: "Invalid Password",
						status: false,
					});
				}
			}
		}
	});
}

admin.GetAllUser = (req, res) => {
	sql.query(`SELECT * FROM "user"`, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "admin Details",
				status: true,
				result: result.rows
			});
		}
	});
}

admin.BlockUnblockUser = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "Please Enter id",
			status: false,
		});
	} else {
		const data = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
		console.log(data.rows[0].status);
		if(data.rowCount === 1){
			if(data.rows[0].status === 'block'){
				sql.query(`UPDATE "user" SET status = $1 WHERE id = $2;`, [ 'unblock', req.body.id], async (err, result) => {
					if (err) {
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else 
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
							res.json({
								message: "User Updated Successfully!",
								status: true,
								result: data.rows,
							});
						} else if (result.rowCount === 0) {
							res.json({
								message: "Not Found",
								status: false,
							});
						}
				});
			}else if(data.rows[0].status === 'unblock'){
				sql.query(`UPDATE "user" SET status = $1 WHERE id = $2;`, ['block', req.body.id], async (err, result) => {
					if (err) {
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
							res.json({
								message: "User Updated Successfully!",
								status: true,
								result: data.rows,
							});
						} else if (result.rowCount === 0) {
							res.json({
								message: "Not Found",
								status: false,
							});
						}
					}
				});
		
			}
		}else{
			res.json({
				message: "Not Found",
				status: false,
			});
		}
	}
}



admin.GetUserByID = (req, res) => {
	sql.query(`SELECT * FROM "user" WHERE  id = $1`, [req.params.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "admin Details",
				status: true,
				result: result.rows
			});
		}
	});
}

admin.resetPassword = async function (req, res) {
	const { email, password, newPassword } = req.body;
	// const hashPassword = await bcrypt.hash(newPassword, salt);
	// const oldpassword = await bcrypt.hash(password, salt);
	sql.query(`SELECT * FROM "admin" WHERE email = $1`, [email], async (err, results) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		}
		else {
			if (results.rows.length == 0) {
				res.json({
					message: "admin Not Found",
					status: false,
				});
			} else {
				if (bcrypt.compareSync(req.body.password, results.rows[0].password)) {
					const salt = await bcrypt.genSalt(10);
					const hashPassword = await bcrypt.hash(newPassword, salt);
					sql.query(`UPDATE "admin" SET password = $1 WHERE id = $2`, [hashPassword, results.rows[0].id], (err, result) => {
						if (err) {
							console.log(err);
							res.json({
								message: "Try Again",
								status: false,
								err
							});
						}
						else {
							res.json({
								message: "Password Changed Successfully",
								status: true,
								results: results.rows
							});
						}
					})
				}
				else {
					res.json({
						message: "Incorrect Password",
						status: false,
					});
				}

			}
		}
	});

}

admin.newPassword = async (req, res) => {
	try {
		const email = req.body.email;
		const found_email_query = 'SELECT * FROM otp WHERE email = $1 AND status = $2'
		const result = await sql.query(found_email_query, [email, 'verified'])
		if (result.rowCount > 0) {
			const salt = await bcrypt.genSalt(10);
			let hashpassword = await bcrypt.hash(req.body.password, salt);
			let query = `UPDATE "admin" SET password = $1  WHERE email = $2 RETURNING*`
			let values = [hashpassword, email]
			let updateResult = await sql.query(query, values);
			updateResult = updateResult.rows[0];
			console.log(result.rows);
			sql.query(`DELETE FROM otp WHERE id = $1;`, [result.rows[0].id], (err, result) => { });
			res.json({
				message: "Password changed",
				status: true,
				result: updateResult
			})
		}
		else {
			res.json({
				message: "Email Not Found ",
				status: false
			})
		}
	}
	catch (err) {
		console.log(err)
		res.status(500).json({
			message: `Internal server error occurred`,
			success: false,
		});
	}
}



module.exports = admin;