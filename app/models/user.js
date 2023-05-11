// module.exports = (sequelize, Sequelize) => {
// 	const User = sequelize.define("User", {
// 		username: {
// 		email: {
// 		password: {
// 		status:{

const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = function (User) {
	this.username = User.username;
	this.email = User.email;
	this.password = User.password;
	this.status = User.status;
};
User.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.User (
        id SERIAL NOT NULL,
		username text,
		email text ,
        password text ,
        status text,
		type text,
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
				const check = (`SELECT * FROM "user" WHERE email = $1`);
				const checkResult = await sql.query(check,[req.body.email]);
				if (checkResult.rows.length > 0) {
					res.json({
						message: "User Already Exists",
						status: false,
					});
				} else if (checkResult.rows.length === 0) {
					const salt = await bcrypt.genSalt(10);
					let hashpassword = await bcrypt.hash(req.body.password, salt);
					const { username, email} = req.body;
					const query = `INSERT INTO "user" (id,username,email,password ,status ,type ,createdat ,updatedat )
                            VALUES (DEFAULT, $1, $2, $3, $4 ,$5, 'NOW()','NOW()' ) RETURNING * `;
					const foundResult = await sql.query(query,
						[username, email, hashpassword, 'unblock', 'Free Account']);
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
								message: "User Added Successfully!",
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

User.login = async function (req, res) {
	sql.query(`SELECT * FROM "user" WHERE email = $1`, [req.body.email], (err, result) => {
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
					message: "User Not Found",
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


User.GooglesignIn = async function (req, res) {
	sql.query(`SELECT * FROM "user" WHERE email = $1`, [req.body.email], (err, result) => {
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
					message: "User Not Found",
					status: false,
				});
			} else {
					const token = jwt.sign({ id: result.rows[0].id }, 'IhTRsIsUwMyHAmKsA', {
						expiresIn: "7d",
					});
					res.json({
						message: "Login Successful",
						status: true,
						result: result.rows,
						token
					});
			}
		}
	});
}


User.SpecificUser = (req, res) => {
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
				message: "User Details",
				status: true,
				result: result.rows
			});
		}
	});
}

User.resetPassword = async function (req, res) {
	const { email, password, newPassword } = req.body;
	// const hashPassword = await bcrypt.hash(newPassword, salt);
	// const oldpassword = await bcrypt.hash(password, salt);
	sql.query(`SELECT * FROM "user" WHERE email = $1`, [email], async (err, results) => {
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
					message: "User Not Found",
					status: false,
				});
			} else {
				if (bcrypt.compareSync(req.body.password, results.rows[0].password)) {
					const salt = await bcrypt.genSalt(10);
					const hashPassword = await bcrypt.hash(newPassword, salt);
					sql.query(`UPDATE "user" SET password = $1 WHERE id = $2`, [hashPassword, results.rows[0].id], (err, result) => {
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
User.todaysAddedUsers = (req, res) => {
	sql.query(`SELECT MONTH('createdat')  FROM user`, (err, result) => {
		if (err) {
			console.error(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "User Details",
				status: true,
				result: result.rows
			});
		}
	});
}



User.TotalUsers = (req, res) => {
	sql.query(`SELECT  COUNT(*) FROM "user" Where status = 'unblock' `, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "User Details",
				status: true,
				result: result.rows
			});
		}
	});
}

User.AllUsers = (req, res) => {
	sql.query(`SELECT * FROM "user" Where status = 'unblock'`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "User Details",
				status: true,
				result: result.rows
			});
		}
	});
}



User.BlockUserCount = (req, res) => {
	sql.query(`SELECT  COUNT(*) FROM "user" Where status = 'block'`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "User Details",
				status: true,
				result: result.rows
			});
		}
	});
}

User.BlockUsers = (req, res) => {
	sql.query(`SELECT * FROM "user" where status = 'block' `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "User Details",
				status: true,
				result: result.rows
			});
		}
	});
}


User.SubscribedUserCount = (req, res) => {
	sql.query(`SELECT  COUNT(*) FROM "user" Where type = 'subscribed'`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "User Details",
				status: true,
				result: result.rows
			});
		}
	});
}

User.SubscribedUsers = (req, res) => {
	sql.query(`SELECT * FROM "user" where type = 'subscribed' `, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "User Details",
				status: true,
				result: result.rows
			});
		}
	});
}


// User.updateProfile = async (req, res) => {
// 	if (req.body.id === '') {
// 		res.json({
// 			message: "id is required",
// 			status: false,
// 		});
// 	} else {
// 		const userData = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
// 		const oldName = userData.rows[0].username;
// 		const oldGender = userData.rows[0].gender;
// 		const oldPhone = userData.rows[0].phone;
// 		const oldEmail = userData.rows[0].email;

// 		let { id, username, gender, phone, email } = req.body;
// 		let photo = userData.rows[0].photo;
// 		if (req.file) {
// 			const { path } = req.file;
// 			photo = path;
// 		}
// 		if (username === undefined || username === '') {
// 			username = oldName;
// 		}
// 		if (gender === undefined || gender === '') {
// 			gender = oldGender;
// 		}
// 		if (phone === undefined || phone === '') {
// 			phone = oldPhone;
// 		}
// 		if (email === undefined || email === '') {
// 			email = oldEmail;
// 		}
// 		sql.query(`UPDATE "user" SET username = $1, gender = $2, 
// 		phone = $3, profileImage = $4, email = $5  WHERE id = $6;`,
// 			[username, gender, phone, photo, email, id], async (err, result) => {
// 				if (err) {
// 					res.json({
// 						message: "Try Again",
// 						status: false,
// 						err
// 					});
// 				} else {
// 					if (result.rowCount === 1) {
// 						const data = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
// 						res.json({
// 							message: "User Updated Successfully!",
// 							status: true,
// 							result: data.rows,
// 						});
// 					} else if (result.rowCount === 0) {
// 						res.json({
// 							message: "Not Found",
// 							status: false,
// 						});
// 					}
// 				}
// 			});
// 	}
// }



User.newPassword = async (req, res) => {
	try {
		const email = req.body.email;
		const found_email_query = 'SELECT * FROM otp WHERE email = $1 AND status = $2'
		const result = await sql.query(found_email_query, [email, 'verified'])
		if (result.rowCount > 0) {
			const salt = await bcrypt.genSalt(10);
			let hashpassword = await bcrypt.hash(req.body.password, salt);
			let query = `UPDATE "user" SET password = $1  WHERE email = $2 RETURNING*`
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

User.DeleteUser = async (req, res) => {
	const data = await sql.query(`select * from "user" where id = ${req.params.id}`);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "user" WHERE id = ${req.params.id};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "User Deleted Successfully!",
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
module.exports = User;