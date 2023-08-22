
const {sql} = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fastcsv = require("fast-csv");
const fs = require("fs");

const RelaxationMusic = function (RelaxationMusic) {
	this.music_name = RelaxationMusic.music_name;
	this.icon = RelaxationMusic.icon;
	this.description = RelaxationMusic.description;
	this.skill_id = RelaxationMusic.skill_id;
	this.time_duration = RelaxationMusic.time_duration;
	this.audio_file = RelaxationMusic.audio_file;
	this.payment_status = RelaxationMusic.payment_status;

};
RelaxationMusic.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.relaxation_music (
        id SERIAL NOT NULL,
		music_name text,
        icon text,
        description text,
		skill_id text[],
		time_duration text[] ,
        audio_file text,
		payment_status text,
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
			if (!req.body.music_name || req.body.music_name === '') {
				res.json({
					message: "Please Enter music_name",
					status: false,
				});
			} else {
				const { music_name, description,skill_id ,time_duration, 
					 payment_status } = req.body;
					 let photo = '';
					 let { id } = req.body;
					 console.log(req.file)
					 if (req.file) {
						 const { path } = req.file;
						 photo = path;
					 }
		 
				const query = `INSERT INTO "relaxation_music"
				 (id,music_name, icon,description,skill_id,time_duration ,audio_file , payment_status ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[music_name, '', description, skill_id, time_duration,photo, payment_status ]);
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
							message: "Relaxation Music Added Successfully!",
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

RelaxationMusic.addAudioFile = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "relaxation_music" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {
			let photo = userData.rows[0].audio_file;
			let { id } = req.body;
			console.log(id);
			if (req.file) {
				console.log(req.file);
				const { path } = req.file;
				photo = path;
			}

			sql.query(`UPDATE "relaxation_music" SET audio_file = $1 WHERE id = $2;`,
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
							const data = await sql.query(`select * from "relaxation_music" where id = $1`, [req.body.id]);
							res.json({
								message: "Audio File added Successfully!",
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

RelaxationMusic.addIcon = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const userData = await sql.query(`select * from "relaxation_music" where id = $1`, [req.body.id]);
		if (userData.rowCount === 1) {

			let photo = userData.rows[0].icon;
			let { id } = req.body;
			console.log(req.file)
			if (req.file) {
				const { path } = req.file;
				photo = path;
			}

			sql.query(`UPDATE "relaxation_music" SET icon = $1 WHERE id = $2;`,
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
							const data = await sql.query(`select * from "relaxation_music" where id = $1`, [req.body.id]);
							res.json({
								message: "relaxation_music icon added Successfully!",
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


RelaxationMusic.viewSpecific = async (req, res) => {
	// const data = await sql.query(`select COUNT(*) AS count from "relaxation_music"
	//  where id = $1`, [req.body.id]);
	sql.query(`SELECT *  FROM "relaxation_music" WHERE "relaxation_music".id = $1`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				payment_status: false,
				err
			});
		} else {
			res.json({
				message: "Specific Relaxation Music Details",
				status: true,
				// registed_people: data.rows[0].count,
				result: result.rows
			});
		}
	});
}

RelaxationMusic.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "relaxation_music"`);
	let limit = '10';
	let page = req.body.page;
	let result;
	if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "relaxation_music" ORDER BY "createdat" DESC`);
	}
	if (page && limit) {
		limit = parseInt(limit);
		let offset = (parseInt(page) - 1) * limit
		result = await sql.query(`SELECT * FROM "relaxation_music" ORDER BY "createdat" DESC
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
	}
	if (result.rows) {
		res.json({
			message: "All Relaxation Music Details",
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
RelaxationMusic.exportRelaxationMusic = async (req, res) => {
	const Data = await sql.query(`SELECT COUNT(*) AS count FROM "relaxation_music"`);
	sql.query(`SELECT * FROM "relaxation_music" WHERE time_duration <= $1`,["NOW"], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			const jsonData = JSON.parse(JSON.stringify(result.rows));
			console.log("jsonData", jsonData);
			const ws = fs.createWriteStream(`./images_uploads/ActiveRelaxationMusic${description.now()}.csv`);
			const file = fastcsv
			  .write(jsonData, { headers: true })
			  .on("finish", function() {
				console.log("Export to CSV Successfully!");
			  })
			  .pipe(ws);
			res.json({
				message: "Active RelaxationMusic Exported File",
				status: true,
				total: Data.rows[0].count,
				result: `localhost:3008/${file.path}`
			});
		}
	});
}

RelaxationMusic.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		console.log(req.body.id);
		const RelaxationMusicData = await sql.query(`select * from "relaxation_music" where id = $1`, [req.body.id]);
		if(RelaxationMusicData.rowCount>0){
		const oldmusic_name = RelaxationMusicData.rows[0].music_name;
		const olddescription = RelaxationMusicData.rows[0].description;
		const oldskill_id = RelaxationMusicData.rows[0].skill_id;
		const oldtime_duration = RelaxationMusicData.rows[0].time_duration;
		const oldaudio_file = RelaxationMusicData.rows[0].audio_file;
		const oldpayment_status = RelaxationMusicData.rows[0].payment_status;
		let { id, music_name, description,skill_id, time_duration , payment_status  } = req.body;
		if (music_name === undefined || music_name === '') {
			music_name = oldmusic_name;
		}
		if (description === undefined || description === '') {
			description = olddescription;
		}
		if (skill_id === undefined || skill_id === '') {
            skill_id = oldskill_id;
        }
		if (time_duration === undefined || time_duration === '') {
			time_duration = oldtime_duration;
		}
		let photo =  RelaxationMusicData.rows[0].audio_file;
		if (req.file) {
			const { path } = req.file;
			photo = path;
		}
	if (payment_status === undefined || payment_status === '') {
            payment_status = oldpayment_status;
        }
		sql.query(`update "relaxation_music" SET music_name = $1,
		description = $2, skill_id = $3, time_duration = $4 , audio_file = $5,
		payment_status = $6 WHERE id = $7;`,
			[music_name, description, skill_id, time_duration, photo, payment_status , id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {		
						const data = await sql.query(`select * from "relaxation_music" where id = $1`, [req.body.id]);
						res.json({
							message: "Relaxation Music Updated Successfully!",
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
		}else{
			res.json({
				message: "Not Found",
				status: false,
			});
		}
	}
}


RelaxationMusic.search = async (req, res) => {
	sql.query(`SELECT * FROM "relaxation_music" WHERE music_name ILIKE  $1 ORDER BY "createdat" DESC `
		, [`${req.body.music_name}%`], (err, result) => {
			if (err) {
				console.log(err);
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "relaxation_music Search's data",
					status: true,
					result: result.rows,
				});
			}
		});
}

RelaxationMusic.delete = async (req, res) => {
	const data = await sql.query(`select * from "relaxation_music" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "relaxation_music" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "RelaxationMusic Deleted Successfully!",
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
module.exports = RelaxationMusic;
