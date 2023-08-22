
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { array } = require('pg-format'); // Import the pg-format module

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


Skill.viewProgressAll = async (req, res) => {

	const skills = await sql.query(`SELECT * FROM "skill"`);
	let skillResults = [];
	
	let user_id = req.body.user_id;
	
	const queryPromises = skills.rows.map(async (skill) => {
		const skill_id = skill.id;
		const [YogaPlanTotal, MeditationPlanTotal, FoundationPlanTotalMeditation, FoundationPlanTotalYoga, YogaPlanCompleted, MeditationPlanCompleted, FoundationPlanCompleted] = await Promise.all([
			sql.query(`SELECT COUNT(*) AS YogaTotal  FROM "yoga_plan" WHERE $1 = ANY(skills_id) `, [skill_id]),
			sql.query(`SELECT COUNT(*) AS MeditationTotal  FROM "meditation_plan"  WHERE $1 = ANY(skills_id) `, [skill_id]),
			sql.query(`SELECT COUNT(*) AS FoundationTotal1 FROM "foundation_plan" 
				JOIN "meditation_plan" ON "meditation_plan"."id" = ANY("foundation_plan"."plan_id")
				WHERE $1 = ANY(skills_id)  
				AND "foundation_plan".plan_type = $2 `, [skill_id, 'meditation_plan']),
			sql.query(`SELECT COUNT(*) AS FoundationTotal2 FROM "foundation_plan" 
				JOIN "yoga_plan" ON  "yoga_plan"."id" = ANY("foundation_plan"."plan_id")
				WHERE $1 = ANY(skills_id) 
				AND "foundation_plan".plan_type = $2 `, [skill_id, 'yoga_plan']),
			sql.query(`SELECT COUNT(*) AS YogaCompleted FROM  "manage_yoga_plan" WHERE $1 = ANY(skills_id_completed) 
				AND "manage_yoga_plan".user_id = $2`, [skill_id, user_id]),
			sql.query(`SELECT COUNT(*) AS MeditationCompleted FROM "manage_meditation_plan" WHERE $1 = ANY(skills_id_completed) 
				AND "manage_meditation_plan".user_id = $2`, [skill_id, user_id]),
			sql.query(`SELECT COUNT(*) AS FoundationCompleted FROM "manage_foundation_plan" WHERE $1 = ANY(skills_id_completed) 
				AND "manage_foundation_plan".user_id = $2`, [skill_id, user_id])
		]);
	
		const completed = (
			parseInt(FoundationPlanCompleted.rows[0].foundationcompleted)
			+ parseInt(YogaPlanCompleted.rows[0].yogacompleted)
			+ parseInt(MeditationPlanCompleted.rows[0].meditationcompleted)
		);
	
		const total = (
			parseInt(FoundationPlanTotalYoga.rows[0].foundationtotal2)
			+ parseInt(FoundationPlanTotalMeditation.rows[0].foundationtotal1)
			+ parseInt(YogaPlanTotal.rows[0].yogatotal)
			+ parseInt(MeditationPlanTotal.rows[0].meditationtotal)
		);
	
		skillResults.push({
			skill_id: skill_id,
			skill_name: skill.skill_name,
			description: skill.discription,
			benefit: skill.benefit,
			icon: skill.icon,
			total: total,
			completed: completed
		});
	});
	
	await Promise.all(queryPromises);
	
	res.json({
		message: "Skill Progress",
		status: true,
		result: skillResults
	});
	

}


Skill.viewProgress = async (req, res) => {
	let skill_id = req.body.skill_id;
	let user_id = req.body.user_id;
	const YogaPlanTotal = await sql.query(
		`SELECT COUNT(*) AS YogaTotal FROM "yoga_plan" JOIN "manage_yoga_plan" ON 
		"yoga_plan".id = "manage_yoga_plan".plan_id WHERE $1 = ANY(skills_id) 
		AND "manage_yoga_plan".user_id = $2`,
		[skill_id, user_id]
	);
	const MeditationPlanTotal = await sql.query(
		`SELECT COUNT(*) AS MeditationTotal FROM "meditation_plan" JOIN "manage_meditation_plan" ON 
		"meditation_plan".id = "manage_meditation_plan".plan_id WHERE $1 = ANY(skills_id) 
		AND "manage_meditation_plan".user_id = $2`,
		[skill_id, user_id]
	);

	const FoundationPlanTotalMeditation = await sql.query(

		`SELECT COUNT(*) AS FoundationTotal1 FROM "foundation_plan" JOIN "manage_foundation_plan" ON 
		"foundation_plan".id = "manage_foundation_plan".plan_id 
		JOIN "meditation_plan" ON "foundation_plan"."plan_id" = "meditation_plan"."id"
		WHERE $1 = ANY(skills_id) 
		AND "manage_foundation_plan".user_id = $2 AND "foundation_plan".plan_type = $3 `,
		[skill_id, user_id, 'meditation_plan']
	);
	const FoundationPlanTotalYoga = await sql.query(
		`SELECT COUNT(*) AS FoundationTotal2 FROM "foundation_plan" JOIN "manage_foundation_plan" ON 
		"foundation_plan".id = "manage_foundation_plan".plan_id 
		JOIN "yoga_plan" ON "foundation_plan"."plan_id" = "yoga_plan"."id"
		WHERE $1 = ANY(skills_id) 
		AND "manage_foundation_plan".user_id = $2 AND "foundation_plan".plan_type = $3 `,
		[skill_id, user_id, 'yoga_plan']
	);

	const YogaPlanCompleted = await sql.query(
		`SELECT COUNT(*) AS YogaCompleted FROM  "manage_yoga_plan" WHERE $1 = ANY(skills_id_completed) 
		AND "manage_yoga_plan".user_id = $2`,
		[skill_id, user_id]
	);

	const MeditationPlanCompleted = await sql.query(
		`SELECT COUNT(*) AS MeditationCompleted FROM "manage_meditation_plan" WHERE $1 = ANY(skills_id_completed) 
		AND "manage_meditation_plan".user_id = $2`,
		[skill_id, user_id]
	);

	const FoundationPlanCompleted = await sql.query(
		`SELECT COUNT(*) AS FoundationCompleted FROM "manage_foundation_plan" WHERE $1 = ANY(skills_id_completed) 
		AND "manage_foundation_plan".user_id = $2`,
		[skill_id, user_id]
	);

	const completed = (
		parseInt(FoundationPlanCompleted.rows[0].foundationcompleted)
		+ parseInt(YogaPlanCompleted.rows[0].yogacompleted)
		+ parseInt(MeditationPlanCompleted.rows[0].meditationcompleted));
	console.log(completed);

	const total = (
		parseInt(FoundationPlanTotalYoga.rows[0].foundationtotal2) +
		parseInt(FoundationPlanTotalMeditation.rows[0].foundationtotal1) +
		parseInt(YogaPlanTotal.rows[0].yogatotal) +
		parseInt(MeditationPlanTotal.rows[0].meditationtotal)
	);
	sql.query(`SELECT COUNT(*) AS COUNT FROM "yoga_plan" WHERE $1 = ANY(skills_id)`
		, [skill_id], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Skill Progress",
					status: true,
					total: total,
					completed: completed
				});
			}
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

Skill.search = async (req, res) => {
	sql.query(`SELECT * FROM "skill" WHERE skill_name ILIKE  $1 OR status ILIKE  $1 ORDER BY "createdat" DESC `
		, [`${req.body.skill_name}%`], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Search's skill data",
					status: true,
					result: result.rows,
				});
			}
		});
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