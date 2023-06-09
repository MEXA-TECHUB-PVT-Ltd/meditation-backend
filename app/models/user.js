const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = function (User) {
	this.username = User.username;
	this.email = User.email;
	this.password = User.password;
	this.image = User.image;
	this.status = User.status;

};
User.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.User (
        id SERIAL NOT NULL,
        username text,
        email text,
		password text,
		gender text,
		level text,
		goals text[],
		age text,
		badge_id integer,
        image   text ,
        status text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));` , async (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			if (!req.body.password || req.body.password === '') {
				res.json({
					message: "Please Enter password",
					status: false,
				});
			} else if (!req.body.email || req.body.email === '') {
				res.json({
					message: "Please Enter Email",
					status: false,
				});
			} else {
				const check = (`SELECT * FROM "user" WHERE email = $1`);
				const checkResult = await sql.query(check, [req.body.email]);
				if (checkResult.rows.length > 0) {
					res.json({
						message: "User Already Exists",
						status: false,
					});
				} else if (checkResult.rows.length === 0) {
					const { username, email, password,gender,level,goals ,age,badge_id} = req.body;
					const salt = await bcrypt.genSalt(10);
					let hashpassword = await bcrypt.hash(password, salt);
					let photo = '';
					console.log(req.file)
					if (req.file) {
						const { path } = req.file;
						photo = path;
					}
		
					const query = `INSERT INTO "user" (id, username ,email,password, gender, level ,goals,age, badge_id,image, status  ,createdat ,updatedat )
                            VALUES (DEFAULT, $1, $2,$3, $4, $5 ,$6,$7,$8,$9,$10, 'NOW()','NOW()' ) RETURNING * `;
					const foundResult = await sql.query(query,
						[username, email, hashpassword, gender, level, goals, age , badge_id,photo,'unblock']);
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
							console.log(foundResult.rows);
							const query = `INSERT INTO "streak"
							(id,count, user_id ,current_date_Time,createdAt ,updatedAt )
									   VALUES (DEFAULT, $1, $2, $3,'NOW()','NOW()' ) RETURNING * `;
						   const Streak = await sql.query(query,
							   ['0', foundResult.rows[0].id, foundResult.rows[0].createdat]);
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
	sql.query(`SELECT * FROM "user"  WHERE email = $1`, [req.body.email], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		}
		else {
			if (result.rows.length == 0) {
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



User.addImage = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].image;
			// let image = userData.rows[0].image;
			// let cover_image = userData.rows[0].cover_image;

			let { id } = req.body;
			console.log(req.file)
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}

			sql.query(`UPDATE "user" SET image = $1 WHERE id = $2;`,
				[photo, id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
							res.json({
								message: "User Image added Successfully!",
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
		} else {
			res.json({
				message: "Not Found",
				status: false,
			});
		}
	}
}


User.updateProfile = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "user" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {
			let { id, username, email, status,gender, level,goals ,age, badge_id} = req.body;

			const oldName = userData.rows[0].username;
			const oldEmail = userData.rows[0].email;
			const password = userData.rows[0].password;

			const Oldgender = userData.rows[0].gender;
			const Oldlevel = userData.rows[0].level;
			const Oldgoals = userData.rows[0].goals;
			const Oldage = userData.rows[0].age;
			const Oldbadge_id = userData.rows[0].badge_id;


			const oldStatus = userData.rows[0].status;
			let photo = userData.rows[0].image;
			
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}

			if (gender === undefined || gender === '') {
				gender = Oldgender;
			}
			if (level === undefined || level === '') {
				level = Oldlevel;
			}
			if (goals === undefined || goals === '') {
				goals = Oldgoals;
			}
			if (badge_id === undefined || badge_id === '') {
				badge_id = Oldbadge_id;
			}
			if (age === undefined || age === '') {
				age = Oldage;
			}
			if (username === undefined || username === '') {
				username = oldName;
			}
			if (email === undefined || email === '') {
				email = oldEmail;
			}
			if (status === undefined || status === '') {
				status = oldStatus;
			}
			const CheckBadge = await sql.query(`select * from "check_badge" where user_id = $1`, [id]);
			if(CheckBadge.rowCount > 0){
				if(CheckBadge.rows[0].badge_id !== badge_id){
					const query = `UPDATE "check_badge" SET  badge_id = $1 , updatedat  = 'NOW()'`;
			const foundResult = await sql.query(query,[badge_id]);
				}
			}else {
				const query = `INSERT INTO "check_badge" (id, user_id ,badge_id  ,createdat ,updatedat )
				VALUES (DEFAULT, $1, $2, 'NOW()','NOW()' ) RETURNING * `;
		const foundResult = await sql.query(query,
			[id, badge_id]);
			}
			sql.query(`UPDATE "user" SET username = $1, email = $2, 
		password = $3, gender = $4, level = $5, goals = $6, age = $7, badge_id = $8,
		 image = $9 ,status = $10  WHERE id = $11;`,
				[username, email, password,gender,level,goals,age, badge_id, photo,status,id], async (err, result) => {
					if (err) {
						console.log(err);
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
		} else {
			res.json({
				message: "Not Found",
				status: false,
			});
		}
	}
}


User.SpecificUser = async (req, res) => {
	sql.query(`SELECT *  FROM "user" WHERE  id = $1`, [req.params.id], (err, result) => {
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

User.skillProgress = async (req, res) => {
	sql.query(`SELECT *  FROM "skill" WHERE  id = $1`, [req.body.id], (err, result) => {
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
User.RestartProgress = async (req, res) => {
	sql.query(`SELECT *  FROM "skill" WHERE  id = $1`, [req.body.id], (err, result) => {
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

User.AllUsers = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "user"`);
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "user" ORDER BY "createdat" DESC`);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "user" ORDER BY "createdat" DESC
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "All User Details",
			status: true,
			count: data.rows[0].count,
			result: result.rows,
		});
	} else {
		res.json({
			message: "could not fetch",
			status: false
		})
	}
}


User.resetPassword = async function (req, res) {
	const { email, password, newPassword } = req.body;
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


User.getYears = (req, res) => {
	sql.query(`SELECT EXTRACT(year FROM  createdat) AS year
	FROM "user" 
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
				message: "user table's years",
				status: true,
				result: result.rows,
			});
		}
	});

}
User.getAllUsers_MonthWise_count = (req, res) => {
	sql.query(`
	SELECT months.month, COUNT(u.createdat) AS count FROM (
    SELECT generate_series(1, 12) AS month ) AS months
	LEFT JOIN "user" AS u ON EXTRACT(month FROM u.createdat) = months.month
	AND EXTRACT(year FROM u.createdat) = $1 GROUP BY months.month 
	ORDER BY months.month;`,
		[req.body.year], (err, result) => {
			// for (let i = 0; i < 12; i++) {
			// 	if (result.rows[i]) {
			// 		console.log(result.rows[i]);
			// 		if (result.rows[i].month !== [i]) {
			// 			result.rows[i] = {
			// 				month: i,
			// 				count: "0"
			// 			}
			// 		}
			// 	}
			// }

			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				console.log(result.rows);
				res.json({
					message: "Monthly added Users",
					status: true,
					result: result.rows,
				});
			}
		});

}










module.exports = User;