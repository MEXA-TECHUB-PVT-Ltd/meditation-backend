const { sql } = require("../config/db.config");

const FoundationPlan = function (FoundationPlan) {
	this.plan_name = FoundationPlan.plan_name;
	this.user_id = FoundationPlan.user_id;
	this.icon = FoundationPlan.icon;
	this.description = FoundationPlan.description;
	this.duration = FoundationPlan.duration;
	this.days = FoundationPlan.days;
	this.goals_id = FoundationPlan.goals_id;
	this.age_group = FoundationPlan.age_group;
	this.level = FoundationPlan.level;
	this.plan_id = FoundationPlan.plan_id;
	this.plan_type = FoundationPlan.plan_type;
	this.started_at = FoundationPlan.started_at;
	this.payment_status = FoundationPlan.payment_status;
	this.progress_status = FoundationPlan.progress_status;

};
//   plan-id(select skills,description, select exercise), plan_type,

FoundationPlan.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.foundation_plan (
        id SERIAL NOT NULL,
		plan_name text,
		user_id SERIAL NOT NULL,
        icon text,
        description text,
		duration text,
		days  TEXT,
		goals_id INTEGER[],
		age_group text ,
        level text,
		plan_id INTEGER,
		plan_type text,
		plan_exercises INTEGER[],
		started_at timestamp,
		payment_status text,
		progress_status text,
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
			if (!req.body.plan_name || req.body.plan_name === '') {
				res.json({
					message: "Please Enter plan_name",
					status: false,
				});
			} else {
				let { plan_name, user_id, description, duration, days, goals_id, age_group,
					level, plan_id,
					started_at, plan_type,
					payment_status,
					progress_status } = req.body;
					let data;
					let plan_exercises =[];
				if (plan_type === 'meditation_plan') {
					 data = await sql.query(`select * from "meditation_plan" where id = $1`, [plan_id]);
				} else {
					 data = await sql.query(`select * from "yoga_plan" where id = $1`, [plan_id]);

				}
				if (data.rowCount > 0) {
					plan_exercises = data.rows[0].exercises_id;
					if (started_at == '') {
						console.log("Please")
						started_at = new Date();
					}
					const query = `INSERT INTO "foundation_plan"
				 (id,plan_name, user_id ,icon,description,duration,days,goals_id,age_group ,level, plan_id,plan_type,
					plan_exercises,
					started_at ,
					payment_status ,
					progress_status ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12,$13,$14,$15,'NOW()','NOW()' ) RETURNING * `;
					const foundResult = await sql.query(query,
						[plan_name, user_id, '', description, duration, days, goals_id, age_group, level, plan_id, plan_type,plan_exercises,
							started_at,
							payment_status,
							progress_status]);
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
								message: "Foundation Plan Added Successfully!",
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
				} else {
					res.json({
						message: "Enter Valid Plan_ID",
						status: false,
						err
					});
				}

			};
		}

	});
}
FoundationPlan.viewAllPlan = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "foundation_plan"`);
	let limit = '10';
	let page = req.body.page;
	let plan_type = req.body.plan_type;
	let yoga_plan;
	let foundation_plan;

	if (!page || !limit) {
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 , (

					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE mp.plan_type = $1
		 ORDER BY "createdat" DESC`, ['foundation_plan']);
		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 ,

					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan


					   FROM foundation_plan mp WHERE  mp.plan_type = $1
		 ORDER BY "createdat" DESC`, ['yoga_plan']);

	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					 , (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE mp.plan_type = $1
		 ORDER BY "createdat" DESC  LIMIT $1 OFFSET $2`, ['foundation_plan', limit, offset]);

		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					,
					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan
					   FROM foundation_plan mp WHERE  mp.plan_type = $1
		 ORDER BY "createdat" DESC LIMIT $1 OFFSET $2`, ['yoga_plan', limit, offset]);
	}
	if (yoga_plan.rows) {
		res.json({
			message: "All Plan Details",
			status: true,
			Total_Foundation_plans: data.rows[0].count,
			Foundation_plans_Yoga: yoga_plan.rows,
			Foundation_plans_Meditations: foundation_plan.rows
		});
	} else {
		res.json({
			message: "could not fetch",
			status: false
		})
	}
}
FoundationPlan.viewCompleted = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "foundation_plan" WHERE progress_status = 'completed'`);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 , (

					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'completed' AND mp.plan_type = $1
		 ORDER BY "createdat" DESC`, ['foundation_plan']);
		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 ,

					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan


					   FROM foundation_plan mp WHERE progress_status = 'completed' AND mp.plan_type = $1
		 ORDER BY "createdat" DESC`, ['yoga_plan']);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					 , (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'completed' AND mp.plan_type = $1
		 ORDER BY "createdat" DESC  LIMIT $2 OFFSET $3`, ['foundation_plan', limit, offset]);

		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					,
					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'completed' AND mp.plan_type = $1
		 ORDER BY "createdat" DESC LIMIT $2 OFFSET $3`, ['yoga_plan', limit, offset]);
	}
	if (data.rows[0].count > 0) {
		res.json({
			message: "Completed Plan Details",
			status: true,
			Total_Foundation_plans: data.rows[0].count,
			Foundation_plans_Yoga: yoga_plan.rows,
			Foundation_plans_Meditations: foundation_plan.rows
		});
	} else {
		res.json({
			message: "No Plan Completed",
			status: false
		})
	}
}
FoundationPlan.viewCompleted_user = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "foundation_plan"
	 WHERE progress_status = 'completed' AND user_id = $1`, [req.body.user_id]);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 , (

					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'completed' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC`, ['foundation_plan', req.body.user_id]);

		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 ,

					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan


					   FROM foundation_plan mp WHERE progress_status = 'completed' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC`, ['yoga_plan', req.body.user_id]);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					 , (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'completed' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC  LIMIT $3 OFFSET $4`, ['foundation_plan', req.body.user_id, limit, offset]);

		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					,
					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan
					   FROM foundation_plan mp WHERE "mp".progress_status = 'completed' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC LIMIT $3 OFFSET $4`, ['yoga_plan', req.body.user_id, limit, offset]);
	}
	if (data.rows[0].count > 0) {
		res.json({
			message: "Completed Plan Details",
			status: true,
			Total_Foundation_plans: data.rows[0].count,
			Foundation_plans_Yoga: yoga_plan.rows,
			Foundation_plans_Meditations: foundation_plan.rows
		});
	} else {
		res.json({
			message: "No Plan Completed",
			status: false
		})
	}
}

FoundationPlan.viewHistory_Plan_user = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "foundation_plan"
	  WHERE user_id = $1`, [req.body.user_id]);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 , (

					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC`, ['foundation_plan', req.body.user_id]);

		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 ,

					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan


					   FROM foundation_plan mp WHERE mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC`, ['yoga_plan', req.body.user_id]);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					 , (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE  mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC  LIMIT $3 OFFSET $4`, ['foundation_plan', req.body.user_id, limit, offset]);

		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					,
					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan
					   FROM foundation_plan mp WHERE  mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC LIMIT $3 OFFSET $4`, ['yoga_plan', req.body.user_id, limit, offset]);
	}
	if (data.rows[0].count > 0) {
		res.json({
			message: "Completed Plan Details",
			status: true,
			Total_Foundation_plans: data.rows[0].count,
			Foundation_plans_Yoga: yoga_plan.rows,
			Foundation_plans_Meditations: foundation_plan.rows
		});
	} else {
		res.json({
			message: "No Plan Completed",
			status: false
		})
	}
}
FoundationPlan.viewStarted_user1 = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "foundation_plan" WHERE  user_id = $1 
	AND progress_status = 'started'`, [req.body.user_id]);
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "foundation_plan"  WHERE  user_id = $1 AND progress_status = 'started' 
		 ORDER BY "createdat" DESC`, [req.body.user_id]);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "foundation_plan"  WHERE user_id = $1 AND progress_status = 'started' ORDER BY "createdat" DESC
		LIMIT $2 OFFSET $3 ` , [req.body.user_id, limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "User's Started Plan Details",
			status: true,
			count: data.rows[0].count,
			result: result.rows,
		});
	} else {
		res.json({
			message: "No Plan Completed",
			status: false
		})
	}
}
FoundationPlan.viewStarted_user = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "foundation_plan"
	 WHERE progress_status = 'started' AND user_id = $1`, [req.body.user_id]);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 , (

					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'started' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC`, ['foundation_plan', req.body.user_id]);

		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 ,

					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan


					   FROM foundation_plan mp WHERE progress_status = 'started' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC`, ['yoga_plan', req.body.user_id]);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					 , (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'started' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC  LIMIT $3 OFFSET $4`, ['foundation_plan', req.body.user_id, limit, offset]);

		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					,
					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan
					   FROM foundation_plan mp WHERE "mp".progress_status = 'started' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC LIMIT $3 OFFSET $4`, ['yoga_plan', req.body.user_id, limit, offset]);
	}
	if (data.rows[0].count > 0) {
		res.json({
			message: "Started Plan Details",
			status: true,
			Total_Foundation_plans: data.rows[0].count,
			Foundation_plans_Yoga: yoga_plan.rows,
			Foundation_plans_Meditations: foundation_plan.rows
		});
	} else {
		res.json({
			message: "No Plan Completed",
			status: false
		})
	}
}


FoundationPlan.addIcon = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "foundation_plan" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].icon;
			let { id } = req.body;
			console.log(req.file)
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}

			sql.query(`UPDATE "foundation_plan" SET icon = $1 WHERE id = $2;`,
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
							const data = await sql.query(`select * from "foundation_plan" where id = $1`, [req.body.id]);
							res.json({
								message: "Foundation Plan icon added Successfully!",
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
FoundationPlan.viewSpecific = async (req, res) => {
	sql.query(`SELECT *  FROM "foundation_plan" WHERE id = $1`, [req.body.id], async (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				payment_status: false,
				err
			});
		} else {
			let plan;
			if (result.rows[0].plan_type === 'foundation_plan') {
				plan = await sql.query(`SELECT  mp.*, (
					SELECT json_agg( 
					   json_build_object('id',g.id,'goal_name', g.name
					   )
						   )
						   FROM goal g
							WHERE g.id = ANY(mp.goals_id)
							 ) AS goals 
		
							 , (
		
							   SELECT  json_agg(json_build_object('description',s.description
							 ,
							 'Skills' , (SELECT json_agg(skill.*)
							 FROM skill 
							  WHERE skill.id = ANY(s.skills_id)
							   )
							   ,
							   'Exercises' , (SELECT json_agg(exercise.*)
							   FROM exercise 
								WHERE exercise.id = ANY(s.exercises_id)
								)
							   
		
							   ))
									  FROM foundation_plan s
									   WHERE s.id = mp.plan_id
										) AS plan
							   FROM foundation_plan mp WHERE id = $1 AND mp.plan_type = $2
				 ORDER BY "createdat" DESC`, [req.body.id, 'foundation_plan']);
			} else if (result.rows[0].plan_type === 'yoga_plan') {
				plan = await sql.query(`SELECT  mp.*, (
					SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
						   FROM goal g
							WHERE g.id = ANY(mp.goals_id)
							 ) AS goals 
		
							 ,
		
							 (
							   SELECT  json_agg(json_build_object('description',s.description
							 ,
							 'Skills' , (SELECT json_agg(skill.*)
							 FROM skill 
							  WHERE skill.id = ANY(s.skills_id)
							   )
							   ,
							   'Exercises' , (SELECT json_agg(exercise.*)
							   FROM exercise 
								WHERE exercise.id = ANY(s.exercises_id)
								)
							   
		
							   ))
									  FROM yoga_plan s
									   WHERE s.id = mp.plan_id 
										) AS plan
		
		
							   FROM foundation_plan mp WHERE  id = $1 AND  mp.plan_type = $2
				 ORDER BY "createdat" DESC`, [req.body.id, 'yoga_plan']);

			}
			else {
				res.json({
					message: "Try again",
					status: false,
				});

			}
			if (plan.rowCount > 0) {
				res.json({
					message: "Specific Foundation Plan Details",
					status: true,
					result: plan.rows
				});
			} else {
				res.json({
					message: "Try Again",
					status: false,
				});
			}
		}
	});
}

FoundationPlan.search = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "foundation_plan" WHERE plan_name ILIKE  $1`, [`${req.body.plan_name}%`]);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 , (

					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE plan_name ILIKE  $1 AND mp.plan_type = $2
		 ORDER BY "createdat" DESC`, [`${req.body.plan_name}%`, 'foundation_plan']);
		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 ,

					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)
					   

					   ))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan


					   FROM foundation_plan mp WHERE plan_name ILIKE  $1 AND mp.plan_type = $2
		 ORDER BY "createdat" DESC`, [`${req.body.plan_name}%`, 'yoga_plan']);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		foundation_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					 , (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)					   ))
							  FROM foundation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE plan_name ILIKE  $1 AND mp.plan_type = $2
		 ORDER BY "createdat" DESC  LIMIT $3 OFFSET $4`, [`${req.body.plan_name}%`, 'foundation_plan', limit, offset]);

		yoga_plan = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( json_build_object('id',g.id,'goal_name', g.name) )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
					,
					 (
					   SELECT  json_agg(json_build_object('description',s.description
					 ,
					 'Skills' , (SELECT json_agg(skill.*)
					 FROM skill 
					  WHERE skill.id = ANY(s.skills_id)
					   )
					   ,
					   'Exercises' , (SELECT json_agg(exercise.*)
					   FROM exercise 
						WHERE exercise.id = ANY(s.exercises_id)
						)))
							  FROM yoga_plan s
							   WHERE s.id = mp.plan_id 
								) AS plan
					   FROM foundation_plan mp WHERE plan_name ILIKE  $1 AND mp.plan_type = $2
		 ORDER BY "createdat" DESC LIMIT $3 OFFSET $4`, [`${req.body.plan_name}%`, 'yoga_plan', limit, offset]);
	}
	if (data.rows[0].count > 0) {
		res.json({
			message: "Search Plan Details",
			status: true,
			Total_Foundation_plans: data.rows[0].count,
			Foundation_plans_Yoga: yoga_plan.rows,
			Foundation_plans_Meditations: foundation_plan.rows
		});
	} else {
		res.json({
			message: "No Plan Completed",
			status: false
		})
	}
}


FoundationPlan.delete = async (req, res) => {
	const data = await sql.query(`select * from "foundation_plan" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "foundation_plan" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Foundation Plan Deleted Successfully!",
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
FoundationPlan.changePlanStatus = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "Please Enter id",
			status: false,
		});
	} else {
		const data = await sql.query(`select * from "foundation_plan" where id = $1`, [req.body.id]);
		if (data.rowCount === 1) {
			sql.query(`UPDATE "foundation_plan" SET progress_status = $1 WHERE id = $2;`, [req.body.status, req.body.id], async (err, result) => {
				if (err) {
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else
					if (result.rowCount === 1) {
						const data = await sql.query(`select * from "foundation_plan" where id = $1`, [req.body.id]);
						res.json({
							message: "Foundation Plan status Updated Successfully!",
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
		} else {
			res.json({
				message: "Not Found",
				status: false,
			});
		}
	}
}
FoundationPlan.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		console.log(req.body.id);
		const RelaxationMusicData = await sql.query(`select * from "foundation_plan" where id = $1`, [req.body.id]);
		if (RelaxationMusicData.rowCount > 0) {

			const oldplan_name = RelaxationMusicData.rows[0].plan_name;
			const olddescription = RelaxationMusicData.rows[0].description;
			const oldduration = RelaxationMusicData.rows[0].duration;
			const olddays = RelaxationMusicData.rows[0].days;
			const oldgoals_id = RelaxationMusicData.rows[0].goals_id;
			const oldage_group = RelaxationMusicData.rows[0].age_group;


			const oldLevel = RelaxationMusicData.rows[0].level;
			const oldplan_id = RelaxationMusicData.rows[0].plan_id;
			const oldplan_type = RelaxationMusicData.rows[0].plan_type;
			const oldStarted_at = RelaxationMusicData.rows[0].started_at;
			const oldProgress_status = RelaxationMusicData.rows[0].progress_status;
			const oldpayment_status = RelaxationMusicData.rows[0].payment_status;

			let { id, plan_name, description, duration, days, goals_id, age_group, payment_status, level, plan_id, plan_type, started_at, progress_status } = req.body;


			if (duration === undefined || duration === '') {
				duration = oldduration;
			}


			if (days === undefined || days === '') {
				days = olddays;
			}


			if (payment_status === undefined || payment_status === '') {
				payment_status = oldpayment_status;
			}




			if (started_at === undefined || started_at === '') {
				started_at = oldStarted_at;
			}
			if (plan_id === undefined || plan_id === '') {
				plan_id = oldplan_id;
			}
			if (progress_status === undefined || progress_status === '') {
				progress_status = oldProgress_status;
			}


			if (level === undefined || level === '') {
				level = oldLevel;
			}
			if (plan_name === undefined || plan_name === '') {
				plan_name = oldplan_name;
			}

			if (description === undefined || description === '') {
				description = olddescription;
			}
			if (goals_id === undefined || goals_id === '') {
				goals_id = oldgoals_id;
			}
			if (age_group === undefined || age_group === '') {
				age_group = oldage_group;
			}
			if (plan_type === undefined || plan_type === '') {
				plan_type = oldplan_type;
			}
			sql.query(`update "foundation_plan" SET plan_name = $1,
		description = $2,duration = $3, days = $4, goals_id = $5, age_group = $6 ,level=$7, plan_id  = $8, plan_type= $9,
		started_at = $10, payment_status = $11, progress_status = $12 WHERE id = $13;`,
				[plan_name, description, duration, days, goals_id, age_group, level, plan_id, plan_type, started_at, payment_status, progress_status, id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "foundation_plan" where id = $1`, [req.body.id]);
							res.json({
								message: "Foundation Plan Updated Successfully!",
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
FoundationPlan.start = async (req, res) => {
	if (req.body.plan_id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const RelaxationMusicData = await sql.query(`select * from "foundation_plan" where id = $1`, [req.body.plan_id]);
		if (RelaxationMusicData.rowCount > 0) {

			const oldduration = RelaxationMusicData.rows[0].duration;
			const oldstart_at = RelaxationMusicData.rows[0].start_at;
			let { start_at, progress_status, duration, plan_id } = req.body;

			if (duration === undefined || duration === '') {
				duration = oldduration;
			}
			if (start_at === undefined || start_at === '') {
				start_at = oldstart_at;
			}
			console.log("1")
			sql.query(`update "foundation_plan" SET started_at = $1,duration = $2, progress_status = $3 WHERE id = $4;`,
				[start_at, duration, progress_status, plan_id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							sql.query(`CREATE TABLE IF NOT EXISTS public.manage_foundation_plan (
								id SERIAL NOT NULL,
								user_id integer,
								plan_id integer,
								skills_id_completed integer[],
								skill_id_on_going integer,
								started_at timestamp,
								exercises_id integer[],
								plan_status text ,
								duration text,
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
									if (!req.body.plan_id || req.body.plan_id === '') {
										res.json({
											message: "Please Enter plan_id",
											status: false,
										});
									} else {
										const { user_id, plan_id, started_at, progress_status,
											duration } = req.body;



											const CheckStreak = await sql.query(`select * from "check_streak" where user_id = $1`, [user_id]);
											if (CheckStreak.rowCount > 0) {
												let oldstreak_start_date = CheckStreak.rows[0].streak_start_date;
												const check = await sql.query(`SELECT AGE(start_at, 'NOW()') AS difference FROM check_streak where user_id = $1`, [req.body.user_id]);
												console.log(check.rows);
												if (check.rowCount > 0) {
													if (check.rows[0].difference.days) {
														if (check.rows[0].difference.days > 1) {
															oldstreak_start_date = started_at;
														}
													}
												}
												if (oldstreak_start_date === null) {
													oldstreak_start_date = started_at
												}
												const query = `UPDATE "check_streak" SET  start_at = $1 , streak_start_date = $2`;
												const foundResult = await sql.query(query, [started_at, oldstreak_start_date]);
											} else {
												const query = `INSERT INTO "check_streak" (id, user_id ,start_at, streak_start_date  ,createdat ,updatedat )
													VALUES (DEFAULT, $1, $2,$3, 'NOW()','NOW()' ) `;
												const foundResult = await sql.query(query, [user_id, started_at, started_at]);
											}
	




										const managePlan = await sql.query(`select * from "manage_foundation_plan" 
											where plan_id = $1 AND user_id = $2`, [req.body.plan_id, req.body.user_id]);
										if (managePlan.rowCount > 0) {

											const managePlan = await sql.query(`update "manage_foundation_plan" SET skills_id_completed = $1,
											skill_id_on_going = $2, exercises_id = $3,started_at = $4,  plan_status = $5 ,duration=$6 
											WHERE plan_id = $7 AND user_id = $8;`,
												[[], null, [], started_at, progress_status, duration,
												req.body.plan_id, req.body.user_id]);
											if (managePlan.rowCount > 0) {
												const updatedPlan = await sql.query(`select * from "manage_foundation_plan" where plan_id = $1 AND user_id = $2`, [req.body.plan_id, req.body.user_id]);
												res.json({
													message: "Foundation Plan Re-Started (Progress 0%) Successfully!",
													status: true,
													result: updatedPlan.rows
												});
											} else {
												res.json({
													message: "Try Again",
													status: false,
													err
												});
											}
										} else {
											const query = `INSERT INTO "manage_foundation_plan"
										 (id, user_id, plan_id, skills_id_completed, skill_id_on_going, started_at,
											exercises_id, plan_status ,duration ,createdAt ,updatedAt )
													VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, 'NOW()','NOW()' ) RETURNING * `;
											const foundResult = await sql.query(query,
												[user_id, plan_id, [], null, started_at, [], progress_status, duration]);

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
														message: "Foundation Plan Started Successfully!",
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
										}

									};
								}

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
FoundationPlan.updateStartedPlan = async (req, res) => {
	if (req.body.plan_id === '') {
		res.json({
			message: "plan_id is required",
			status: false,
		});
	} else if (req.body.user_id === '') {
		res.json({
			message: "user_id is required",
			status: false,
		});
	} else {
		const RelaxationMusicData = await sql.query(`select * from "foundation_plan" where id = $1`, [req.body.plan_id]);
		if (RelaxationMusicData.rowCount > 0) {
			const RelaxationMusic = await sql.query(`select * from "manage_foundation_plan" where plan_id = $1 AND user_id = $2`, [req.body.plan_id, req.body.user_id]);
			if (RelaxationMusic.rowCount > 0) {
				const Oldskills_id_completed = RelaxationMusic.rows[0].skills_id_completed;
				const Oldskill_id_on_going = RelaxationMusic.rows[0].skill_id_on_going;
				const Oldstarted_at = RelaxationMusic.rows[0].started_at;
				const Oldexercises_id = RelaxationMusic.rows[0].exercises_id;
				const Oldplan_status = RelaxationMusic.rows[0].plan_status;
				const Oldduration = RelaxationMusic.rows[0].duration;

				let { id, user_id, plan_id, skills_id_completed, skill_id_on_going, started_at, exercises_id, progress_status, duration } = req.body;

				if (skills_id_completed === undefined || skills_id_completed === '') {
					skills_id_completed = Oldskills_id_completed;
				}
				if (skill_id_on_going === undefined || skill_id_on_going === '') {
					skill_id_on_going = Oldskill_id_on_going;
				}
				console.log(started_at);
				if (started_at === undefined || started_at === '') {
					started_at = Oldstarted_at;
					console.log("started_at");

				}
				console.log(started_at);

				if (exercises_id === undefined || exercises_id === '') {
					exercises_id = Oldexercises_id;
				}
				if (progress_status === undefined || progress_status === '') {
					progress_status = Oldplan_status;
				}


				if (duration === undefined || duration === '') {
					duration = Oldduration;
				}
				console.log(RelaxationMusic.rows[0].id);
				sql.query(`update "manage_foundation_plan" SET skills_id_completed = $1,
				skill_id_on_going = $2, exercises_id = $3,started_at = $4,  plan_status = $5 ,duration=$6 WHERE id = $7;`,
					[skills_id_completed, skill_id_on_going, exercises_id, started_at, progress_status, duration,
						RelaxationMusic.rows[0].id], async (err, result) => {
							if (err) {
								console.log(err);
								res.json({
									message: "Try Again",
									status: false,
									err
								});
							} else {
								if (result.rowCount === 1) {
									const updatedPlan = await sql.query(`select * from "manage_foundation_plan" where plan_id = $1 AND user_id = $2`, [req.body.plan_id, req.body.user_id]);
									res.json({
										message: "Foundation Plan Updated Successfully!",
										status: true,
										result: updatedPlan.rows
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
		} else {
			res.json({
				message: "Not Found",
				status: false,
			});
		}
	}
}
FoundationPlan.viewProgress_plan_skill_user = async (req, res) => {
	const data = await sql.query(`select * from "manage_foundation_plan" where 
	plan_id = $1 AND user_id = $2`, [req.body.plan_id, req.body.user_id]);
	if (data.rowCount > 0) {
		let status = 'not started';


		for (let i = 0; i < data.rows[0].skills_id_completed.length; i++) {
			if (data.rows[0].skills_id_completed[i] == req.body.skill_id) {
				status = 'Completed';
			}
		}

		if (data.rows[0].skill_id_on_going == req.body.skill_id) {
			status = '(start) On Going';
		}
		res.json({
			message: "Skill in that Plan status",
			status: true,
			result: status,
		});
	} else {
		res.json({
			message: "Plan with that user isn't available",
			status: false,
		});

	}

}
FoundationPlan.view_completed_skills_plan = async (req, res) => {
	const data = await sql.query(`select * from "manage_foundation_plan" where 
	plan_id = $1 AND user_id = $2`, [req.body.plan_id, req.body.user_id]);
	if (data.rowCount > 0) {
		const skills = await sql.query(`SELECT  
					 (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id_completed)
								) AS skills
					   FROM manage_foundation_plan mp WHERE
					   plan_id = $1 AND user_id = $2`, [req.body.plan_id, req.body.user_id]);
		if (data.rowCount > 0) {

			res.json({
				message: "All Completed Skill in that Plan",
				status: true,
				result: skills.rows
			});

		} else {
			res.json({
				message: "Try Again",
				status: false,
			});
		}
	} else {
		res.json({
			message: "Plan with that user isn't available",
			status: false,
		});

	}

}
FoundationPlan.view_completed_skills_User = async (req, res) => {
	const data = await sql.query(`select * from "manage_foundation_plan" where 
	user_id = $1`, [req.body.user_id]);
	if (data.rowCount > 0) {
		const skills = await sql.query(`SELECT  
					 (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id_completed)
								) AS skills
					   FROM manage_foundation_plan mp WHERE
					    user_id = $1`, [req.body.user_id]);
		if (data.rowCount > 0) {

			res.json({
				message: "All Completed Skill by a User",
				status: true,
				result: skills.rows
			});

		} else {
			res.json({
				message: "Try Again",
				status: false,
			});
		}
	} else {
		res.json({
			message: "Plan with that user isn't available",
			status: false,
		});

	}

}
FoundationPlan.view_completed_Exercises_User = async (req, res) => {
	const data = await sql.query(`select * from "manage_foundation_plan" where 
	user_id = $1`, [req.body.user_id]);
	if (data.rowCount > 0) {
		const skills = await sql.query(`SELECT  
					 (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'exercise_name', s.name,
						  'description', s.description,'animations', s.animations,
						  'audio_file', s.audio_file,'exercise_createdat', s.createdat
						  )
							  )
							  FROM exercise s
							   WHERE s.id = ANY(mp.exercises_id)
								) AS exercise
					   FROM manage_foundation_plan mp WHERE
					    user_id = $1`, [req.body.user_id]);
		if (data.rowCount > 0) {

			res.json({
				message: "All Completed Exercises by a User",
				status: true,
				result: skills.rows
			});

		} else {
			res.json({
				message: "Try Again",
				status: false,
			});
		}
	} else {
		res.json({
			message: "Plan with that user isn't available",
			status: false,
		});

	}

}
FoundationPlan.view_All_Exercises_User = async (req, res) => {
	const data = await sql.query(`select * from "manage_foundation_plan" where 
	user_id = $1`, [req.body.user_id]);
	if (data.rowCount > 0) {
		const skills = await sql.query(`SELECT  
					 (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'exercise_name', s.name,
						  'description', s.description,'animations', s.animations,
						  'audio_file', s.audio_file,'exercise_createdat', s.createdat
						  )
							  )
							  FROM exercise s
							   WHERE s.id = ANY(MMP.plan_exercises)
								) AS exercise
					   FROM manage_foundation_plan  mp JOIN  foundation_plan MMP 
					   ON mp.plan_id  = MMP.id WHERE
					   mp.user_id = $1 ORDER BY MMP.createdat DESC`, [req.body.user_id]);
		if (data.rowCount > 0) {

			res.json({
				message: "All Exercises by a User",
				status: true,
				result: skills.rows
			});

		} else {
			res.json({
				message: "Try Again",
				status: false,
			});
		}
	} else {
		res.json({
			message: "Plan with that user isn't available",
			status: false,
		});

	}

}

FoundationPlan.quitPlan = async (req, res) => {
	const data = await sql.query(`select * from "manage_foundation_plan" where 
	user_id = $1 AND plan_id  = $2`, [req.body.user_id, req.body.plan_id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "manage_foundation_plan" where 
		user_id = $1 AND plan_id  = $2`, [req.body.user_id, req.body.plan_id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Foundation Plan Quit Successfully!",
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



module.exports = FoundationPlan;
