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
				console.log(started_at)

				if (started_at == '') {
					console.log("Please")
					started_at = new Date();
				}
				const query = `INSERT INTO "foundation_plan"
				 (id,plan_name, user_id ,icon,description,duration,days,goals_id,age_group ,level, plan_id,plan_type,
					started_at ,
					payment_status ,
					progress_status ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12,$13,$14,'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[plan_name, user_id, '', description, duration, days, goals_id, age_group, level, plan_id, plan_type,
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
	let meditation_plan;

	if (!page || !limit) {
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE mp.plan_type = $1
		 ORDER BY "createdat" DESC`, ['meditation_plan']);
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
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE mp.plan_type = $1
		 ORDER BY "createdat" DESC  LIMIT $1 OFFSET $2`, ['meditation_plan', limit, offset]);

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
			Foundation_plans_Meditations: meditation_plan.rows
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
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'completed' AND mp.plan_type = $1
		 ORDER BY "createdat" DESC`, ['meditation_plan']);
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
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'completed' AND mp.plan_type = $1
		 ORDER BY "createdat" DESC  LIMIT $2 OFFSET $3`, ['meditation_plan', limit, offset]);

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
			Foundation_plans_Meditations: meditation_plan.rows
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
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'completed' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC`, ['meditation_plan', req.body.user_id]);

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
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'completed' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC  LIMIT $3 OFFSET $4`, ['meditation_plan',req.body.user_id, limit, offset]);

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
		 ORDER BY "createdat" DESC LIMIT $3 OFFSET $4`, ['yoga_plan',req.body.user_id, limit, offset]);
	}
	if (data.rows[0].count > 0) {
		res.json({
			message: "Completed Plan Details",
			status: true,
			Total_Foundation_plans: data.rows[0].count,
			Foundation_plans_Yoga: yoga_plan.rows,
			Foundation_plans_Meditations: meditation_plan.rows
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
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC`, ['meditation_plan', req.body.user_id]);

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
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE  mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC  LIMIT $3 OFFSET $4`, ['meditation_plan',req.body.user_id, limit, offset]);

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
		 ORDER BY "createdat" DESC LIMIT $3 OFFSET $4`, ['yoga_plan',req.body.user_id, limit, offset]);
	}
	if (data.rows[0].count > 0) {
		res.json({
			message: "Completed Plan Details",
			status: true,
			Total_Foundation_plans: data.rows[0].count,
			Foundation_plans_Yoga: yoga_plan.rows,
			Foundation_plans_Meditations: meditation_plan.rows
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
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'started' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC`, ['meditation_plan', req.body.user_id]);

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
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE progress_status = 'started' AND mp.plan_type = $1 AND user_id = $2
		 ORDER BY "createdat" DESC  LIMIT $3 OFFSET $4`, ['meditation_plan',req.body.user_id, limit, offset]);

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
		 ORDER BY "createdat" DESC LIMIT $3 OFFSET $4`, ['yoga_plan',req.body.user_id, limit, offset]);
	}
	if (data.rows[0].count > 0) {
		res.json({
			message: "Started Plan Details",
			status: true,
			Total_Foundation_plans: data.rows[0].count,
			Foundation_plans_Yoga: yoga_plan.rows,
			Foundation_plans_Meditations: meditation_plan.rows
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
			if (result.rows[0].plan_type === 'meditation_plan') {
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
									  FROM meditation_plan s
									   WHERE s.id = mp.plan_id
										) AS plan
							   FROM foundation_plan mp WHERE id = $1 AND mp.plan_type = $2
				 ORDER BY "createdat" DESC`, [req.body.id, 'meditation_plan']);
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
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "foundation_plan" WHERE plan_name ILIKE  $1`,[`${req.body.plan_name}%`]);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE plan_name ILIKE  $1 AND mp.plan_type = $2
		 ORDER BY "createdat" DESC`, [`${req.body.plan_name}%`, 'meditation_plan']);
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
		meditation_plan = await sql.query(`SELECT  mp.*, (
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
							  FROM meditation_plan s
							   WHERE s.id = mp.plan_id
								) AS plan
					   FROM foundation_plan mp WHERE plan_name ILIKE  $1 AND mp.plan_type = $2
		 ORDER BY "createdat" DESC  LIMIT $3 OFFSET $4`, [`${req.body.plan_name}%`, 'meditation_plan', limit, offset]);

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
			Foundation_plans_Meditations: meditation_plan.rows
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



module.exports = FoundationPlan;

//// create api to add a Foundation Plan
// create api to delete a Foundation Plan
// create api to search Foundation Plan
// create api to update Foundation Plan
// create api to get history of all Foundation Plan by a user
// create api to get all Foundation Plans
// create api to get a Foundation Plan by id
// create api to get all plans by completing skills
// create api to get all plans completed by a user
// create api to get all plans started by a user
// create api to change the plan status



// create api to start a plan
// create api to pause a plan
// create api to resume a plan
// create api to stop a plan
// create api to quit a plan
// create api to restart  plan

