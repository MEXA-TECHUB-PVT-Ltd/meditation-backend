
const { sql } = require("../config/db.config");

const Exercise = function (Exercise) {
	this.name = Exercise.name;
	this.description = Exercise.description;
	this.animations = Exercise.animations
	this.status = Exercise.status;
};

Exercise.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.exercise (
        id SERIAL NOT NULL,
		name text,
        description text ,
        animations text[],
		audio_file text,
		status text,
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
			const { name, description ,status} = req.body;

			const query = `INSERT INTO "exercise"
				 (id,name, description,animations,audio_file,status,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4,$5, 'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[name, description, [''],''], status);
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
						message: "Exercise Added Successfully!",
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

		};
	});
}

Exercise.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "exercise" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Exercise Details",
				status: true,
				result: result.rows
			});
		}
	});
}


Exercise.addAudioFile = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "exercise" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].audio_file;
			let { id } = req.body;
			console.log(req.file)
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}

			sql.query(`UPDATE "exercise" SET audio_file = $1 WHERE id = $2;`,
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
							const data = await sql.query(`select * from "exercise" where id = $1`, [req.body.id]);
							res.json({
								message: "exercise Audio File added Successfully!",
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

Exercise.search = async (req, res) => {
	sql.query(`SELECT * FROM "exercise" WHERE name ILIKE  $1 ORDER BY "createdat" DESC `
		, [`${req.body.name}%`], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Search's items data",
					status: true,
					result: result.rows,
				});
			}
		});
}
Exercise.addAnimation = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "exercise" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].animations;
			let { id } = req.body;
			console.log(req.files)
			if (req.files) {
				for(let i = 0; i < req.files.length; i++) {
					photo[i] = req.files[i].path
				}
			}

			sql.query(`UPDATE "exercise" SET animations = $1 WHERE id = $2;`,
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
							const data = await sql.query(`select * from "exercise" where id = $1`, [req.body.id]);
							res.json({
								message: "exercise Animation added Successfully!",
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
Exercise.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "exercise"`);
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "exercise" ORDER by createdat DESC `);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "exercise" ORDER by createdat DESC 
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "Exercise Details",
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

Exercise.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const ExerciseData = await sql.query(`select * from "exercise" where id = $1`, [req.body.id]);
		const oldname = ExerciseData.rows[0].name;
		const olddescription = ExerciseData.rows[0].description;
		let { name, description, id } = req.body;

		if (name === undefined || name === '') {
			name = oldname;
		}

		if (description === undefined || description === '') {
			description = olddescription;
		}
		sql.query(`UPDATE "exercise" SET name =  $1, 
		description =  $2  WHERE id = $3;`,
			[name, description, id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {
						const data = await sql.query(`select * from "exercise" where id = $1`, [req.body.id]);
						res.json({
							message: "Exercise Updated Successfully!",
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
}
Exercise.delete = async (req, res) => {
	const data = await sql.query(`select * from "exercise" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "exercise" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Exercise Deleted Successfully!",
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
module.exports = Exercise;