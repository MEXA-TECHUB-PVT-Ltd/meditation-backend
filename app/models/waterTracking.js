
const { sql } = require("../config/db.config");

const waterTracking = function (waterTracking) {
	this.user_id = waterTracking.user_id;
	this.capacity = waterTracking.capacity;
	this.unit = waterTracking.unit
};

waterTracking.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.water_tracking (
        id SERIAL NOT NULL,
		user_id integer,
        capacity text ,
        unit text,
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
			const { user_id, capacity,unit } = req.body;
			if(capacity === undefined || capacity === null || capacity === '') {
				capacity = '2000';
				unit = 'ml';
			}
			const query = `INSERT INTO "water_tracking"
				 (id,user_id, capacity,unit,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3,'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[user_id, capacity, unit]);
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
						message: "water Tracking Added Successfully!",
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


waterTracking.dailyGoal = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.daily_goal (
        id SERIAL NOT NULL,
		user_id integer,
        tracker_id integer ,
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
			const { user_id, tracker_id } = req.body;

			const query = `INSERT INTO "daily_goal"
				 (id,user_id, tracker_id,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2,'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[user_id, tracker_id]);
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


waterTracking.updateDailyGoal = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const waterTrackingData = await sql.query(`select * from "daily_goal" where id = $1`, [req.body.id]);
		const oldtracker_id = waterTrackingData.rows[0].tracker_id;
		let { tracker_id,id } = req.body;

		if (tracker_id === undefined || tracker_id === '') {
			tracker_id = oldtracker_id;
		}
		sql.query(`UPDATE "daily_goal" SET tracker_id =  $1 WHERE id = $2;`,
			[tracker_id, id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {
						const data = await sql.query(`select * from "daily_goal" where id = $1`, [req.body.id]);
						res.json({
							message: "Daily Goal Updated Successfully!",
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

waterTracking.viewDailyGoal = (req, res) => {
	sql.query(`SELECT "daily_goal".*, "water_tracking".*  FROM "daily_goal" JOIN "water_tracking" 
	  ON "daily_goal".tracker_id = "water_tracking".id WHERE ( "daily_goal".user_id = $1)`, [req.body.user_id], (err, result) => {
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


waterTracking.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "water_tracking" WHERE ( user_id = $1 AND id = $2)`, [req.body.user_id, req.body.tracker_id ], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "water Tracking of a User",
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



waterTracking.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const waterTrackingData = await sql.query(`select * from "water_tracking" where id = $1`, [req.body.id]);
		const oldunit = waterTrackingData.rows[0].unit;
		const oldcapacity = waterTrackingData.rows[0].capacity;
		let { unit, capacity, id } = req.body;

		if (unit === undefined || unit === '') {
			unit = oldunit;
		}

		if (capacity === undefined || capacity === '') {
			capacity = oldcapacity;
		}
		sql.query(`UPDATE "water_tracking" SET unit =  $1, 
		capacity =  $2  WHERE id = $3;`,
			[unit, capacity, id], async (err, result) => {
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
							message: "water Tracking Updated Successfully!",
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
					message: "water Tracking Deleted Successfully!",
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
module.exports = waterTracking;