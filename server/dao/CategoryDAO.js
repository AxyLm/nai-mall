module.exports.changeDeleted = function (id,deleted,cb) {
    database.sequelize.query("CALL getCatChildren(?)",{
		replacements: [id],
	})
    .then(cids=>{
        var sql = "UPDATE `category` SET `deleted` = ? WHERE `id` in (?)";
        var cs = cids[0].temp.split(",");
        return database.sequelize.query(sql,{
            replacements:[deleted,cs]
        });
    })
    .then(_=>cb(null,null))
    .catch(err=>cb(err,null));
}