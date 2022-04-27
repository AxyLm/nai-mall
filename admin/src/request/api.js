import call from "./call";
export default {
    upload: {
        single(files, type) {
            return new Promise((resolve, reject) => {
                let formData = new FormData();
                formData.append("file", files[0]);
                call({
                    url: "/upload" + (type ? "/" + type : ""),
                    method: "post",
                    data: formData
                }).then(res => {
                    if (res.meta.status != 200) {
                        reject(res.meta);
                    } else {
                        resolve(res.data);
                    }
                }).catch(err => {
                    reject(err);
                });
            });
        },
        multiple(files, type) {
            return new Promise((resolve, reject) => {
                let arr = new Array();
                let cnt = 0;
                for (let i = 0; i < files.length; i++) {
                    let formData = new FormData();
                    formData.append("file", files[i]);
                    call({
                        url: "/upload" + (type ? "/" + type : ""),
                        method: "post",
                        data: formData
                    }).then(res => {
                        arr.push({ sn: i, url: res.url });
                        cnt++;
                        if (cnt == files.length) resolve(arr);
                    }).catch(res => {
                        cnt++;
                        if (cnt == files.length) reject(arr);
                    })
                }
            })
        }
    },
    auth: {
        login(username, password) {
            return {
                method: 'post',
                url: '/getToken',
                data: { username, password }
            }
        },
        refresh(refresh_token) {
            return {
                method: "post",
                url: "/refreshToken",
                headers:{
                    Authorization: refresh_token
                },
                hasToken: false
            }
        },
    },
    managers: {
        insert() {
            return {
                method: 'post',
                url: '/managers/insert',
            }
        },
        delete(uid) {
            return {
                method: 'delete',
                url: '/managers/delete/' + uid,
            }
        },
        batchDelete() {
            return {
                method: 'delete',
                url: '/managers/batchDelete'
            }
        },
        update(uid) {
            return {
                method: 'put',
                url: '/managers/update/' + uid,
            }
        },
        updateRole(uid) {
            return {
                method: 'put',
                url: '/managers/updateRole/' + uid,
            }
        },
        updateDeleted(uid) {
            return {
                method: 'put',
                url: '/managers/updateDeleted/' + uid,
            }
        },
        getPage(pagenum, pagesize, data = {}) {
            return {
                method: 'post',
                url: '/managers/getPage',
                params: { pagenum, pagesize },
                data
            }
        },
        getByID(id) {
            return {
                method: 'get',
                url: '/managers/getByID/' + id,
            }
        },
        getMe(){
            return {
                method: 'get',
                url: '/managers/getMe',
            }
        }
    },
    member: {
        insert() {
            return {
                method: 'post',
                url: '/member/insert'
            }
        },
        delete(id) {
            return {
                method: 'delete',
                url: '/member/delete/' + id
            }
        },
        batchDelete() {
            return {
                method: 'delete',
                url: '/member/batchDelete'
            }
        },
        update(id) {
            return {
                method: 'put',
                url: '/member/update/' + id
            }
        },
        updateDeleted(id) {
            return {
                method: 'put',
                url: '/member/updateDeleted/' + id
            }
        },
        getPage() {
            return {
                method: 'post',
                url: '/member/getPage',
            }
        },
        getByID(id) {
            return {
                method: 'get',
                url: '/member/getByID/' + id,
            }
        }
    },
    roles: {
        insert() {
            return {
                method: 'post',
                url: '/roles/insert'
            }
        },
        delete(roleID) {
            return {
                method: 'delete',
                url: '/roles/delete/' + roleID
            }
        },
        batchDelete() {
            return {
                method: 'delete',
                url: '/roles/batchDelete/'
            }
        },
        update(roleID) {
            return {
                method: 'put',
                url: '/roles/update/' + roleID
            }
        },
        updateRights(roleID) {
            return {
                method: 'post',
                url: '/roles/updateRights/' + roleID
            }
        },
        deleteRights(roleID) {
            return {
                method: 'delete',
                url: '/roles/deleteRights/' + roleID,
            }
        },
        getAll() {
            return {
                method: 'post',
                url: '/roles/getAll',
            }
        },
        getByID(roleID) {
            return {
                method: 'get',
                url: '/roles/getByID/' + roleID,
            }
        }
    },
    permission: {
        getAllRights(type = 'list') {
            return {
                method: 'get',
                url: '/rights/getAll/' + type
            }
        },
        getMyRights(){
            return {
                method: 'get',
                url: '/rights/getMy'
            }
        },
        menus() {
            return {
                method: 'get',
                url: '/menus',
            }
        }
    },
    categoryAttr: {
        insert() {
            return {
                method: 'post',
                url: '/categoryAttr/insert'
            }
        },
        delete(attrID) {
            return {
                method: 'delete',
                url: '/categoryAttr/delete/' + attrID
            }
        },
        update(attrID) {
            return {
                method: 'put',
                url: '/categoryAttr/update/' + attrID
            }
        },
        getAll() {
            return {
                method: 'get',
                url: '/categoryAttr/getAll',
            }
        },
        getByID(attrID) {
            return {
                method: 'get',
                url: '/categoryAttr/getByID/' + attrID,
            }
        }
    },
    category: {
        insert() {
            return {
                method: 'post',
                url: '/category/insert'
            }
        },
        delete(catID) {
            return {
                method: 'delete',
                url: '/category/delete/' + catID
            }
        },
        batchDelete() {
            return {
                method: 'delete',
                url: '/category/batchDelete'
            }
        },
        update(catID) {
            return {
                method: 'put',
                url: '/category/update/' + catID
            }
        },
        updateDeleted(goodID) {
            return {
                method: 'put',
                url: '/category/updateDeleted/' + goodID
            }
        },
        getTreeOrList() {
            return {
                method: 'post',
                url: '/category/getTreeOrList',
            }
        },
        getByID(catID) {
            return {
                method: 'get',
                url: '/category/getByID/' + catID,
            }
        }
    },
    good: {
        insert() {
            return {
                method: 'post',
                url: '/good/insert'
            }
        },
        delete(goodID) {
            return {
                method: 'delete',
                url: '/good/delete/' + goodID
            }
        },
        batchDelete() {
            return {
                method: 'delete',
                url: '/good/batchDelete'
            }
        },
        update(goodID) {
            return {
                method: 'put',
                url: '/good/update/' + goodID
            }
        },
        updateDeleted(goodID) {
            return {
                method: 'put',
                url: '/good/updateDeleted/' + goodID
            }
        },
        updateRecomend(goodID) {
            return {
                method: 'put',
                url: '/good/updateRecomend/' + goodID
            }
        },
        submit(goodID) {
            return {
                method: 'put',
                url: '/good/submit/' + goodID
            }
        },
        audit(goodID) {
            return {
                method: 'put',
                url: '/good/audit/' + goodID
            }
        },
        getPage(pagenum, pagesize, data = {}) {
            return {
                method: 'post',
                url: '/good/getPage',
                params: { pagenum, pagesize },
                data
            }
        },
        getByID(goodID) {
            return {
                method: 'get',
                url: '/good/getByID/' + goodID,
            }
        }
    },
    banner: {
        insert() {
            return {
                method: 'post',
                url: '/banner/insert'
            }
        },
        delete(id) {
            return {
                method: 'delete',
                url: '/banner/delete/' + id
            }
        },
        batchDelete() {
            return {
                method: 'delete',
                url: '/banner/batchDelete'
            }
        },
        update(id) {
            return {
                method: 'put',
                url: '/banner/update/' + id
            }
        },
        updateDeleted(id) {
            return {
                method: 'put',
                url: '/banner/updateDeleted/' + id
            }
        },
        getPage() {
            return {
                method: 'post',
                url: '/banner/getPage',
            }
        },
        getByID(id) {
            return {
                method: 'get',
                url: '/banner/getByID/' + id,
            }
        }
    },
    order: {
        insert() {
            return {
                method: 'post',
                url: '/order/insert'
            }
        },
        update(orderID) {
            return {
                method: 'put',
                url: '/order/update/' + orderID
            }
        },
        updatePrice(orderID) {
            return {
                method: 'put',
                url: '/order/updatePrice/' + orderID
            }
        },
        updateDelivery(orderID) {
            return {
                method: 'put',
                url: '/order/updateDelivery/' + orderID
            }
        },
        getPage() {
            return {
                method: 'post',
                url: '/order/getPage',
            }
        },
        getByID(orderID) {
            return {
                method: 'get',
                url: '/order/getByID/' + orderID,
            }
        },
        closeOrder(orderID) {
            return {
                method: 'put',
                url: '/order/closeOrder/' + orderID,
            }
        }
    },
    comment: {
        insert() {
            return {
                method: 'post',
                url: '/comment/insert'
            }
        },
        delete(id) {
            return {
                method: 'delete',
                url: '/comment/delete/' + id
            }
        },
        batchDelete() {
            return {
                method: 'delete',
                url: '/comment/batchDelete'
            }
        },
        update(id) {
            return {
                method: 'put',
                url: '/comment/update/' + id
            }
        },
        updateDeleted(id) {
            return {
                method: 'put',
                url: '/comment/updateDeleted/' + id
            }
        },
        getPage() {
            return {
                method: 'post',
                url: '/comment/getPage',
            }
        },
        getByID(id) {
            return {
                method: 'get',
                url: '/comment/getByID/' + id,
            }
        }
    },
    delivery:{
        process(code){
            return {
                method: 'get',
                url: '/kuaidi/' + code,
            }
        }
    },
    config: {
        update(id) {
            return {
                method: 'put',
                url: '/config/update/' + id
            }
        },
        getByID(id) {
            return {
                method: 'get',
                url: '/config/getByID/' + id,
            }
        }
    },
    configStore: {
        insert() {
            return {
                method: 'post',
                url: '/configStore/insert'
            }
        },
        delete(id) {
            return {
                method: 'delete',
                url: '/configStore/delete/' + id
            }
        },
        batchDelete() {
            return {
                method: 'delete',
                url: '/configStore/batchDelete'
            }
        },
        update(id) {
            return {
                method: 'put',
                url: '/configStore/update/' + id
            }
        },
        updateDeleted(id) {
            return {
                method: 'put',
                url: '/configStore/updateDeleted/' + id
            }
        },
        getPage() {
            return {
                method: 'post',
                url: '/configStore/getPage',
            }
        },
        getByID(id) {
            return {
                method: 'get',
                url: '/configStore/getByID/' + id,
            }
        }
    },
    configPay: {
        insert() {
            return {
                method: 'post',
                url: '/configPay/insert'
            }
        },
        delete(id) {
            return {
                method: 'delete',
                url: '/configPay/delete/' + id
            }
        },
        batchDelete() {
            return {
                method: 'delete',
                url: '/configPay/batchDelete'
            }
        },
        update(id) {
            return {
                method: 'put',
                url: '/configPay/update/' + id
            }
        },
        updateDeleted(id) {
            return {
                method: 'put',
                url: '/configPay/updateDeleted/' + id
            }
        },
        getPage() {
            return {
                method: 'post',
                url: '/configPay/getPage',
            }
        },
        getByID(id) {
            return {
                method: 'get',
                url: '/configPay/getByID/' + id,
            }
        }
    },
    freight: {
        insert() {
            return {
                method: 'post',
                url: '/freight/insert'
            }
        },
        delete(id) {
            return {
                method: 'delete',
                url: '/freight/delete/' + id
            }
        },
        batchDelete() {
            return {
                method: 'delete',
                url: '/freight/batchDelete'
            }
        },
        update(id) {
            return {
                method: 'put',
                url: '/freight/update/' + id
            }
        },
        updateDeleted(id) {
            return {
                method: 'put',
                url: '/freight/updateDeleted/' + id
            }
        },
        getPage() {
            return {
                method: 'post',
                url: '/freight/getPage',
            }
        },
        getByID(id) {
            return {
                method: 'get',
                url: '/freight/getByID/' + id,
            }
        }
    },
}