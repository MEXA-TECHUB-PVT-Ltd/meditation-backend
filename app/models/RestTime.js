
const {sql} = require("../config/db.config");

const RestTime  = function (RestTime ) {
	this.user_id = RestTime.user_id;
	this.rest_time = RestTime.rest_time;

};
RestTime.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.rest_time  (
        id SERIAL NOT NULL,
		user_id SERIAL NOT NULL,
        rest_time text ,
        createdAt timestamp ,
        updatedAt timestamp  ,
        PRIMARY KEY (id))  ` , async (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			if (!req.body.user_id || req.body.user_id === '') {
				res.json({
					message: "Please Enter User ID",
					status: false,
				});
			} else {
				let { user_id, rest_time,   } = req.body;
				if(rest_time === ''|| rest_time === null || rest_time === undefined){
					rest_time = '30';
				}
				const query = `INSERT INTO "rest_time"
				 (id,user_id, rest_time, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[user_id, rest_time   ]);
				if (foundResult.rows.length > 0) {
					if (err) {
						res.json({
							message: "Try Again",
							 status : false,
							err
						});
					}
					else {
						res.json({
							message: "Rest Time Added Successfully!",
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

RestTime.viewSpecific = async (req, res) => {
	sql.query(`select *  from "rest_time"
	 where user_id = $1`, [req.body.user_id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status : false,
				err
			});
		} else {
			res.json({
				message: "Specific Rest Time",
				status : true,
				result: result.rows
			});
		}
	});
}

RestTime.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "rest_time"`);
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "rest_time" ORDER BY "createdat" DESC`);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "rest_time" ORDER BY "createdat" DESC
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "Rest Time   Details",
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

RestTime.updateTemporary  = async (req, res) => {
	if (req.body.user_id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		sql.query(`select id , user_id, createdat, updatedat  from "rest_time" where user_id = $1`,
			[req.body.user_id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount > 0) {	
						result.rows[0] = ({
							...result.rows[0],
							rest_time: req.body.rest_time,
						})
						res.json({
							message: "Rest Time Temporary updated Successfully!",
							status: true,
							result: result.rows,
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


RestTime.update  = async (req, res) => {
	if (req.body.user_id === '') {
		res.json({
			message: "user_id is required",
			status: false,
		});
	} else {
		const RestTimeData = await sql.query(`select * from "rest_time" where user_id = $1`, [req.body.user_id]);
		const oldrest_time = RestTimeData.rows[0].rest_time;

		let { id, user_id, rest_time, } = req.body;
		if (rest_time === undefined || rest_time === '') {
			rest_time = oldrest_time;
		}

		sql.query(`Update  "rest_time" SET rest_time = $1 WHERE user_id = $2;`,
			[ rest_time,user_id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {		
						const data = await sql.query(`select * from "rest_time" where user_id = $1`, [req.body.user_id]);
						res.json({
							message: "Rest Time updated Successfully!",
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


RestTime.delete = async (req, res) => {
	const data = await sql.query(`select * from "rest_time" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "rest_time" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Rest Time Deleted Successfully!",
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
module.exports = RestTime ;