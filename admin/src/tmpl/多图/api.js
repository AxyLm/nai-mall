let api = {
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
}