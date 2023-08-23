
const {sql} = require("../config/db.config");

const Favorites  = function (Favorites ) {
	this.user_id = Favorites.user_id;
	this.favorites_id = Favorites.favorites_id;


};
Favorites.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.favorites  (
        id SERIAL NOT NULL,
		user_id INTEGER,
        favorites_id INTEGER ,
		fav_type text,
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
				let { user_id, favorites_id,fav_type   } = req.body;
				const query = `INSERT INTO "favorites"
				 (id,user_id, favorites_id,fav_type, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2,$3, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[user_id, favorites_id,fav_type   ]);
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
							message: "Added to Favorite Successfully!",
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

Favorites.viewSpecific = async (req, res) => {
	sql.query(`select *  from "favorites"
	 where id = $1 , user_id = $2`, [req.body.id,req.body.user_id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status : false,
				err
			});
		} else {
			res.json({
				message: "Specific favorites",
				status : true,
				result: result.rows
			});
		}
	});
}
Favorites.viewAll_by_type = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "favorites" WHERE user_id = $1 AND fav_type = $2 `, [req.body.user_id, req.body.fav_type]);
	let limit = req.body.limit;
	let page = req.body.page;
	let fav_type = req.body.fav_type;
	let user_id = req.body.user_id;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "favorites" WHERE user_id = $1 AND Fav_type = $2 ORDER BY "createdat" DESC`, [req.body.user_id,req.body.fav_type]);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT "favorites".fav_type , ${fav_type}.* 
		 FROM "favorites"  JOIN ${fav_type} ON  "favorites".favorites_id = ${fav_type}.id WHERE "favorites".user_id = $1 AND "favorites".fav_type = $2 ORDER BY "createdat" DESC
		LIMIT $3 OFFSET $4 ` , [user_id,fav_type,limit, offset]);

	}
	if (result.rows) {
		res.json({
			message: "favorites Details",
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

Favorites.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "favorites" WHERE user_id = $1`, [req.body.user_id]);
	let limit = req.body.limit;
	let page = req.body.page;
	let meditation_plan;
	let yoga_plan;
	let foundation_plan;
	let relaxation_music;
	if (!page || !limit) {
		result = await sql.query(`SELECT "favorites".fav_type FROM "favorites" JOIN WHERE user_id = $1 ORDER BY "createdat" DESC`, [req.body.user_id]);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		meditation_plan = await sql.query(`SELECT "favorites".fav_type , "meditation_plan".* 
		 FROM "favorites"  JOIN "meditation_plan" ON  "favorites".favorites_id = meditation_plan.id WHERE "favorites".user_id = $1 AND "favorites".fav_type = $2 ORDER BY "createdat" DESC
		LIMIT $3 OFFSET $4 ` , [req.body.user_id,'meditation_plan',limit, offset]);

		yoga_plan = await sql.query(`SELECT "favorites".fav_type , "yoga_plan".* 
		 FROM "favorites"  JOIN "yoga_plan" ON  "favorites".favorites_id = yoga_plan.id WHERE "favorites".user_id = $1 AND "favorites".fav_type = $2 ORDER BY "createdat" DESC
		LIMIT $3 OFFSET $4 ` , [req.body.user_id,'yoga_plan',limit, offset]);

		foundation_plan = await sql.query(`SELECT "favorites".fav_type , "foundation_plan".* 
		FROM "favorites"  JOIN "foundation_plan" ON  "favorites".favorites_id = foundation_plan.id WHERE "favorites".user_id = $1 AND "favorites".fav_type = $2 ORDER BY "createdat" DESC
	   LIMIT $3 OFFSET $4 ` , [req.body.user_id,'foundation_plan',limit, offset]);
	relaxation_music = await sql.query(`SELECT "favorites".fav_type , "relaxation_music".* 
	FROM "favorites"  JOIN "relaxation_music" ON  "favorites".favorites_id = relaxation_music.id WHERE "favorites".user_id = $1 AND "favorites".fav_type = $2 ORDER BY "createdat" DESC
   LIMIT $3 OFFSET $4 ` , [req.body.user_id,'relaxation_music',limit, offset]);

	}
	if (meditation_plan.rows) {
		res.json({
			message: "favorites Details",
			status: true,
			count: data.rows[0].count,
			meditation_plan: meditation_plan.rows,
			yoga_plan: yoga_plan.rows,
			foundation_plan: foundation_plan.rows,
			relaxation_music: relaxation_music.rows,


		});
	} else {
		res.json({
			message: "could not fetch",
			status: false
		})
	}
}

Favorites.unFav = async (req, res) => {
	const data = await sql.query(`select * from "favorites" where id = $1 AND user_id = $2 `, [req.body.favorites_id, req.body.user_id ]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "favorites" where id = $1 AND user_id = $2 `, [req.body.favorites_id, req.body.user_id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Un-Favorite Successfully!",
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
module.exports = Favorites ;