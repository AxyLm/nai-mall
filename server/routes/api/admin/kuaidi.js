var express = require('express');
var router = express.Router();
const request = require('request');
// 自动匹配运单号所属的物流公司
function autoComNumber(orderno) {
	const url = `https://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=${orderno}`;
	var options = {
		url: url,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0'
		}
	};
	return new Promise(function (resolve, reject) {
		request(options, (err, response, body) => {
			if (err) return reject({ status: 500, msg: err.message });
			body = JSON.parse(body);
			if (body.auto.length <= 0) return reject({ status: 501, msg: '无对应的物流公司' });
			resolve({ status: 200, msg: body.auto[0], comCode: body.auto[0].comCode });
		});
	})
}

router.get('/:orderno', async function (req, res) {
	try {
		const result = await autoComNumber(req.params.orderno);
		if (result.status !== 200) {
			return {
				meta: {
					status: 500,
					msg: '获取物流信息失败！'
				}
			}
		}
		const dataUrl = `https://www.kuaidi100.com/query?type=${result.comCode}&postid=${req.params.orderno}&temp=${Math.random()}`;
		request(dataUrl, (err, response, body) => {
			if (err) {
				return res.send({
					meta: {
						status: 501,
						msg: '获取物流信息失败！'
					}
				});
			}
			// 获取物流信息成功
			res.send({
				meta: {
					status: 200,
					msg: '获取物流信息成功！'
				},
				data: (JSON.parse(body)).data
			});
		});
	} catch (error) {
		res.send({
			meta: {
				status: error.status,
				msg: error.msg
			},
			data: null
		});
	}
});

module.exports = router;