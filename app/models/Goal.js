
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Goal = function (Goal) {
	this.name = Goal.name;
};

Goal.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.goal (
        id SERIAL NOT NULL,
		name text,
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
			const { name } = req.body;
			if (name === undefined || name === null || name === '') {
				res.json({
					message: "Please Enter Goal Name",
					status: false,
				});
			} else {
				const query = `INSERT INTO "goal"
				 (id,name,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[name]);
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
							message: "Goal Added Successfully!",
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
		}
	});
}

Goal.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "goal" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Goal Details",
				status: true,
				result: result.rows
			});
		}
	});
}


Goal.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "goal"`);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "goal" ORDER by createdat DESC `);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "goal" ORDER by createdat DESC 
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "Goal Details",
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

Goal.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const GoalData = await sql.query(`select * from "goal" where id = $1`, [req.body.id]);
		const oldname = GoalData.rows[0].name;

		let { name, id } = req.body;

		if (name === undefined || name === '') {
			name = oldname;
		}

		sql.query(`UPDATE "goal" SET name =  $1 WHERE id = $2;`,
			[name, id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {
						const data = await sql.query(`select * from "goal" where id = $1`, [req.body.id]);
						res.json({
							message: "Goal Updated Successfully!",
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

Goal.search = async (req, res) => {
	sql.query(`SELECT * FROM "goal" WHERE name ILIKE  $1 ORDER BY "createdat" DESC `
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



Goal.delete = async (req, res) => {
	const data = await sql.query(`select * from "goal" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "goal" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Goal Deleted Successfully!",
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
module.exports = Goal;