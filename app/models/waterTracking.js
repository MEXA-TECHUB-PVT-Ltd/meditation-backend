
const { sql } = require("../config/db.config");

const waterTracking = function (waterTracking) {
	this.user_id = waterTracking.user_id;
	this.capacity = waterTracking.capacity;
	this.start_at = waterTracking.start_at;
	this.week_starts = waterTracking.week_days;
	this.daily_intake = waterTracking.daily_intake;
	this.weekly_intake = waterTracking.weekly_intake;

};

waterTracking.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.water_tracking (
        id SERIAL NOT NULL,
		user_id integer,
        capacity text ,
		start_at timestamp,
		week_starts  timestamp,
		daily_intake integer,
		weekly_intake  integer,
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
			const { user_id, capacity, start_at, daily_intake, weekly_intake } = req.body;
			if (capacity === undefined || capacity === null || capacity === '') {
				capacity = '2000';
			}
			const query = `INSERT INTO "water_tracking"
				 (id,user_id, capacity,start_at,daily_intake,weekly_intake,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2,$3,$4,$5,'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[user_id, capacity, start_at, 0, 0]);
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
						message: "Daily Goal Added Successfully!",
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
waterTracking.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const waterTrackingData = await sql.query(`select * from "water_tracking" where id = $1`, [req.body.id]);
		const oldcapacity = waterTrackingData.rows[0].capacity;
		let { capacity, id } = req.body;
		if (capacity === undefined || capacity === '') {
			capacity = oldcapacity;
		}
		sql.query(`UPDATE "water_tracking" SET 
		capacity =  $1  WHERE id = $2;`,
			[capacity, id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {
						const data = await sql.query(`select * from "water_tracking" where id = $1`, [req.body.id]);
						res.json({
							message: "set Daily Goal Successfully!",
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

waterTracking.delete = async (req, res) => {
	const data = await sql.query(`select * from "water_tracking" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "water_tracking" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Daily Goal Deleted Successfully!",
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
waterTracking.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "water_tracking" WHERE ( user_id = $1 OR id = $2)`, [req.body.user_id, req.body.tracker_id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Daily Goal of a User",
				status: true,
				result: result.rows
			});
		}
	});
}

//start Water tracking
waterTracking.dailyGoal = async (req, res) => {
	const waterTrackingData = await sql.query(`select * from "water_tracking" where id = $1`, [req.body.tracker_id]);
	if (waterTrackingData.rowCount > 0) {
		const { user_id, tracker_id, start_at, daily_intake } = req.body;
		const addStart_at = `UPDATE "water_tracking" SET start_at =  $1 
			 WHERE user_id = $2 AND id = $3; `;
		const found = await sql.query(addStart_at,
			[start_at, user_id, tracker_id]);

		const check = await sql.query(`SELECT AGE(start_at, 'NOW()') AS difference FROM water_tracking where id = $1`, [req.body.tracker_id]);
		let oldWeekly_intake = waterTrackingData.rows[0].weekly_intake;
		let week_starts = waterTrackingData.rows[0].week_starts;
		if (check.rowCount > 0) {
			if (check.rows[0].difference.days) {
				if (check.rows[0].difference.days <= 7) {
					oldWeekly_intake += parseInt(daily_intake);
				} else {
					oldWeekly_intake = 0;
					week_starts = start_at;
					oldWeekly_intake += parseInt(daily_intake);
				}
			} else {
				oldWeekly_intake += parseInt(daily_intake);
			}
		}

		if (week_starts === null) {
			week_starts = start_at
		}

		const query = `UPDATE "water_tracking" SET start_at =  $1 , daily_intake = $2,weekly_intake = $3,
		week_starts  = $4 WHERE user_id = $5 AND id = $6; `;
		const foundResult = await sql.query(query,
			[start_at, daily_intake, oldWeekly_intake, week_starts, user_id, tracker_id]);
		if (foundResult.rowCount > 0) {
			const waterTrackingData = await sql.query(`select * from "water_tracking" where id = $1`, [req.body.tracker_id]);
			res.json({
				message: "Water Intake Added Successfully!",
				status: true,
				result: waterTrackingData.rows,
			});
		} else {
			res.json({
				message: "Try Again",
				status: false,
			});
		}
	} else {
		res.json({
			message: "Wrong Daily Goal ID",
			status: false,
		});

	}


}

//update Water tracking
waterTracking.updateDailyGoal = async (req, res) => {
	const waterTrackingData = await sql.query(`select * from "water_tracking" where id = $1`, [req.body.tracker_id]);
	if (waterTrackingData.rowCount > 0) {
		const check = await sql.query(`SELECT AGE(start_at, 'NOW') AS difference FROM water_tracking where id = $1`, [req.body.tracker_id]);
		if (check.rows[0].difference.days) {
			res.json({
				message: "New Day, Start Water Intake Again!",
				status: false,
			});
		} else {
			const { user_id, tracker_id, daily_intake } = req.body;
			let oldDaily_intake = waterTrackingData.rows[0].daily_intake;
			oldDaily_intake += parseInt(daily_intake);
			let oldWeekly_intake = waterTrackingData.rows[0].weekly_intake;
			oldWeekly_intake += parseInt(daily_intake);
			const query = `UPDATE "water_tracking" SET daily_intake = $1,weekly_intake = $2
			 WHERE user_id = $3 AND id = $4; `;
			const foundResult = await sql.query(query,
				[oldDaily_intake, oldWeekly_intake, user_id, tracker_id]);
			if (foundResult.rowCount > 0) {
				const waterTrackingData = await sql.query(`select * from "water_tracking" where id = $1`, [req.body.tracker_id]);
				res.json({
					message: "Water Intake Updated Successfully!",
					status: true,
					result: waterTrackingData.rows,
				});
			} else {
				res.json({
					message: "Try Again",
					status: false,
				});
			}
		}
	} else {
		res.json({
			message: "Wrong Daily Goal ID",
			status: false,
		});

	}


}

// waterTracking.updateDailyGoal = async (req, res) => {
// 	if (req.body.id === '') {
// 		res.json({
// 			message: "id is required",
// 			status: false,
// 		});
// 	} else {
// 		const waterTrackingData = await sql.query(`select * from "daily_goal" where id = $1`, [req.body.id]);
// 		const oldtracker_id = waterTrackingData.rows[0].tracker_id;
// 		let { tracker_id,id } = req.body;

// 		if (tracker_id === undefined || tracker_id === '') {
// 			tracker_id = oldtracker_id;
// 		}
// 		sql.query(`UPDATE "daily_goal" SET tracker_id =  $1 WHERE id = $2;`,
// 			[tracker_id, id], async (err, result) => {
// 				if (err) {
// 					console.log(err);
// 					res.json({
// 						message: "Try Again",
// 						status: false,
// 						err
// 					});
// 				} else {
// 					if (result.rowCount === 1) {
// 						const data = await sql.query(`select * from "daily_goal" where id = $1`, [req.body.id]);
// 						res.json({
// 							message: "Daily Goal Updated Successfully!",
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
waterTracking.viewDailyGoal = (req, res) => {
	sql.query(`SELECT  *  FROM  "water_tracking"  WHERE ( user_id = $1)`, [req.body.user_id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Daily Goal of a User",
				status: true,
				result: result.rows
			});
		}
	});
}

waterTracking.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "water_tracking"`);
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "water_tracking" ORDER by createdat DESC `);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "water_tracking" ORDER by createdat DESC 
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "waterTracking Details",
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

module.exports = waterTracking;