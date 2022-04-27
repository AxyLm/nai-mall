const fs = require("fs");
const path = require("path");
const Sequelize = require('sequelize');
// 第三方模块：config，作用：加载配置文件
// ① 允许开发人员将不同运行环境下的应用配置信息抽离到单独的文件中，模块内部自动判断当前应用的运行环境，并读取对应的配置信息；
// ② 极大降低应用配置信息的维护成本，避免了当运行环境重复的多次切换时手动到项目代码中修改配置信息。
// 例如：要使用config文件夹中的production.json中的配置，首先设置环境变量，然后启动项目
// set NODE_ENV=production
// node app
const config = require('config').get("db_config");
const db = {
    models:{}
};

// 封装连接数据库方法
function connect() {
    const sequelize = new Sequelize(
        config.get("database"), config.get("user"), config.get("password"), 
        {
            protocol: config.get("protocol"),
            host: config.get("host"),
            port: config.get("port"),
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                idle: 20000
            },
            define: {
                underscored: true,
                timestamps: false,
            },
            operatorsAliases:{
                $and: Sequelize.Op.like,
                $or: Sequelize.Op.or,
                $eq: Sequelize.Op.eq,
                $ne: Sequelize.Op.ne,
                $is: Sequelize.Op.is,
                $not: Sequelize.Op.not,
                $gt: Sequelize.Op.gt,
                $gte: Sequelize.Op.gte,
                $lt: Sequelize.Op.lt,
                $lte: Sequelize.Op.lte,
                $between: Sequelize.Op.between,
                $notBetween: Sequelize.Op.notBetween,
                $notBetween: Sequelize.Op.notBetween,
                $in: Sequelize.Op.in,
                $notIn: Sequelize.Op.notIn,
                $like: Sequelize.Op.like,
                $notLike: Sequelize.Op.notLike,
                $startsWith: Sequelize.Op.startsWith,
                $endsWith: Sequelize.Op.endsWith,
                $substring: Sequelize.Op.substring,
                $regexp: Sequelize.Op.regexp,
                $notRegexp: Sequelize.Op.notRegexp
            }
        }
    );
    
    return new Promise((resolve, reject) => {
        sequelize.authenticate().then(() => {
            resolve(sequelize);
        }).catch(err => {
            reject({
                type: 1,
                info: err
            });
        });
    });
}

// 封装挂载模型的方法
function mountModels(sequelize, Sequelize) {
    return new Promise((resolve, reject) => {
        let modelsPath = path.join(process.cwd(), "/models");
        fs.readdir(modelsPath, function(err, files) {
            if (err) {
                return reject({
                    type: 2,
                    info: err
                });
            }
            files.filter(file => {
                return (file.indexOf('.') > 0) && (file.slice(-3) === '.js');
            }).forEach(file => {
                let model = require(path.join(modelsPath, file))(sequelize, Sequelize);
                db.models[model.name] = model;
                db.sequelize = sequelize;
                db.Sequelize = Sequelize;
            });
            if (db.models.ManagerModel&&db.models.RoleModel) {
                db.models.RoleModel.hasMany(db.models.ManagerModel,{
                    foreignKey:"role_id",
                    sourceKey:"id"
                });
                db.models.ManagerModel.belongsTo(db.models.RoleModel,{
                    foreignKey:"role_id",
                    targetKey:"id"
                });
            }
            if (db.models.GoodPicModel&&db.models.GoodModel) {
                db.models.GoodModel.hasMany(db.models.GoodPicModel,{
                    foreignKey:"good_id",
                    sourceKey:"id"
                });
                db.models.GoodPicModel.belongsTo(db.models.GoodModel,{
                    foreignKey:"good_id",
                    targetKey:"id"
                });
            }
            resolve(db);
        });
    });
}
// 封装读取install.lock文件的方法
function isInstall() {
    return new Promise((resolve, reject) => {
        fs.stat(path.join(process.cwd(), 'install.lock'), function(err,stats) {
            if (err) {
                return err.code == 'ENOENT' ? resolve(false): reject({
                    type: 3,
                    info: err
                });
            }
            return stats.isFile() ? resolve(true) : reject({
                type: 4,
                info: stats
            });
        });
    })
}

// 封装初始化数据库表的方法
function syncDB(db) {
    return new Promise((resolve, reject) => {
        db.sequelize.sync({ force: true }).then(_ => {
            resolve();
        }).catch(err => {
            reject({
                type: 5,
                info: err
            });
        });
    })
}

// 封装写出install.lock文件的方法
function writeInstall() {
    return new Promise((resolve, reject) => {
        fs.writeFile('install.lock', true, function(err) {
            if (err) {
                return reject({
                    type: 6,
                    info: err
                });
            }
            resolve();
        });
    })
}

module.exports.initialize =  async function(req, res, next) {
    if(global.database){
        req.db = global.database;
        return next();
    }
    try {
        let sequelize = await connect();
        let db = await mountModels(sequelize, Sequelize);
        let isIns = await isInstall();
        if(!isIns){
            // await syncDB(db);
            await writeInstall();
        }
        req.db = db;
        global.database = db;
        next();
    } catch (err) {
        if (err.type == 1) {
            console.log("数据库连接失败 %s", err.info);
        } else if (err.type == 2) {
            console.log("模型读取失败 %s", err.info);
        } else if (err.type == 3) {
            console.log("读取install.lock出错，请重试 %s", err.info);
        } else if (err.type == 4) {
            console.log("读取install.lock非文件，请检查 %s", err.info);
        } else if (err.type == 5) {
            console.log("数据库初始化失败 %s", err.info);
        } else if (err.type == 6) {
            console.log("写出install.lock出错，请重试 %s", err.info);
        }
    }
};
module.exports.getDatabase = function() {
    return global.database;
}