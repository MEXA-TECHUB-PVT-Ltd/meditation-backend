
const { sql } = require("../config/db.config");

const Reminder = function (Reminder) {
	this.time = Reminder.time;
	this.user_id = Reminder.user_id;
	this.status = Reminder.status;
};

Reminder.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.reminder (
        id SERIAL NOT NULL,
		time text,
		user_id INTEGER,
        status text ,
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
			const { time, user_id,status } = req.body;

			const query = `INSERT INTO "reminder"
				 (id,time, user_id, status,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2,$3,'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[time,user_id, status]);
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
						message: "Reminder Added Successfully!",
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

Reminder.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "reminder" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Reminder Details",
				status: true,
				result: result.rows
			});
		}
	});
}



Reminder.search = async (req, res) => {
	sql.query(`SELECT * FROM "reminder" WHERE time ILIKE  $1 OR status ILIKE  $1 ORDER BY "createdat" DESC `
		, [`${req.body.timeOrStatus}%`], (err, result) => {
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


Reminder.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "reminder"`);
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "reminder" ORDER by createdat DESC `);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "reminder" ORDER by createdat DESC 
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "Reminder Details",
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



Reminder.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const ReminderData = await sql.query(`select * from "reminder" where id = $1`, [req.body.id]);
		const oldtime = ReminderData.rows[0].time;
		const oldstatus = ReminderData.rows[0].status;
		let { time, status, id } = req.body;

		if (time === undefined || time === '') {
			time = oldtime;
		}

		if (status === undefined || status === '') {
			status = oldstatus;
		}
		sql.query(`UPDATE "reminder" SET time =  $1, 
		status =  $2  WHERE id = $3;`,
			[time, status, id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {
						const data = await sql.query(`select * from "reminder" where id = $1`, [req.body.id]);
						res.json({
							message: "Reminder Updated Successfully!",
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


Reminder.delete = async (req, res) => {
	const data = await sql.query(`select * from "reminder" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "reminder" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Reminder Deleted Successfully!",
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
module.exports = Reminder;