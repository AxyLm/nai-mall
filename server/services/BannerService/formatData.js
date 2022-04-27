var upload_config = require("config").get("upload_config");
module.exports = function (data) {
	return {
		"id": data.id,
		"img_url": upload_config.get("baseURL") + data.img_url,
		"target": data.target,
		"sort": data.sort,
		"desc": data.desc,
		"deleted": data.deleted == 1,
		"add_time": data.add_time,
		"upd_time": data.upd_time
	}
}