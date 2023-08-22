const { sql } = require("../config/db.config");

const YogaPlan = function (YogaPlan) {
	this.plan_name = YogaPlan.plan_name;
	this.user_id = YogaPlan.user_id;
	this.icon = YogaPlan.icon;
	this.description = YogaPlan.description;
	this.duration = YogaPlan.duration;
	this.goal_id = YogaPlan.goal_id;
	this.age_group = YogaPlan.age_group;
	this.level = YogaPlan.level;
	this.skills_id = YogaPlan.skills_id;
	this.exercises_id = YogaPlan.exercises_id;
	this.started_at = YogaPlan.started_at;
	this.payment_status = YogaPlan.payment_status;
	this.progress_status = YogaPlan.progress_status;

};
YogaPlan.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.yoga_plan (
        id SERIAL NOT NULL,
		plan_name text,
		user_id integer,
        icon text,
        description text,	
		duration text,
		goals_id integer[],
		age_group text ,
        level text,
		skills_id integer[],
		exercises_id integer[],
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
				let { plan_name, user_id, description, duration, goals_id, age_group,
					level, skills_id,
					started_at, exercises_id,
					payment_status,
					progress_status } = req.body;
				if (user_id === '') {
					user_id = null;
				}
				const query = `INSERT INTO "yoga_plan"
				 (id,plan_name, user_id ,icon,description,duration,goals_id,age_group ,level, skills_id,exercises_id,
					started_at ,
					payment_status ,
					progress_status ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12,$13, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[plan_name, user_id, '', description, duration, goals_id, age_group, level, skills_id, exercises_id,
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
							message: "Yoga Plan Added Successfully!",
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
YogaPlan.viewAllPlan = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "yoga_plan"`);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 , (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id)
								) AS skills

						, (
							SELECT json_agg( 
								json_build_object('id', s.id,'Exercise_name', s.name, 'Exercise_duration', s.duration,
								'Exercise_Animation', s.animations,'Exercise_description', s.description,
								'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
								)
									)
									FROM exercise s
									WHERE s.id = ANY(mp.exercises_id)
										) AS exercise
					   FROM yoga_plan mp
		 ORDER BY "createdat" DESC`);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 

					 , (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id)
								) AS skills

						, (
							SELECT json_agg( 
								json_build_object('id', s.id,'Exercise_name', s.name,
								'Exercise_Animation', s.animations,'Exercise_description', s.description,
								'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
								)
									)
									FROM exercise s
									WHERE s.id = ANY(mp.exercises_id)
										) AS exercise
			 

					   FROM yoga_plan mp  ORDER BY "createdat" DESC
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "All Plan Details",
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
YogaPlan.viewCompleted = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "yoga_plan" WHERE progress_status = 'completed'`);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
	
					 , (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id)
								) AS skills
	
						, (
							SELECT json_agg( 
								json_build_object('id', s.id,'Exercise_name', s.name,
								'Exercise_Animation', s.animations,'Exercise_description', s.description,
								'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
								)
									)
									FROM exercise s
									WHERE s.id = ANY(mp.exercises_id)
										) AS exercise
					   FROM manage_yoga_plan mp  WHERE plan_status = 'completed' 
		 ORDER BY "createdat" DESC`);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
	
					 , (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id)
								) AS skills
	
						, (
							SELECT json_agg( 
								json_build_object('id', s.id,'Exercise_name', s.name,
								'Exercise_Animation', s.animations,'Exercise_description', s.description,
								'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
								)
									)
									FROM exercise s
									WHERE s.id = ANY(mp.exercises_id)
										) AS exercise
					   FROM yoga_plan mp  WHERE progress_status = 'completed' ORDER BY "createdat" DESC
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "Completed Plan Details",
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
YogaPlan.viewCompleted_user = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "yoga_plan" WHERE  user_id = $1 
	AND progress_status = 'completed'`, [req.body.user_id]);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
	
					 , (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id)
								) AS skills
	
						, (
							SELECT json_agg( 
								json_build_object('id', s.id,'Exercise_name', s.name,
								'Exercise_Animation', s.animations,'Exercise_description', s.description,
								'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
								)
									)
									FROM exercise s
									WHERE s.id = ANY(mp.exercises_id)
										) AS exercise
					   FROM yoga_plan mp  WHERE  user_id = $1 AND progress_status = 'completed' 
		 ORDER BY "createdat" DESC`, [req.body.user_id]);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
	
					 , (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id)
								) AS skills
	
						, (
							SELECT json_agg( 
								json_build_object('id', s.id,'Exercise_name', s.name,
								'Exercise_Animation', s.animations,'Exercise_description', s.description,
								'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
								)
									)
									FROM exercise s
									WHERE s.id = ANY(mp.exercises_id)
										) AS exercise
					   FROM yoga_plan mp  WHERE user_id = $1 AND progress_status = 'completed' ORDER BY "createdat" DESC
		LIMIT $2 OFFSET $3 ` , [req.body.user_id, limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "User's Completed Plan Details",
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

YogaPlan.viewStarted_user = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "yoga_plan" WHERE  user_id = $1 
	AND progress_status = 'started'`, [req.body.user_id]);
	let limit = req.body.limit;
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
	
					 , (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id)
								) AS skills
	
						, (
							SELECT json_agg( 
								json_build_object('id', s.id,'Exercise_name', s.name,
								'Exercise_Animation', s.animations,'Exercise_description', s.description,
								'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
								)
									)
									FROM exercise s
									WHERE s.id = ANY(mp.exercises_id)
										) AS exercise
					   FROM yoga_plan mp  WHERE  user_id = $1 AND progress_status = 'started' 
		 ORDER BY "createdat" DESC`, [req.body.user_id]);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
	
					 , (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id)
								) AS skills
	
						, (
							SELECT json_agg( 
								json_build_object('id', s.id,'Exercise_name', s.name,
								'Exercise_Animation', s.animations,'Exercise_description', s.description,
								'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
								)
									)
									FROM exercise s
									WHERE s.id = ANY(mp.exercises_id)
										) AS exercise
					   FROM yoga_plan mp  WHERE user_id = $1 AND progress_status = 'started' ORDER BY "createdat" DESC
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
			message: "could not fetch",
			status: false
		})
	}
}

YogaPlan.addIcon = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "yoga_plan" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].icon;
			let { id } = req.body;
			console.log(req.file)
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}

			sql.query(`UPDATE "yoga_plan" SET icon = $1 WHERE id = $2;`,
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
							const data = await sql.query(`select * from "yoga_plan" where id = $1`, [req.body.id]);
							res.json({
								message: "Yoga Plan icon added Successfully!",
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
YogaPlan.viewSpecific = async (req, res) => {
	sql.query(`SELECT  mp.*, (
		SELECT json_agg( 
		   json_build_object('id',g.id,'goal_name', g.name
		   )
			   )
			   FROM goal g
				WHERE g.id = ANY(mp.goals_id)
				 ) AS goals 

				 , (
				   SELECT json_agg( 
					  json_build_object('id', s.id,'skill_name', s.skill_name,
					  'skill_icon', s.icon,'skill_description', s.discription,
					  'skill_benefit', s.benefit,'skill_createdat', s.createdat
					  )
						  )
						  FROM skill s
						   WHERE s.id = ANY(mp.skills_id)
							) AS skills

					, (
						SELECT json_agg( 
							json_build_object('id', s.id,'Exercise_name', s.name,
							'Exercise_Animation', s.animations,'Exercise_description', s.description,
							'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
							)
								)
								FROM exercise s
								WHERE s.id = ANY(mp.exercises_id)
									) AS exercise
				   FROM yoga_plan mp WHERE id = $1`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				payment_status: false,
				err
			});
		} else {
			res.json({
				message: "Specific Yoga Plan Details",
				status: true,
				result: result.rows
			});
		}
	});
}

YogaPlan.search = async (req, res) => {
	sql.query(`SELECT  mp.*, (
		SELECT json_agg( 
		   json_build_object('id',g.id,'goal_name', g.name
		   )
			   )
			   FROM goal g
				WHERE g.id = ANY(mp.goals_id)
				 ) AS goals 

				 , (
				   SELECT json_agg( 
					  json_build_object('id', s.id,'skill_name', s.skill_name,
					  'skill_icon', s.icon,'skill_description', s.discription,
					  'skill_benefit', s.benefit,'skill_createdat', s.createdat
					  )
						  )
						  FROM skill s
						   WHERE s.id = ANY(mp.skills_id)
							) AS skills

					, (
						SELECT json_agg( 
							json_build_object('id', s.id,'Exercise_name', s.name,
							'Exercise_Animation', s.animations,'Exercise_description', s.description,
							'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
							)
								)
								FROM exercise s
								WHERE s.id = ANY(mp.exercises_id)
									) AS exercise
				   FROM yoga_plan mp WHERE plan_name ILIKE  $1 ORDER BY "createdat" DESC `
		, [`${req.body.plan_name}%`], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Yoga Plan Search's data",
					status: true,
					result: result.rows,
				});
			}
		});
}
YogaPlan.delete = async (req, res) => {
	const data = await sql.query(`select * from "yoga_plan" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "yoga_plan" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Yoga Plan Deleted Successfully!",
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
YogaPlan.changePlanStatus = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "Please Enter id",
			status: false,
		});
	} else {
		const data = await sql.query(`select * from "yoga_plan" where id = $1`, [req.body.id]);
		if (data.rowCount === 1) {
			sql.query(`UPDATE "yoga_plan" SET progress_status = $1 WHERE id = $2;`, [req.body.status, req.body.id], async (err, result) => {
				if (err) {
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else
					if (result.rowCount === 1) {
						const data = await sql.query(`SELECT  mp.*, (
							SELECT json_agg( 
							   json_build_object('id',g.id,'goal_name', g.name
							   )
								   )
								   FROM goal g
									WHERE g.id = ANY(mp.goals_id)
									 ) AS goals 
					
									 , (
									   SELECT json_agg( 
										  json_build_object('id', s.id,'skill_name', s.skill_name,
										  'skill_icon', s.icon,'skill_description', s.discription,
										  'skill_benefit', s.benefit,'skill_createdat', s.createdat
										  )
											  )
											  FROM skill s
											   WHERE s.id = ANY(mp.skills_id)
												) AS skills
					
										, (
											SELECT json_agg( 
												json_build_object('id', s.id,'Exercise_name', s.name,
												'Exercise_Animation', s.animations,'Exercise_description', s.description,
												'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
												)
													)
													FROM exercise s
													WHERE s.id = ANY(mp.exercises_id)
														) AS exercise
									   FROM yoga_plan mp where id = $1`, [req.body.id]);
						res.json({
							message: "Yoga Plan status Updated Successfully!",
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
YogaPlan.viewHistory_Plan_user = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "yoga_plan" WHERE user_id = $1`, [req.body.user_id]);
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
	
					 , (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id)
								) AS skills
	
						, (
							SELECT json_agg( 
								json_build_object('id', s.id,'Exercise_name', s.name,
								'Exercise_Animation', s.animations,'Exercise_description', s.description,
								'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
								)
									)
									FROM exercise s
									WHERE s.id = ANY(mp.exercises_id)
										) AS exercise
					   FROM yoga_plan mp
					   where "mp".user_id = $1
		ORDER BY "createdat" DESC`, [req.body.user_id]);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT  mp.*, (
			SELECT json_agg( 
			   json_build_object('id',g.id,'goal_name', g.name
			   )
				   )
				   FROM goal g
					WHERE g.id = ANY(mp.goals_id)
					 ) AS goals 
	
					 , (
					   SELECT json_agg( 
						  json_build_object('id', s.id,'skill_name', s.skill_name,
						  'skill_icon', s.icon,'skill_description', s.discription,
						  'skill_benefit', s.benefit,'skill_createdat', s.createdat
						  )
							  )
							  FROM skill s
							   WHERE s.id = ANY(mp.skills_id)
								) AS skills
	
						, (
							SELECT json_agg( 
								json_build_object('id', s.id,'Exercise_name', s.name,
								'Exercise_Animation', s.animations,'Exercise_description', s.description,
								'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
								)
									)
									FROM exercise s
									WHERE s.id = ANY(mp.exercises_id)
										) AS exercise
					   FROM yoga_plan mp
					   where "mp".user_id = $1 
		ORDER BY "createdat" DESC
		LIMIT $2 OFFSET $3 ` , [req.body.user_id, limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "History Plan Details",
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
YogaPlan.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		console.log(req.body.id);
		const RelaxationMusicData = await sql.query(`select * from "yoga_plan" where id = $1`, [req.body.id]);
		if (RelaxationMusicData.rowCount > 0) {
			const oldplan_name = RelaxationMusicData.rows[0].plan_name;
			const olddescription = RelaxationMusicData.rows[0].description;
			const oldgoals_id = RelaxationMusicData.rows[0].goals_id;
			const oldage_group = RelaxationMusicData.rows[0].age_group;

			const oldLevel = RelaxationMusicData.rows[0].level;
			const oldSkills_id = RelaxationMusicData.rows[0].skills_id;
			const oldexercises_id = RelaxationMusicData.rows[0].exercises_id;
			const oldStarted_at = RelaxationMusicData.rows[0].started_at;
			const oldProgress_status = RelaxationMusicData.rows[0].progress_status;
			const oldpayment_status = RelaxationMusicData.rows[0].payment_status;
			let { id, plan_name, description, goals_id, age_group, level, skills_id, exercises_id, started_at, progress_status, payment_status } = req.body;

			if (started_at === undefined || started_at === '') {
				started_at = oldStarted_at;
			}
			if (payment_status === undefined || payment_status === '') {
				payment_status = oldpayment_status;
			}
			if (skills_id === undefined || skills_id === '') {
				skills_id = oldSkills_id;
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
			if (exercises_id === undefined || exercises_id === '') {
				exercises_id = oldexercises_id;
			}
			sql.query(`update "yoga_plan" SET plan_name = $1,
		description = $2, goals_id = $3, age_group = $4 ,level=$5, skills_id  = $6 , exercises_id = $7,
		started_at = $8, payment_status = $9, progress_status = $10 WHERE id = $11;`,
				[plan_name, description, goals_id, age_group, level, skills_id, exercises_id, started_at, payment_status, progress_status, id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`SELECT  mp.*, (
								SELECT json_agg( 
								   json_build_object('id',g.id,'goal_name', g.name
								   )
									   )
									   FROM goal g
										WHERE g.id = ANY(mp.goals_id)
										 ) AS goals 
						
										 , (
										   SELECT json_agg( 
											  json_build_object('id', s.id,'skill_name', s.skill_name,
											  'skill_icon', s.icon,'skill_description', s.discription,
											  'skill_benefit', s.benefit,'skill_createdat', s.createdat
											  )
												  )
												  FROM skill s
												   WHERE s.id = ANY(mp.skills_id)
													) AS skills
						
											, (
												SELECT json_agg( 
													json_build_object('id', s.id,'Exercise_name', s.name,
													'Exercise_Animation', s.animations,'Exercise_description', s.description,
													'Exercise_Audio_file', s.audio_file,'Exercise_createdat', s.createdat
													)
														)
														FROM exercise s
														WHERE s.id = ANY(mp.exercises_id)
															) AS exercise
										   FROM yoga_plan mp where id = $1`, [req.body.id]);
							res.json({
								message: "Yoga Plan Updated Successfully!",
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

YogaPlan.start = async (req, res) => {
	if (req.body.plan_id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const RelaxationMusicData = await sql.query(`select * from "yoga_plan" where id = $1`, [req.body.plan_id]);
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
			sql.query(`update "yoga_plan" SET started_at = $1,duration = $2, progress_status = $3 WHERE id = $4;`,
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
							sql.query(`CREATE TABLE IF NOT EXISTS public.manage_yoga_plan (
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
	

										const managePlan = await sql.query(`select * from "manage_yoga_plan" 
											where plan_id = $1 AND user_id = $2`, [req.body.plan_id, req.body.user_id]);
										if (managePlan.rowCount > 0) {

											const managePlan = await sql.query(`update "manage_yoga_plan" SET skills_id_completed = $1,
											skill_id_on_going = $2, exercises_id = $3,started_at = $4,  plan_status = $5 ,duration=$6 
											WHERE plan_id = $7 AND user_id = $8;`,
												[[], null, [], started_at, progress_status, duration,
												req.body.plan_id, req.body.user_id]);
											if (managePlan.rowCount > 0) {
												const updatedPlan = await sql.query(`select * from "manage_yoga_plan" where plan_id = $1 AND user_id = $2`, [req.body.plan_id, req.body.user_id]);
												const History = sql.query(`INSERT INTO history (id ,user_id, action_id, action_type, 
													action_table, start_date, status ,createdAt ,updatedAt )
												VALUES (DEFAULT, $1  ,  $2, $3,  $4 ,$5,$6, 'NOW()', 'NOW()') RETURNING * `
													, [req.body.user_id, req.body.plan_id, 'Re-Start Plan', 'yoga_plan',
													'NOW()',  'started'])

												res.json({
													message: "Yoga Plan Re-Started (Progress 0%) Successfully!",
													status: true,
													result:updatedPlan.rows
												});
											} else {
												res.json({
													message: "Try Again",
													status: false,
													err
												});
											}
										} else {
											const query = `INSERT INTO "manage_yoga_plan"
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
													const History = sql.query(`INSERT INTO history (id ,user_id, action_id, action_type, 
														action_table, start_date, status ,createdAt ,updatedAt )
													VALUES (DEFAULT, $1  ,  $2, $3,  $4 ,$5,$6, 'NOW()', 'NOW()') RETURNING * `
														, [req.body.user_id, req.body.plan_id, 'Start Plan', 'yoga_plan',
														'NOW()',  'started'])
	
													res.json({
														message: "Yoga Plan Started Successfully!",
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
YogaPlan.updateStartedPlan = async (req, res) => {
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
		const RelaxationMusicData = await sql.query(`select * from "yoga_plan" where id = $1`, [req.body.plan_id]);
		if (RelaxationMusicData.rowCount > 0) {
			const RelaxationMusic = await sql.query(`select * from "manage_yoga_plan" where plan_id = $1 AND user_id = $2`, [req.body.plan_id, req.body.user_id]);
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
				sql.query(`update "manage_yoga_plan" SET skills_id_completed = $1,
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
									const updatedPlan = await sql.query(`select * from "manage_yoga_plan" where plan_id = $1 AND user_id = $2`, [req.body.plan_id, req.body.user_id]);
									if(progress_status === 'completed'){
										const History = sql.query(`UPDATE history SET end_date = $1 , updatedAt = $2
										, status = $3
										WHERE  user_id = $4 AND action_id = $5 AND action_table = $6`
											, ['NOW()', 'NOW()', 'completed' ,req.body.user_id, req.body.plan_id, 'yoga_plan'])	
									}			
									res.json({
										message: "Yoga Plan Updated Successfully!",
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
YogaPlan.viewProgress_plan_skill_user = async (req, res) => {
	const data = await sql.query(`select * from "manage_yoga_plan" where 
	plan_id = $1 AND user_id = $2`, [req.body.plan_id , req.body.user_id]);
	if (data.rowCount > 0) {
		let status = 'not started';


		for(let i = 0  ; i < data.rows[0].skills_id_completed.length ; i++) {
			if(data.rows[0].skills_id_completed[i] == req.body.skill_id){
				status = 'Completed';
			}
		}

		if(data.rows[0].skill_id_on_going == req.body.skill_id){
			status = '(start) On Going';
		}
		res.json({
			message: "Skill in that Plan status",
			status: true,
			result: status,
		});
	}else{
		res.json({
			message: "Plan with that user isn't available",
			status: false,
		});

	}

}
YogaPlan.view_completed_skills_plan = async (req, res) => {
	const data = await sql.query(`select * from "manage_yoga_plan" where 
	plan_id = $1 AND user_id = $2`, [req.body.plan_id , req.body.user_id]);
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
					   FROM manage_yoga_plan mp WHERE
					   plan_id = $1 AND user_id = $2`, [req.body.plan_id , req.body.user_id]);
		if (data.rowCount > 0) {		

			res.json({
				message: "All Completed Skill in that Plan",
				status: true,
				result:skills.rows
			});
			
		}else	{
		res.json({
			message: "Try Again",
			status: false,
		});
	}
	}else{
		res.json({
			message: "Plan with that user isn't available",
			status: false,
		});

	}

}
YogaPlan.view_completed_skills_User = async (req, res) => {
	const data = await sql.query(`select * from "manage_yoga_plan" where 
	user_id = $1`, [ req.body.user_id]);
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
					   FROM manage_yoga_plan mp WHERE
					    user_id = $1`, [ req.body.user_id]);
		if (data.rowCount > 0) {		

			res.json({
				message: "All Completed Skill by a User",
				status: true,
				result:skills.rows
			});
			
		}else	{
		res.json({
			message: "Try Again",
			status: false,
		});
	}
	}else{
		res.json({
			message: "Plan with that user isn't available",
			status: false,
		});

	}

}
YogaPlan.view_completed_Exercises_User = async (req, res) => {
	const data = await sql.query(`select * from "manage_yoga_plan" where 
	user_id = $1`, [ req.body.user_id]);
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
					   FROM manage_yoga_plan mp WHERE
					    user_id = $1`, [ req.body.user_id]);
		if (data.rowCount > 0) {		

			res.json({
				message: "All Completed Exercises by a User",
				status: true,
				result:skills.rows
			});
			
		}else	{
		res.json({
			message: "Try Again",
			status: false,
		});
	}
	}else{
		res.json({
			message: "Plan with that user isn't available",
			status: false,
		});

	}

}
YogaPlan.quitPlan = async (req, res) => {
	const data = await sql.query(`select * from "manage_yoga_plan" where 
	user_id = $1 AND plan_id  = $2`, [req.body.user_id, req.body.plan_id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "manage_yoga_plan" where 
		user_id = $1 AND plan_id  = $2`, [req.body.user_id, req.body.plan_id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Yoga Plan Quit Successfully!",
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

YogaPlan.view_All_Exercises_User = async (req, res) => {
	const data = await sql.query(`select * from "manage_yoga_plan" where 
	user_id = $1`, [ req.body.user_id]);
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
							   WHERE s.id = ANY(MMP.exercises_id)
								) AS exercise
					   FROM manage_yoga_plan  mp JOIN  yoga_plan MMP 
					   ON mp.plan_id  = MMP.id WHERE
					   mp.user_id = $1 ORDER BY MMP.createdat DESC`, [ req.body.user_id]);
		if (data.rowCount > 0) {		

			res.json({
				message: "All Exercises by a User",
				status: true,
				result:skills.rows
			});
			
		}else	{
		res.json({
			message: "Try Again",
			status: false,
		});
	}
	}else{
		res.json({
			message: "Plan with that user isn't available",
			status: false,
		});

	}

}


module.exports = YogaPlan;

//// create api to add a Yoga Plan
// create api to delete a Yoga Plan
// create api to search Yoga Plan
// create api to update Yoga Plan
// create api to get history of all Yoga Plan by a user
// create api to get all Yoga Plans
// create api to get a Yoga Plan by id
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

