
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Skill = function (Skill) {
	this.skill_name = Skill.skill_name;
	this.icon = Skill.icon;
	this.discription = Skill.discription
	this.benefit = Skill.benefit;
	this.status = Skill.status;
};

Skill.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.skill (
        id SERIAL NOT NULL,
		skill_name text,
        icon text ,
        discription text,
		benefit text,
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
			const { skill_name, discription, benefit, status } = req.body;

			const query = `INSERT INTO "skill"
				 (id,skill_name, icon,discription,benefit,status,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3,$4,$5,'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[skill_name, '', discription, benefit, status]);
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
						message: "Skill Added Successfully!",
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


Skill.addIcon = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "skill" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].icon;
			let { id } = req.body;
			console.log(req.file)
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}

			sql.query(`UPDATE "skill" SET icon = $1 WHERE id = $2;`,
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
							const data = await sql.query(`select * from "skill" where id = $1`, [req.body.id]);
							res.json({
								message: "skill icon added Successfully!",
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
Skill.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "skill"`);
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "skill" ORDER by createdat DESC `);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "skill" ORDER by createdat DESC 
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "skill Details",
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


Skill.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "skill" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Skill Details",
				status: true,
				result: result.rows
			});
		}
	});
}


Skill.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const SkillData = await sql.query(`select * from "skill" where id = $1`, [req.body.id]);
		if (SkillData.rowCount > 0) {
			const oldskill_name = SkillData.rows[0].skill_name;
			const olddiscription = SkillData.rows[0].discription;
			const oldbenefit = SkillData.rows[0].benefit;
			const oldstatus = SkillData.rows[0].status;

			let { skill_name, benefit, discription, status, id } = req.body;
			if (status === undefined || status === '') {
				status = oldstatus;
			}

			if (skill_name === undefined || skill_name === '') {
				skill_name = oldskill_name;
			}
			if (discription === undefined || discription === '') {
				discription = olddiscription;
			}

			if (benefit === undefined || benefit === '') {
				benefit = oldbenefit;
			}
			sql.query(`UPDATE "skill" SET skill_name =  $1, 
		discription  =  $2 , 
		benefit =  $3, status = $4 WHERE id = $5;`,
				[skill_name, discription, benefit, status, id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "skill" where id = $1`, [req.body.id]);
							res.json({
								message: "Skill Updated Successfully!",
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


Skill.delete = async (req, res) => {
	const data = await sql.query(`select * from "skill" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "skill" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Skill Deleted Successfully!",
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
module.exports = Skill;