export default {
    state: {
        menus: [
            {
                "id": 125,
                "icon":"fa fa-user-circle",
                "authName": "用户管理",
                "path": "user",
                "children": [{
                    "id": 110,
                    "authName": "用户列表",
                    "path": "user/manager",
                    "children": [],
                    "order": null
                }],
                "order": 1
            }, {
                "id": 103,
                "icon":"fa fa-sitemap",
                "authName": "权限管理",
                "path": "rights",
                "children": [{
                    "id": 111,
                    "authName": "角色列表",
                    "path": "roles",
                    "children": [],
                    "order": null
                }, {
                    "id": 112,
                    "authName": "权限列表",
                    "path": "rights",
                    "children": [],
                    "order": null
                }],
                "order": 2
            }, {
                "id": 101,
                "icon":"fa fa-shopping-bag",
                "authName": "商品管理",
                "path": "goods",
                "children": [{
                    "id": 104,
                    "authName": "商品列表",
                    "path": "goods",
                    "children": [],
                    "order": 1
                }, {
                    "id": 115,
                    "authName": "分类参数",
                    "path": "params",
                    "children": [],
                    "order": 2
                }, {
                    "id": 121,
                    "authName": "商品分类",
                    "path": "categories",
                    "children": [],
                    "order": 3
                }],
                "order": 3
            }, {
                "id": 102,
                "icon":'fa fa-file-text',
                "authName": "订单管理",
                "path": "orders",
                "children": [{
                    "id": 107,
                    "authName": "订单列表",
                    "path": "orders",
                    "children": [],
                    "order": null
                }],
                "order": 4
            }, {
                "id": 145,
                "icon":"fa fa-pie-chart",
                "authName": "数据统计",
                "path": "reports",
                "children": [{
                    "id": 146,
                    "authName": "数据报表",
                    "path": "reports",
                    "children": [],
                    "order": null
                }],
                "order": 5
            }
        ]
    },
    mutations: {},
    actions: {},
    getters: {}
}