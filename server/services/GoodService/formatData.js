module.exports = function (good) {
    return {
        "id": good.id,
        "name": good.name,
        "price": good.price,
        "number": good.number,
        "weight": good.weight,
        "introduce": good.introduce,
        "big_logo": good.big_logo,
        "small_logo": good.small_logo,
        "state": good.state,
        "deleted": good.deleted == 1,
        "add_time": good.add_time,
        "upd_time": good.upd_time,
        "delete_time": good.delete_time,
        "is_promote": good.is_promote == 1,
        "promote_price": good.promote_price,
        "is_recomend": good.is_recomend == 1,
        "cat_id": good.cat_id,
        "cat_one_id": good.cat_one_id,
        "cat_two_id": good.cat_two_id,
        "cat_three_id": good.cat_three_id,
        "cat": good.cat,
        "pics": good.pics,
        "attrs": good.attrs,
        "sales": good.sales,
        "score": good.score
    }
}