const {sql} = require("../config/db.config");

const privacyPolicy = function (privacyPolicy) {
	this.title = privacyPolicy.title;
	this.content = privacyPolicy.content;;
};

privacyPolicy.AddPrivacyPolicy = async (req, res) => {
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
		sql.query(`CREATE TABLE IF NOT EXISTS public.privacyPolicys (
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
				sql.query(`INSERT INTO privacyPolicys (id, title , content, createdAt ,updatedAt )
                            VALUES (DEFAULT, '${req.body.title}'  ,  '${req.body.content}', 'NOW()', 'NOW()') RETURNING * `, (err, result) => {
					if (err) {
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					}
					else {
						res.json({
							message: "privacy Policy Added Successfully!",
							status: true,
							result: result.rows,
						});
					}

				})

			};
		});
	}
}

privacyPolicy.viewSpecificPrivacyPolicy  = (req, res) => {
	sql.query(`SELECT * FROM privacyPolicys WHERE id = ${req.body.id};`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "privacy Policy Details",
				status: true,
				result: result.rows
			});
		}
	});
}

privacyPolicy.ViewPrivacyPolicy = (req, res) => {
	sql.query(`SELECT * FROM privacyPolicys;`, (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "privacy Policy Details",
				status: true,
				result: result.rows,
			});
		}
	});

}

privacyPolicy.UpdatePrivacyPolicy = (req, res) => {
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
		sql.query(`UPDATE privacyPolicys SET title = '${req.body.title}', content = '${req.body.content}' WHERE id = ${req.body.id};`, async (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				if(result.rowCount === 1){
				const data = await sql.query(`select * from privacyPolicys where id = ${req.body.id}`);
				res.json({
					message: "privacy Policy Updated Successfully!",
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

privacyPolicy.DeletePrivacyPolicy = async (req, res) => {
	const data = await sql.query(`select * from privacyPolicys where id = ${req.params.id}`);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM privacyPolicys WHERE id = ${req.params.id};`, (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "privacy Policy Deleted Successfully!",
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
module.exports = privacyPolicy;