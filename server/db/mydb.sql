/*
Navicat MySQL Data Transfer

Source Server         : my
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : mydb

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2022-04-25 07:02:13
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `user_id` int(10) unsigned NOT NULL COMMENT '会员id',
  `receive_name` varchar(50) NOT NULL COMMENT '收货人',
  `receive_tel` varchar(11) NOT NULL COMMENT '收货人电话',
  `receive_address` varchar(255) NOT NULL COMMENT '收货地址',
  `area_code` int(6) unsigned NOT NULL COMMENT '地区编码',
  `is_default` tinyint(1) unsigned NOT NULL COMMENT '是否默认',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of address
-- ----------------------------

-- ----------------------------
-- Table structure for banner
-- ----------------------------
DROP TABLE IF EXISTS `banner`;
CREATE TABLE `banner` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `img_url` varchar(255) NOT NULL COMMENT '轮播图地址',
  `target` varchar(255) NOT NULL COMMENT '跳转目标地址',
  `sort` tinyint(4) unsigned NOT NULL COMMENT '轮播图序号',
  `desc` varchar(255) DEFAULT NULL COMMENT '轮播图说明',
  `deleted` tinyint(2) DEFAULT NULL COMMENT '0:禁用  1:启用',
  `add_time` int(10) DEFAULT NULL COMMENT '创建时间',
  `upd_time` int(10) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of banner
-- ----------------------------
INSERT INTO `banner` VALUES ('22', '/uploads/banner/d20993aeb632212120b18acfee819131.jpg', 'http://www.baidu.com', '0', '漫漫人生路，步步意尔康', '1', '1642394717', null);
INSERT INTO `banner` VALUES ('23', '/uploads/banner/5d165d9de794c1d9f2c46ae9c426ff2a.jpg', 'http://www.google.com', '0', '好客山东欢迎你', '1', '1646736290', null);

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `user_id` int(10) unsigned NOT NULL COMMENT '会员id',
  `cat_one_id` int(10) unsigned NOT NULL COMMENT '一级分类id',
  `cat_two_id` int(10) unsigned NOT NULL COMMENT '二级分类id',
  `cat_three_id` int(10) unsigned NOT NULL COMMENT '三级分类id',
  `good_id` int(10) unsigned DEFAULT NULL COMMENT '商品id',
  `good_count` int(10) unsigned NOT NULL COMMENT '商品数量',
  PRIMARY KEY (`id`),
  KEY `frk_gd_2` (`good_id`),
  CONSTRAINT `frk_gd_2` FOREIGN KEY (`good_id`) REFERENCES `good` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cart
-- ----------------------------

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '分类唯一ID',
  `name` varchar(32) NOT NULL COMMENT '分类名称',
  `pid` int(10) NOT NULL COMMENT '分类父ID',
  `level` int(4) DEFAULT NULL COMMENT '分类层级 0: 顶级 1:二级 2:三级',
  `icon` varchar(255) DEFAULT NULL,
  `src` text,
  `deleted` int(2) DEFAULT '0' COMMENT '0：禁用 1：启用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('1', '菲茨', '0', '0', null, null, '1');
INSERT INTO `category` VALUES ('2', '可耐圈', '0', '0', null, null, '1');
INSERT INTO `category` VALUES ('3', '服装', '0', '0', null, null, '1');
INSERT INTO `category` VALUES ('4', '其他', '0', '0', null, null, '1');
INSERT INTO `category` VALUES ('7', '面部护理', '1', '1', null, null, '1');
INSERT INTO `category` VALUES ('8', '面膜', '7', '2', null, null, '1');
INSERT INTO `category` VALUES ('9', '身体护理', '1', '1', null, null, '1');
INSERT INTO `category` VALUES ('10', '眼膜', '7', '2', null, null, '1');
INSERT INTO `category` VALUES ('11', '护手霜', '9', '2', null, null, '1');
INSERT INTO `category` VALUES ('12', '润肤乳', '9', '2', null, null, '1');

-- ----------------------------
-- Table structure for category_attr
-- ----------------------------
DROP TABLE IF EXISTS `category_attr`;
CREATE TABLE `category_attr` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `name` varchar(32) NOT NULL COMMENT '属性名称',
  `cat_id` int(10) unsigned NOT NULL COMMENT '外键，类型id',
  `type` enum('static','dynamic') NOT NULL DEFAULT 'static' COMMENT 'static:输入框(唯一)  dynamic:后台下拉列表/前台单选框',
  `write` enum('manual','list') NOT NULL DEFAULT 'manual' COMMENT 'manual:手工录入  list:从列表选择',
  `vals` text NOT NULL COMMENT '可选值列表信息,例如颜色：白色,红色,绿色,多个可选值通过逗号分隔',
  PRIMARY KEY (`id`),
  KEY `type_id` (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COMMENT='属性表';

-- ----------------------------
-- Records of category_attr
-- ----------------------------
INSERT INTO `category_attr` VALUES ('1', '净含量', '8', 'dynamic', 'list', '20g,40g');
INSERT INTO `category_attr` VALUES ('2', '品牌', '8', 'static', 'manual', 'PHYT’S/菲茨');
INSERT INTO `category_attr` VALUES ('3', '品名', '8', 'static', 'manual', '');
INSERT INTO `category_attr` VALUES ('4', '产地', '8', 'static', 'manual', '法国');
INSERT INTO `category_attr` VALUES ('5', '面膜分类', '8', 'static', 'manual', '');
INSERT INTO `category_attr` VALUES ('6', '适合肤质', '8', 'static', 'manual', '任何肤质');
INSERT INTO `category_attr` VALUES ('7', '原料成分', '8', 'static', 'manual', '');
INSERT INTO `category_attr` VALUES ('8', '功效', '8', 'static', 'manual', '');
INSERT INTO `category_attr` VALUES ('9', '规格类型', '8', 'static', 'manual', '正常规格');
INSERT INTO `category_attr` VALUES ('10', '是否为特殊用途化妆品', '8', 'static', 'manual', '否');
INSERT INTO `category_attr` VALUES ('11', '净含量', '8', 'static', 'manual', '');
INSERT INTO `category_attr` VALUES ('13', '净含量', '10', 'dynamic', 'list', '20g,40g');
INSERT INTO `category_attr` VALUES ('14', '品牌', '10', 'static', 'manual', 'PHYT\'S/菲茨');
INSERT INTO `category_attr` VALUES ('15', '单品', '10', 'static', 'manual', '其他/other');
INSERT INTO `category_attr` VALUES ('16', '产地', '10', 'static', 'manual', '法国');
INSERT INTO `category_attr` VALUES ('17', '适合肤质', '10', 'static', 'manual', '任何肤质');
INSERT INTO `category_attr` VALUES ('18', '功效', '10', 'static', 'manual', '修护 保湿 滋润 补水 提拉紧致 提');
INSERT INTO `category_attr` VALUES ('19', '规格类型', '10', 'static', 'manual', '正常规格');
INSERT INTO `category_attr` VALUES ('20', '是否为特殊用途化妆品', '10', 'static', 'manual', '否');
INSERT INTO `category_attr` VALUES ('21', '净含量', '2', 'dynamic', 'list', '20g,40g');
INSERT INTO `category_attr` VALUES ('22', '保质期', '8', 'static', 'manual', '1年');

-- ----------------------------
-- Table structure for collection
-- ----------------------------
DROP TABLE IF EXISTS `collection`;
CREATE TABLE `collection` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `user_id` int(10) unsigned NOT NULL COMMENT '会员id',
  `good_id` int(10) unsigned DEFAULT NULL COMMENT '商品id',
  PRIMARY KEY (`id`),
  KEY `frk_gd_1` (`good_id`),
  CONSTRAINT `frk_gd_1` FOREIGN KEY (`good_id`) REFERENCES `good` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of collection
-- ----------------------------

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `order_id` int(10) unsigned NOT NULL COMMENT '订单id',
  `order_code` varchar(32) NOT NULL COMMENT '订单编号',
  `good_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL COMMENT '会员id',
  `user_name` varchar(32) NOT NULL,
  `content` text NOT NULL COMMENT '评价内容',
  `overall_rating` tinyint(1) unsigned NOT NULL COMMENT '综合评分',
  `good_rating` tinyint(1) unsigned NOT NULL COMMENT '商品描述评分',
  `delivery_rating` tinyint(1) unsigned NOT NULL COMMENT '物流服务评分',
  `service_rating` tinyint(1) NOT NULL COMMENT '服务态度评分',
  `add_time` int(10) unsigned DEFAULT NULL COMMENT '创建时间',
  `upd_time` int(10) unsigned DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) unsigned DEFAULT NULL COMMENT '0:禁用  1:启用',
  PRIMARY KEY (`id`),
  KEY `frk_od` (`order_id`),
  CONSTRAINT `frk_od` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES ('3', '91', 'tj7h441qckyh2i6sp', '1', '500', 'admin', '产品很好', '4', '5', '4', '4', '1643289425', null, '1');
INSERT INTO `comment` VALUES ('4', '91', 'tj7h441qckyh2i6sp', '1', '500', 'admin', '很好!很好!很好!', '5', '5', '5', '5', '1643291021', null, '1');

-- ----------------------------
-- Table structure for comment_pic
-- ----------------------------
DROP TABLE IF EXISTS `comment_pic`;
CREATE TABLE `comment_pic` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `comment_id` int(10) unsigned NOT NULL COMMENT '评价id',
  `src` varchar(255) NOT NULL COMMENT '图片路径',
  PRIMARY KEY (`id`),
  KEY `frk_cmt` (`comment_id`),
  CONSTRAINT `frk_cmt` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comment_pic
-- ----------------------------
INSERT INTO `comment_pic` VALUES ('1', '4', '/uploads/commentpics/f4ce82d9780b8c4a09549ee2755d2a2a.jpg');

-- ----------------------------
-- Table structure for config
-- ----------------------------
DROP TABLE IF EXISTS `config`;
CREATE TABLE `config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '配置id',
  `register_info` longtext COMMENT '注册条款',
  `aftersale_info` longtext COMMENT '售后说明',
  `server_tel` varchar(15) DEFAULT NULL COMMENT '客服电话',
  `aftersale_tel` varchar(15) DEFAULT NULL COMMENT '售后电话',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of config
-- ----------------------------
INSERT INTO `config` VALUES ('1', '<p><strong style=\"background-color: rgb(230, 0, 0); color: rgb(255, 255, 255);\">注册条款<span class=\"ql-cursor\">﻿</span></strong></p>', '<p><img src=\"http://192.168.1.33:8888/uploads/ueditor/cc987c1d28de8027dee0089ccfa134a1.png\"></p>', '15225420962', '17630504200');

-- ----------------------------
-- Table structure for config_pay
-- ----------------------------
DROP TABLE IF EXISTS `config_pay`;
CREATE TABLE `config_pay` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `name` varchar(32) NOT NULL COMMENT '支付方式名称',
  `sort` tinyint(4) unsigned NOT NULL COMMENT '排序号',
  `deleted` tinyint(2) DEFAULT NULL COMMENT '0:禁用  1:启用',
  `add_time` int(10) DEFAULT NULL COMMENT '创建时间',
  `upd_time` int(10) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of config_pay
-- ----------------------------
INSERT INTO `config_pay` VALUES ('1', '支付宝', '1', '1', '1644744056', null);
INSERT INTO `config_pay` VALUES ('2', '微信', '2', '1', '1644744103', null);

-- ----------------------------
-- Table structure for config_store
-- ----------------------------
DROP TABLE IF EXISTS `config_store`;
CREATE TABLE `config_store` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `name` varchar(100) NOT NULL COMMENT '门店名称',
  `area_code` varchar(6) NOT NULL COMMENT '地区编码',
  `area_info` varchar(255) NOT NULL COMMENT '省/市/县区',
  `street_info` varchar(255) NOT NULL COMMENT '乡镇街道信息',
  `add_time` int(10) unsigned DEFAULT NULL COMMENT '创建时间',
  `upd_time` int(10) unsigned DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) unsigned DEFAULT NULL COMMENT '0:禁用  1:启用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_ac` (`area_code`) USING BTREE COMMENT '区域代码唯一索引'
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of config_store
-- ----------------------------
INSERT INTO `config_store` VALUES ('1', '门店1', '110101', '北京市北京市东城区', 'xxx', '1644734846', null, '1');
INSERT INTO `config_store` VALUES ('2', '门店2', '110102', '北京市北京市西城区', 'ccc', '1644735761', null, '1');
INSERT INTO `config_store` VALUES ('3', '门店3', '110105', '北京市北京市朝阳区', 'vvv', '1644735777', null, '1');

-- ----------------------------
-- Table structure for freight
-- ----------------------------
DROP TABLE IF EXISTS `freight`;
CREATE TABLE `freight` (
  `id` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `name` varchar(255) NOT NULL COMMENT '模板名称',
  `delivery_time` varchar(4) NOT NULL COMMENT '几小时内发货',
  `good_addr_code` varchar(6) NOT NULL COMMENT '商品地址编码',
  `good_addr_info` varchar(255) NOT NULL COMMENT '商品详细地址信息',
  `is_free` tinyint(1) unsigned NOT NULL COMMENT '是否包邮：0-自定义运费 1-包邮',
  `price_method` tinyint(1) unsigned DEFAULT NULL COMMENT '计价方式：0-按重量 1-按件数 2-按体积',
  `specify_free_condition` tinyint(1) unsigned DEFAULT NULL COMMENT '是否指定包邮条件：0-否 1-是',
  `deleted` tinyint(1) unsigned DEFAULT NULL COMMENT '0:禁用  1:启用',
  `add_time` int(10) unsigned DEFAULT NULL COMMENT '创建时间',
  `upd_time` int(10) unsigned DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of freight
-- ----------------------------
INSERT INTO `freight` VALUES ('0000000012', '包邮模板', '72', '410303', '河南省洛阳市西工区', '1', null, '0', '1', '1645098155', null);
INSERT INTO `freight` VALUES ('0000000015', '自定义运费模板', '72', '410303', '河南省洛阳市西工区', '0', '1', '1', '1', '1645100142', null);

-- ----------------------------
-- Table structure for freight_condition
-- ----------------------------
DROP TABLE IF EXISTS `freight_condition`;
CREATE TABLE `freight_condition` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `freight_id` int(10) unsigned DEFAULT NULL COMMENT '外键id',
  `area_code` varchar(255) DEFAULT NULL COMMENT '包邮地区编码：存地区编码，以逗号分隔',
  `area_info` varchar(255) DEFAULT NULL COMMENT '包邮地区信息：存地区名称，以逗号分隔',
  `delivery_way` tinyint(1) unsigned DEFAULT NULL COMMENT '运送方式：快递-0，EMS-1，平邮-2',
  `condition` varchar(12) DEFAULT NULL COMMENT '包邮条件：weight、piece、volume、money、weight-money、piece-money、volume-money',
  `weight_no` decimal(18,2) unsigned DEFAULT NULL COMMENT '包邮重量',
  `piece_no` int(10) unsigned DEFAULT NULL COMMENT '包邮件数',
  `volume_no` decimal(18,2) unsigned DEFAULT NULL COMMENT '包邮体积',
  `money` decimal(18,2) unsigned DEFAULT NULL COMMENT '包邮金额',
  PRIMARY KEY (`id`),
  KEY `frk_freight2` (`freight_id`),
  CONSTRAINT `frk_freight2` FOREIGN KEY (`freight_id`) REFERENCES `freight` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of freight_condition
-- ----------------------------
INSERT INTO `freight_condition` VALUES ('13', '15', '650100,650200,650400,650500,652300,652700,652800,652900,653000,653100,653200,654000,654200,654300,659000', '新疆维吾尔自治区乌鲁木齐市,新疆维吾尔自治区克拉玛依市,新疆维吾尔自治区吐鲁番市,新疆维吾尔自治区哈密市,新疆维吾尔自治区昌吉回族自治州,新疆维吾尔自治区博尔塔拉蒙古自治州,新疆维吾尔自治区巴音郭楞蒙古自治州,新疆维吾尔自治区阿克苏地区,新疆维吾尔自治区克孜勒苏柯尔克孜自治州,新疆维吾尔自治区喀什地区,新疆维吾尔自治区和田地区,新疆维吾尔自治区伊犁哈萨克自治州,新疆维吾尔自治区塔城地区,新疆维吾尔自治区阿勒泰地区,新疆维吾尔自治区自治区直辖县级行政区划', '0', 'piece-money', null, '3', null, '199.00');

-- ----------------------------
-- Table structure for freight_delivery
-- ----------------------------
DROP TABLE IF EXISTS `freight_delivery`;
CREATE TABLE `freight_delivery` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `freight_id` int(10) unsigned DEFAULT NULL COMMENT '模板表外键',
  `area_code` varchar(255) DEFAULT NULL COMMENT '配送地区编码：存地区编码，以逗号分隔',
  `area_info` varchar(255) DEFAULT NULL COMMENT '配送地区信息：存地区名称，以逗号分隔',
  `first_weight` decimal(18,2) unsigned DEFAULT NULL COMMENT '首重重量',
  `first_piece` int(10) unsigned DEFAULT NULL COMMENT '首件数量',
  `first_volume` decimal(18,2) unsigned DEFAULT NULL COMMENT '首体积大小',
  `first_money` decimal(18,2) unsigned NOT NULL COMMENT '首费',
  `second_weight` decimal(18,2) unsigned DEFAULT NULL COMMENT '续重',
  `second_piece` int(10) unsigned DEFAULT NULL COMMENT '续件',
  `second_volume` decimal(18,2) unsigned DEFAULT NULL COMMENT '续体积',
  `second_money` decimal(18,2) unsigned NOT NULL COMMENT '续费',
  `delivery_way` tinyint(1) unsigned DEFAULT NULL COMMENT '运送方式：快递-0，EMS-1，平邮-2',
  `is_default` tinyint(1) unsigned DEFAULT '0' COMMENT '是否默认：0-否 1-是',
  PRIMARY KEY (`id`),
  KEY `frk_freight` (`freight_id`) USING BTREE,
  CONSTRAINT `frk_freight` FOREIGN KEY (`freight_id`) REFERENCES `freight` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of freight_delivery
-- ----------------------------
INSERT INTO `freight_delivery` VALUES ('50', '15', null, null, null, '1', null, '15.00', null, '1', null, '5.00', '0', '1');
INSERT INTO `freight_delivery` VALUES ('51', '15', null, null, null, '1', null, '10.00', null, '1', null, '3.00', '1', '1');
INSERT INTO `freight_delivery` VALUES ('52', '15', '650100,650200,650400,650500,652300,652700,652800,652900,653000,653100,653200,654000,654200,654300,659000', '新疆维吾尔自治区乌鲁木齐市,新疆维吾尔自治区克拉玛依市,新疆维吾尔自治区吐鲁番市,新疆维吾尔自治区哈密市,新疆维吾尔自治区昌吉回族自治州,新疆维吾尔自治区博尔塔拉蒙古自治州,新疆维吾尔自治区巴音郭楞蒙古自治州,新疆维吾尔自治区阿克苏地区,新疆维吾尔自治区克孜勒苏柯尔克孜自治州,新疆维吾尔自治区喀什地区,新疆维吾尔自治区和田地区,新疆维吾尔自治区伊犁哈萨克自治州,新疆维吾尔自治区塔城地区,新疆维吾尔自治区阿勒泰地区,新疆维吾尔自治区自治区直辖县级行政区划', null, '1', null, '30.00', null, '1', null, '10.00', '0', '0');
INSERT INTO `freight_delivery` VALUES ('53', '15', null, null, null, '1', null, '8.00', null, '1', null, '2.00', '2', '1');
INSERT INTO `freight_delivery` VALUES ('54', '15', '650100,650200,650400,650500,652300,652700,652800,652900,653000,653100,653200,654000,654200,654300,659000', '新疆维吾尔自治区乌鲁木齐市,新疆维吾尔自治区克拉玛依市,新疆维吾尔自治区吐鲁番市,新疆维吾尔自治区哈密市,新疆维吾尔自治区昌吉回族自治州,新疆维吾尔自治区博尔塔拉蒙古自治州,新疆维吾尔自治区巴音郭楞蒙古自治州,新疆维吾尔自治区阿克苏地区,新疆维吾尔自治区克孜勒苏柯尔克孜自治州,新疆维吾尔自治区喀什地区,新疆维吾尔自治区和田地区,新疆维吾尔自治区伊犁哈萨克自治州,新疆维吾尔自治区塔城地区,新疆维吾尔自治区阿勒泰地区,新疆维吾尔自治区自治区直辖县级行政区划', null, '1', null, '20.00', null, '1', null, '10.00', '1', '0');
INSERT INTO `freight_delivery` VALUES ('55', '15', '650100,650200,650400,650500,652300,652700,652800,652900,653000,653100,653200,654000,654200,654300,659000', '新疆维吾尔自治区乌鲁木齐市,新疆维吾尔自治区克拉玛依市,新疆维吾尔自治区吐鲁番市,新疆维吾尔自治区哈密市,新疆维吾尔自治区昌吉回族自治州,新疆维吾尔自治区博尔塔拉蒙古自治州,新疆维吾尔自治区巴音郭楞蒙古自治州,新疆维吾尔自治区阿克苏地区,新疆维吾尔自治区克孜勒苏柯尔克孜自治州,新疆维吾尔自治区喀什地区,新疆维吾尔自治区和田地区,新疆维吾尔自治区伊犁哈萨克自治州,新疆维吾尔自治区塔城地区,新疆维吾尔自治区阿勒泰地区,新疆维吾尔自治区自治区直辖县级行政区划', null, '1', null, '10.00', null, '1', null, '5.00', '2', '0');

-- ----------------------------
-- Table structure for good
-- ----------------------------
DROP TABLE IF EXISTS `good`;
CREATE TABLE `good` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `cat_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '类型id',
  `name` varchar(255) NOT NULL COMMENT '商品名称',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品价格',
  `number` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '商品数量',
  `weight` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '商品重量',
  `introduce` text COMMENT '商品详情介绍',
  `big_logo` varchar(255) DEFAULT '' COMMENT '图片logo大图',
  `small_logo` varchar(255) DEFAULT '' COMMENT '图片logo小图',
  `deleted` int(2) DEFAULT '0' COMMENT '0:禁用  1:启用',
  `add_time` int(10) DEFAULT NULL COMMENT '添加商品时间',
  `upd_time` int(10) DEFAULT NULL COMMENT '修改商品时间',
  `delete_time` int(10) DEFAULT NULL COMMENT '软删除标志字段',
  `cat_one_id` int(10) DEFAULT '0' COMMENT '一级分类id',
  `cat_two_id` int(10) DEFAULT '0' COMMENT '二级分类id',
  `cat_three_id` int(10) DEFAULT '0' COMMENT '三级分类id',
  `is_recomend` tinyint(1) unsigned DEFAULT '0' COMMENT '是否推荐',
  `is_promote` tinyint(1) unsigned DEFAULT '0' COMMENT '是否促销',
  `promote_price` decimal(10,2) DEFAULT NULL COMMENT '促销价格',
  `state` tinyint(1) DEFAULT '0' COMMENT '商品状态 0: 未提交 1: 审核中 2: 已通过 3: 被拒绝',
  PRIMARY KEY (`id`),
  UNIQUE KEY `goods_name` (`name`),
  KEY `goods_price` (`price`),
  KEY `add_time` (`add_time`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='商品表';

-- ----------------------------
-- Records of good
-- ----------------------------
INSERT INTO `good` VALUES ('1', '8', 'PHYT’S菲茨七叶树眼部莹亮水润眼膜涂抹式抚平纹路提亮提升眼周', '111.00', '47', '40', '<p><img src=\"http://127.0.0.1:8888/uploads/ueditor/a8806c1b0a300aec2604e88a2cd03341.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/32fa75f6c8565927a55c615d2d8890d5.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/aefe02461ec927c88606a8678dc790d8.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/3b48058dc354801a5824736050b8a9a5.jpg\"></p>', '', '', '1', '1642228573', '1646841630', '1646838402', '1', '7', '8', '1', '0', null, '2');
INSERT INTO `good` VALUES ('2', '10', '菲茨荷花玉兰舒缓面膜', '222.00', '8', '20', '<p><img src=\"http://127.0.0.1:8888/uploads/ueditor/87ec7c0590556d2bc78bce578737667d.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/28c0417dc362d7d7aac7c98d05857d22.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/a607b7bec870ce5945538a11d42c8f3b.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/81117f5b879acdc93324192fbf63202f.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/972078573bf3c50d7cf1d6ea849d0c35.jpg\"></p>', '', '', '1', '1642229450', '1649166385', '1646838403', '1', '7', '10', '0', '1', '120.00', '2');
INSERT INTO `good` VALUES ('3', '10', 'PHYT’S菲茨七叶树眼部莹亮水润眼膜涂抹式抚平纹路提亮提升眼周w', '333.00', '8', '20', '<p><img src=\"http://127.0.0.1:8888/uploads/ueditor/87ec7c0590556d2bc78bce578737667d.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/28c0417dc362d7d7aac7c98d05857d22.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/a607b7bec870ce5945538a11d42c8f3b.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/81117f5b879acdc93324192fbf63202f.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/972078573bf3c50d7cf1d6ea849d0c35.jpg\"></p>', '', '', '1', '1642229450', '1646840028', '1646838403', '1', '7', '10', '1', '1', '120.00', '2');
INSERT INTO `good` VALUES ('4', '10', '菲茨荷花玉兰舒缓面膜w', '444.00', '8', '20', '<p><img src=\"http://127.0.0.1:8888/uploads/ueditor/87ec7c0590556d2bc78bce578737667d.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/28c0417dc362d7d7aac7c98d05857d22.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/a607b7bec870ce5945538a11d42c8f3b.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/81117f5b879acdc93324192fbf63202f.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/972078573bf3c50d7cf1d6ea849d0c35.jpg\"></p>', '', '', '1', '1642229450', '1646840028', '1646838403', '1', '7', '10', '1', '1', '120.00', '2');
INSERT INTO `good` VALUES ('5', '12', 'PHYT’S菲茨七叶树眼部莹亮水润眼膜涂抹式抚平纹路提亮提升眼周s', '555.00', '8', '20', '<p><img src=\"http://127.0.0.1:8888/uploads/ueditor/87ec7c0590556d2bc78bce578737667d.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/28c0417dc362d7d7aac7c98d05857d22.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/a607b7bec870ce5945538a11d42c8f3b.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/81117f5b879acdc93324192fbf63202f.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/972078573bf3c50d7cf1d6ea849d0c35.jpg\"></p>', '', '', '1', '1642229450', '1650642546', '1646838403', '1', '9', '12', '1', '1', '120.00', '2');
INSERT INTO `good` VALUES ('6', '8', '菲茨荷花玉兰舒缓面膜s', '666.00', '8', '20', '<p><img src=\"http://127.0.0.1:8888/uploads/ueditor/87ec7c0590556d2bc78bce578737667d.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/28c0417dc362d7d7aac7c98d05857d22.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/a607b7bec870ce5945538a11d42c8f3b.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/81117f5b879acdc93324192fbf63202f.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/972078573bf3c50d7cf1d6ea849d0c35.jpg\"></p>', '', '', '1', '1642229450', '1650643814', '1646838403', '1', '7', '8', '1', '0', null, '2');
INSERT INTO `good` VALUES ('7', '3', 'PHYT’S菲茨七叶树眼部莹亮水润眼膜涂抹式抚平纹路提亮提升眼周t', '777.00', '8', '20', '<p><img src=\"http://127.0.0.1:8888/uploads/ueditor/87ec7c0590556d2bc78bce578737667d.jpg\"></p><p>出水电费</p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/28c0417dc362d7d7aac7c98d05857d22.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/a607b7bec870ce5945538a11d42c8f3b.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/81117f5b879acdc93324192fbf63202f.jpg\"></p><p><img src=\"http://127.0.0.1:8888/uploads/ueditor/972078573bf3c50d7cf1d6ea849d0c35.jpg\"></p>', '', '', '1', '1642229450', '1650643774', '1650642144', '3', null, null, '1', '1', '111.00', '2');

-- ----------------------------
-- Table structure for good_attr
-- ----------------------------
DROP TABLE IF EXISTS `good_attr`;
CREATE TABLE `good_attr` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `good_id` int(10) unsigned DEFAULT NULL COMMENT '商品id',
  `attr_id` int(10) unsigned NOT NULL COMMENT '属性id',
  `value` text NOT NULL COMMENT '商品对应属性的值',
  `add_price` decimal(10,2) DEFAULT NULL COMMENT '该属性需要额外增加的价钱',
  PRIMARY KEY (`id`),
  KEY `attr_id` (`attr_id`),
  KEY `frk_good_attr` (`good_id`),
  CONSTRAINT `frk_good_attr` FOREIGN KEY (`good_id`) REFERENCES `good` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=463 DEFAULT CHARSET=utf8 COMMENT='商品-属性关联表';

-- ----------------------------
-- Records of good_attr
-- ----------------------------
INSERT INTO `good_attr` VALUES ('189', '2', '13', '20g', null);
INSERT INTO `good_attr` VALUES ('190', '2', '14', 'PHYT\'S/菲茨', null);
INSERT INTO `good_attr` VALUES ('191', '2', '15', '其他/other', null);
INSERT INTO `good_attr` VALUES ('192', '2', '16', '法国', null);
INSERT INTO `good_attr` VALUES ('193', '2', '17', '任何肤质', null);
INSERT INTO `good_attr` VALUES ('194', '2', '18', '修护 保湿 滋润 补水 提拉紧致 提', null);
INSERT INTO `good_attr` VALUES ('195', '2', '19', '正常规格', null);
INSERT INTO `good_attr` VALUES ('196', '2', '20', '否', null);
INSERT INTO `good_attr` VALUES ('269', '1', '1', '40g,20g', null);
INSERT INTO `good_attr` VALUES ('270', '1', '2', 'PHYT’S/菲茨', null);
INSERT INTO `good_attr` VALUES ('271', '1', '3', '菲茨荷花玉兰舒缓面膜', null);
INSERT INTO `good_attr` VALUES ('272', '1', '4', '法国', null);
INSERT INTO `good_attr` VALUES ('273', '1', '5', '水洗式', null);
INSERT INTO `good_attr` VALUES ('274', '1', '6', '敏感性肤质', null);
INSERT INTO `good_attr` VALUES ('275', '1', '7', '洋甘菊', null);
INSERT INTO `good_attr` VALUES ('276', '1', '8', '深层滋养 修护 水油平衡', null);
INSERT INTO `good_attr` VALUES ('277', '1', '9', '正常规格', null);
INSERT INTO `good_attr` VALUES ('278', '1', '10', '否', null);
INSERT INTO `good_attr` VALUES ('279', '1', '11', '40g', null);
INSERT INTO `good_attr` VALUES ('280', '1', '22', '1年', null);
INSERT INTO `good_attr` VALUES ('281', null, '21', '', null);
INSERT INTO `good_attr` VALUES ('427', null, '2', 'PHYT’S/菲茨', null);
INSERT INTO `good_attr` VALUES ('428', null, '1', '', null);
INSERT INTO `good_attr` VALUES ('429', null, '3', '', null);
INSERT INTO `good_attr` VALUES ('430', null, '4', '法国', null);
INSERT INTO `good_attr` VALUES ('431', null, '8', '', null);
INSERT INTO `good_attr` VALUES ('432', null, '7', '', null);
INSERT INTO `good_attr` VALUES ('433', null, '5', '', null);
INSERT INTO `good_attr` VALUES ('434', null, '6', '任何肤质', null);
INSERT INTO `good_attr` VALUES ('435', null, '9', '正常规格', null);
INSERT INTO `good_attr` VALUES ('436', null, '10', '否', null);
INSERT INTO `good_attr` VALUES ('437', null, '11', '', null);
INSERT INTO `good_attr` VALUES ('438', null, '22', '1年', null);
INSERT INTO `good_attr` VALUES ('451', '6', '1', '', null);
INSERT INTO `good_attr` VALUES ('452', '6', '2', 'PHYT’S/菲茨', null);
INSERT INTO `good_attr` VALUES ('453', '6', '4', '法国', null);
INSERT INTO `good_attr` VALUES ('454', '6', '3', '', null);
INSERT INTO `good_attr` VALUES ('455', '6', '7', '', null);
INSERT INTO `good_attr` VALUES ('456', '6', '6', '任何肤质', null);
INSERT INTO `good_attr` VALUES ('457', '6', '5', '', null);
INSERT INTO `good_attr` VALUES ('458', '6', '8', '', null);
INSERT INTO `good_attr` VALUES ('459', '6', '9', '正常规格', null);
INSERT INTO `good_attr` VALUES ('460', '6', '10', '否', null);
INSERT INTO `good_attr` VALUES ('461', '6', '11', '', null);
INSERT INTO `good_attr` VALUES ('462', '6', '22', '1年', null);

-- ----------------------------
-- Table structure for good_pic
-- ----------------------------
DROP TABLE IF EXISTS `good_pic`;
CREATE TABLE `good_pic` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `good_id` int(10) unsigned DEFAULT NULL COMMENT '商品id',
  `big` varchar(255) NOT NULL DEFAULT '' COMMENT '相册大图800*800',
  `mid` varchar(255) NOT NULL DEFAULT '' COMMENT '相册中图350*350',
  `sma` varchar(255) NOT NULL DEFAULT '' COMMENT '相册小图50*50',
  PRIMARY KEY (`id`),
  KEY `frk_good_pic` (`good_id`) USING BTREE,
  CONSTRAINT `frk_good_pic` FOREIGN KEY (`good_id`) REFERENCES `good` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COMMENT='商品-相册关联表';

-- ----------------------------
-- Records of good_pic
-- ----------------------------
INSERT INTO `good_pic` VALUES ('1', '1', '/uploads/goodspics/big_abad5e3908fd4dac826a3d72569d953b.jpg', '/uploads/goodspics/mid_abad5e3908fd4dac826a3d72569d953b.jpg', '/uploads/goodspics/sma_abad5e3908fd4dac826a3d72569d953b.jpg');
INSERT INTO `good_pic` VALUES ('2', '1', '/uploads/goodspics/big_c7426f0afd406a581fd3b8dced51502c.jpg', '/uploads/goodspics/mid_c7426f0afd406a581fd3b8dced51502c.jpg', '/uploads/goodspics/sma_c7426f0afd406a581fd3b8dced51502c.jpg');
INSERT INTO `good_pic` VALUES ('3', '1', '/uploads/goodspics/big_9e9d6fcb17baea1dabaf6ddf8dfca780.jpg', '/uploads/goodspics/mid_9e9d6fcb17baea1dabaf6ddf8dfca780.jpg', '/uploads/goodspics/sma_9e9d6fcb17baea1dabaf6ddf8dfca780.jpg');
INSERT INTO `good_pic` VALUES ('4', '1', '/uploads/goodspics/big_754954c7da73e8d10da28727e7d7a743.jpg', '/uploads/goodspics/mid_754954c7da73e8d10da28727e7d7a743.jpg', '/uploads/goodspics/sma_754954c7da73e8d10da28727e7d7a743.jpg');
INSERT INTO `good_pic` VALUES ('5', '1', '/uploads/goodspics/big_32826032d24149258d17ddcbcc78eeee.jpg', '/uploads/goodspics/mid_32826032d24149258d17ddcbcc78eeee.jpg', '/uploads/goodspics/sma_32826032d24149258d17ddcbcc78eeee.jpg');
INSERT INTO `good_pic` VALUES ('6', '2', '/uploads/goodspics/big_8a768dd9f602cb403fd9aad65767a4a4.jpg', '/uploads/goodspics/mid_8a768dd9f602cb403fd9aad65767a4a4.jpg', '/uploads/goodspics/sma_8a768dd9f602cb403fd9aad65767a4a4.jpg');
INSERT INTO `good_pic` VALUES ('7', '2', '/uploads/goodspics/big_4e3e67681c36f1801c8eba5886e2c854.jpg', '/uploads/goodspics/mid_4e3e67681c36f1801c8eba5886e2c854.jpg', '/uploads/goodspics/sma_4e3e67681c36f1801c8eba5886e2c854.jpg');
INSERT INTO `good_pic` VALUES ('8', '2', '/uploads/goodspics/big_d01c2e66b8e207c2b732c50a420a4c15.jpg', '/uploads/goodspics/mid_d01c2e66b8e207c2b732c50a420a4c15.jpg', '/uploads/goodspics/sma_d01c2e66b8e207c2b732c50a420a4c15.jpg');
INSERT INTO `good_pic` VALUES ('9', '2', '/uploads/goodspics/big_f9cf47f34e5510bfbdf1a0b663d5bed4.jpg', '/uploads/goodspics/mid_f9cf47f34e5510bfbdf1a0b663d5bed4.jpg', '/uploads/goodspics/sma_f9cf47f34e5510bfbdf1a0b663d5bed4.jpg');
INSERT INTO `good_pic` VALUES ('10', '2', '/uploads/goodspics/big_45a5842ab6e279b233fe0736cd5c6e26.jpg', '/uploads/goodspics/mid_45a5842ab6e279b233fe0736cd5c6e26.jpg', '/uploads/goodspics/sma_45a5842ab6e279b233fe0736cd5c6e26.jpg');
INSERT INTO `good_pic` VALUES ('14', '7', '/uploads/goodspics/big_efb3db074844a686d465c025f584f5c4.jpeg', '/uploads/goodspics/mid_efb3db074844a686d465c025f584f5c4.jpeg', '/uploads/goodspics/sma_efb3db074844a686d465c025f584f5c4.jpeg');

-- ----------------------------
-- Table structure for manager
-- ----------------------------
DROP TABLE IF EXISTS `manager`;
CREATE TABLE `manager` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `name` varchar(32) NOT NULL COMMENT '名称',
  `pwd` varchar(64) NOT NULL COMMENT '密码',
  `role_id` int(10) NOT NULL DEFAULT '0' COMMENT '角色id',
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(64) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像地址',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '1：表示启用 0:表示禁用',
  `add_time` int(10) unsigned DEFAULT NULL COMMENT '注册时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=504 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='管理员表';

-- ----------------------------
-- Records of manager
-- ----------------------------
INSERT INTO `manager` VALUES ('500', 'admin', '$2y$10$Ga5J3hrOESVKPL7cvR1Jt.1Ji808rD9FwL2/7CwkG0VAfEJiOkPT6', '0', '15225420961', '1009373481@qq.com', 'http://127.0.0.1:8888/uploads/manager/91db45660750594db91dec9730403b92.jpg', '1', '1643211202');
INSERT INTO `manager` VALUES ('503', 'wyy', '$2y$10$dPr1mP3ColSTEcZVheusEu3lJKokwZ7y2UsNJIqXIwgrMWd7.HdMa', '38', '13211111111', '819477514@qq.com', null, '1', '1643278038');

-- ----------------------------
-- Table structure for member
-- ----------------------------
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `telephone` varchar(11) NOT NULL COMMENT '电话',
  `password` char(64) NOT NULL COMMENT '密码',
  `nick_name` varchar(32) NOT NULL COMMENT '昵称',
  `real_name` varchar(32) DEFAULT NULL COMMENT '真实姓名',
  `email` varchar(64) DEFAULT NULL COMMENT '电子邮件',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像地址',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '1：表示启用 0:表示禁用',
  `add_time` int(10) unsigned DEFAULT NULL COMMENT '注册时间',
  `upd_time` int(10) unsigned DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `sy_unique_login` (`telephone`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='管理员表';

-- ----------------------------
-- Records of member
-- ----------------------------
INSERT INTO `member` VALUES ('1', '13000000000', '$2y$10$Ga5J3hrOESVKPL7cvR1Jt.1Ji808rD9FwL2/7CwkG0VAfEJiOkPT6', '嘚瑟的鱼', '申胜龙', '1009373481@qq.com', '/uploads/member/42a13b964fdaa8ca7edd1bebe06d71df.jpg', '1', '1643466051', null);
INSERT INTO `member` VALUES ('3', '13100000000', '$2y$10$rCW6dhcS/bKnW09AZR7IHOqRjb3n1eJXfbr9s8KPovtiYbE2z.Yh.', 'wyy', '王园', '819477514@qq.com', '/', '0', '1645288633', null);
INSERT INTO `member` VALUES ('4', '15225420961', '$2y$10$3TOYMdlDXJbJuKtkcM8sw./nMMySwuAW/aYDQpLxrMSgZZuurmLQO', 'eda', null, '1009373481@qq.com', null, '0', '1646563995', null);
INSERT INTO `member` VALUES ('5', '17630504200', '$2y$10$FD.m1PMHnBjN8IaBqGBxKOs3hbgpyOKltOhSzFtR3afFfPveNMWI2', 'eda', null, '1009373481@qq.com', null, '0', '1646563995', null);

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `user_id` int(10) unsigned NOT NULL COMMENT '下订单会员id',
  `user_name` varchar(32) NOT NULL,
  `code` varchar(32) NOT NULL COMMENT '订单编号',
  `good_count` int(10) NOT NULL,
  `good_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品金额',
  `freight_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '运费',
  `total_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '总金额：商品金额+运费',
  `receive_name` varchar(20) DEFAULT NULL COMMENT '收货人姓名',
  `receive_tel` varchar(11) DEFAULT NULL COMMENT '收货人电话',
  `receive_address` varchar(255) DEFAULT NULL COMMENT '收货人地址',
  `pay_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '1支付宝  2微信  3银行卡',
  `pay_no` varchar(32) DEFAULT '' COMMENT '支付宝交易流水号码',
  `is_self_take` tinyint(1) NOT NULL COMMENT '是否自提：0-邮寄 1-自提',
  `fapiao_title` tinyint(1) DEFAULT '0' COMMENT '发票抬头 0-个人 1-公司',
  `fapiao_company` varchar(32) DEFAULT '' COMMENT '公司名称',
  `fapiao_content` varchar(32) DEFAULT '' COMMENT '发票内容',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-已提交，1-已付款，2-已发货，3-已确认，4-已评价，5-已关闭',
  `add_time` int(10) unsigned DEFAULT NULL COMMENT '记录生成时间',
  `upd_time` int(10) unsigned DEFAULT NULL COMMENT '记录修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`code`),
  UNIQUE KEY `id` (`id`) USING BTREE,
  KEY `add_time` (`add_time`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8 COMMENT='订单表';

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES ('87', '500', 'admin', 'tj7h4508skygyfxbb', '5', '3100.00', '10.00', '3110.00', '申胜龙', '15225420961', '河南省洛阳市老城区状元红路状元府邸', '1', null, '0', '0', '', '', '0', '1642319190', null);
INSERT INTO `order` VALUES ('88', '500', 'admin', 'tj7h4508skygyidbe', '2', '782.00', '10.00', '792.00', null, null, null, '2', null, '1', '0', '', '', '1', '1642319304', null);
INSERT INTO `order` VALUES ('89', '500', 'admin', 'tj7h455ygkyh13xdk', '5', '2642.00', '10.00', '2652.00', null, null, null, '2', null, '1', '0', '', '', '2', '1642323669', null);
INSERT INTO `order` VALUES ('90', '500', 'admin', 'tj7h441qckyh2g6cj', '5', '2184.00', '10.00', '2194.00', null, null, null, '2', null, '1', '0', '', '', '3', '1642325920', null);
INSERT INTO `order` VALUES ('91', '500', 'admin', 'tj7h441qckyh2i6sp', '5', '2184.00', '10.00', '2194.00', null, null, null, '2', null, '1', '0', '', '', '4', '1642326014', null);
INSERT INTO `order` VALUES ('92', '500', 'admin', 'tj7h441qckyh2ijml', '5', '2184.00', '10.00', '2194.00', null, null, null, '2', null, '1', '0', '', '', '5', '1642326030', null);

-- ----------------------------
-- Table structure for order_delivery
-- ----------------------------
DROP TABLE IF EXISTS `order_delivery`;
CREATE TABLE `order_delivery` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `order_id` int(10) unsigned NOT NULL COMMENT '订单id',
  `company` varchar(32) NOT NULL COMMENT '订单快递公司名称',
  `number` varchar(32) NOT NULL COMMENT '快递单编号',
  `add_time` int(10) unsigned DEFAULT NULL COMMENT '记录生成时间',
  `upd_time` int(10) unsigned DEFAULT NULL COMMENT '记录修改时间',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='快递表';

-- ----------------------------
-- Records of order_delivery
-- ----------------------------
INSERT INTO `order_delivery` VALUES ('8', '89', '圆通', 'YT6097855703136', '1642325011', null);
INSERT INTO `order_delivery` VALUES ('9', '90', '圆通', 'YT6097855703136', '1642325011', null);
INSERT INTO `order_delivery` VALUES ('10', '91', '圆通', 'YT6097855703136', '1642325011', null);

-- ----------------------------
-- Table structure for order_good
-- ----------------------------
DROP TABLE IF EXISTS `order_good`;
CREATE TABLE `order_good` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `order_id` int(10) unsigned NOT NULL COMMENT '订单id',
  `good_id` int(10) unsigned NOT NULL COMMENT '商品id',
  `good_name` varchar(255) NOT NULL DEFAULT '' COMMENT '商品名称',
  `good_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品单价',
  `good_count` tinyint(4) NOT NULL DEFAULT '1' COMMENT '购买单个商品数量',
  `cat_id` int(10) NOT NULL,
  `cat_name` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `good_id` (`good_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8 COMMENT='商品订单关联表';

-- ----------------------------
-- Records of order_good
-- ----------------------------
INSERT INTO `order_good` VALUES ('96', '87', '1', '菲茨荷花玉兰舒缓面膜', '620.00', '5', '8', '面膜');
INSERT INTO `order_good` VALUES ('97', '88', '2', 'PHYT’S菲茨七叶树眼部莹亮水润眼膜涂抹式抚平纹路提亮提升眼周', '391.00', '2', '10', '眼膜');
INSERT INTO `order_good` VALUES ('98', '89', '2', 'PHYT’S菲茨七叶树眼部莹亮水润眼膜涂抹式抚平纹路提亮提升眼周', '391.00', '2', '10', '眼膜');
INSERT INTO `order_good` VALUES ('99', '89', '1', '菲茨荷花玉兰舒缓面膜', '620.00', '3', '8', '面膜');
INSERT INTO `order_good` VALUES ('100', '90', '2', 'PHYT’S菲茨七叶树眼部莹亮水润眼膜涂抹式抚平纹路提亮提升眼周', '391.00', '4', '10', '眼膜');
INSERT INTO `order_good` VALUES ('101', '90', '1', '菲茨荷花玉兰舒缓面膜', '620.00', '1', '8', '面膜');
INSERT INTO `order_good` VALUES ('102', '91', '1', '菲茨荷花玉兰舒缓面膜', '620.00', '1', '8', '面膜');
INSERT INTO `order_good` VALUES ('103', '91', '1', 'PHYT’S菲茨七叶树眼部莹亮水润眼膜涂抹式抚平纹路提亮提升眼周', '391.00', '4', '10', '眼膜');
INSERT INTO `order_good` VALUES ('105', '92', '1', 'PHYT’S菲茨七叶树眼部莹亮水润眼膜涂抹式抚平纹路提亮提升眼周', '391.00', '4', '10', '眼膜');

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ps_id` int(11) NOT NULL,
  `pid` smallint(6) NOT NULL COMMENT '父id',
  `name` varchar(20) NOT NULL DEFAULT '' COMMENT '权限名称',
  `alias` varchar(20) NOT NULL DEFAULT '' COMMENT '权限名称的英文表示',
  `level` enum('0','2','1') NOT NULL DEFAULT '0' COMMENT '权限等级',
  `order` int(4) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL COMMENT '图标类或图片',
  `api_service` varchar(255) DEFAULT NULL,
  `api_action` varchar(255) DEFAULT NULL,
  `api_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `ps_id` (`ps_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `permission` VALUES ('1', '1000', '0', '用户管理', 'users', '0', '1', 'fa fa-user-circle', '', '', '');
INSERT INTO `permission` VALUES ('2', '1100', '1000', '后台用户', 'managers', '1', null, '', '', '', 'users/managers');
INSERT INTO `permission` VALUES ('3', '1101', '1100', '查看列表', 'get_list', '2', null, '', 'ManagerService', 'getAllManagers', 'users/managers');
INSERT INTO `permission` VALUES ('4', '1102', '1100', '查看详情', 'get_detail', '2', null, '', 'ManagerService', 'getManagerById', 'users/managers');
INSERT INTO `permission` VALUES ('5', '1103', '1100', '添加用户', 'add', '2', null, '', 'ManagerService', 'createManager', 'users/managers');
INSERT INTO `permission` VALUES ('6', '1104', '1100', '删除用户', 'del', '2', null, '', 'ManagerService', 'deleteManager', 'users/managers');
INSERT INTO `permission` VALUES ('7', '1105', '1100', '更新用户', 'update', '2', null, '', 'ManagerService', 'updateManager', 'users/managers');
INSERT INTO `permission` VALUES ('8', '1106', '1100', '分配角色', 'set_role', '2', null, '', 'ManagerService', 'setRole', 'users/managers');
INSERT INTO `permission` VALUES ('9', '1107', '1100', '设置状态', 'set_deleted', '2', null, '', 'ManagerService', 'updateMgrDeleted', 'users/managers');
INSERT INTO `permission` VALUES ('10', '1200', '1000', '注册会员', 'members', '1', null, '', '', '', 'users/members');
INSERT INTO `permission` VALUES ('11', '1201', '1200', '查看列表', 'get_list', '2', null, '', 'MemberService', 'getAllMembers', 'users/members');
INSERT INTO `permission` VALUES ('12', '1202', '1200', '查看详情', 'get_detail', '2', null, '', 'MemberService', 'getMemberById', 'users/members');
INSERT INTO `permission` VALUES ('13', '1203', '1200', '添加会员', 'add', '2', null, '', 'MemberService', 'createMember', 'users/members');
INSERT INTO `permission` VALUES ('14', '1204', '1200', '删除会员', 'del', '2', null, '', 'MemberService', 'deleteMember', 'users/members');
INSERT INTO `permission` VALUES ('15', '1205', '1200', '更新会员', 'update', '2', null, '', 'MemberService', 'updateMember', 'users/members');
INSERT INTO `permission` VALUES ('16', '1206', '1200', '设置状态', 'set_deleted', '2', null, '', 'MemberService', 'updateMebDeleted', 'users/members');
INSERT INTO `permission` VALUES ('17', '1300', '1000', '个人资料', 'profile', '1', null, '', '', '', 'users/profile');
INSERT INTO `permission` VALUES ('18', '1301', '1300', '查看详情', 'get_detail', '2', null, '', 'ProfileService', 'getProfile', 'users/profile');
INSERT INTO `permission` VALUES ('19', '1302', '1300', '信息修改', 'update', '2', null, '', 'ProfileService', 'updateProfile', 'users/profile');
INSERT INTO `permission` VALUES ('20', '2000', '0', '权限管理', 'permissions', '0', '2', 'fa fa-sitemap', '', '', '');
INSERT INTO `permission` VALUES ('21', '2100', '2000', '角色列表', 'roles', '1', null, '', '', '', 'permissions/roles');
INSERT INTO `permission` VALUES ('22', '2101', '2100', '查看列表', 'get_list', '2', null, '', 'RoleService', 'getAllRoles', 'permissions/roles');
INSERT INTO `permission` VALUES ('23', '2102', '2100', '查看详情', 'get_detail', '2', null, '', 'RoleService', 'getRoleById', 'permissions/roles');
INSERT INTO `permission` VALUES ('24', '2103', '2100', '添加角色', 'add', '2', null, '', 'RoleService', 'createRole', 'permissions/roles');
INSERT INTO `permission` VALUES ('25', '2104', '2100', '删除角色', 'del', '2', null, '', 'RoleService', 'deleteRole', 'permissions/roles');
INSERT INTO `permission` VALUES ('26', '2105', '2100', '更新角色', 'update', '2', null, '', 'RoleService', 'updateRole', 'permissions/roles');
INSERT INTO `permission` VALUES ('27', '2106', '2100', '分配权限', 'set_rights', '2', null, '', 'RoleService', 'updateRoleRight', 'permissions/roles');
INSERT INTO `permission` VALUES ('28', '2107', '2100', '删除权限', 'del_rights', '2', null, '', 'RoleService', 'deleteRoleRight', 'permissions/roles');
INSERT INTO `permission` VALUES ('29', '2200', '2000', '权限列表', 'rights', '1', null, '', '', '', 'permissions/rights');
INSERT INTO `permission` VALUES ('30', '2201', '2200', '查看列表', 'get_list', '2', null, '', 'RightService', 'getAllRights', 'permissions/rights');
INSERT INTO `permission` VALUES ('31', '3000', '0', '商品管理', 'goods', '0', '3', 'fa fa-shopping-bag', '', '', '');
INSERT INTO `permission` VALUES ('32', '3100', '3000', '商品列表', 'list', '1', null, '', '', '', 'good/list');
INSERT INTO `permission` VALUES ('33', '3101', '3100', '查看列表', 'get_list', '2', null, '', 'GoodService', 'getAllGoods', 'good/list');
INSERT INTO `permission` VALUES ('34', '3102', '3100', '查看详情', 'get_detail', '2', null, '', 'GoodService', 'getGoodById', 'good/list');
INSERT INTO `permission` VALUES ('35', '3103', '3100', '添加商品', 'add', '2', null, '', 'GoodService', 'createGood', 'good/list');
INSERT INTO `permission` VALUES ('36', '3104', '3100', '删除商品', 'del', '2', null, '', 'GoodService', 'deleteGood', 'good/list');
INSERT INTO `permission` VALUES ('37', '3105', '3100', '更新商品', 'update', '2', null, '', 'GoodService', 'updateGood', 'good/list');
INSERT INTO `permission` VALUES ('38', '3106', '3100', '审核商品', 'audit', '2', null, '', 'GoodService', 'auditGood', 'good/list');
INSERT INTO `permission` VALUES ('39', '3107', '3100', '提交审核', 'submit', '2', null, '', 'GoodService', 'submitGood', 'good/list');
INSERT INTO `permission` VALUES ('40', '3108', '3100', '设置状态', 'set_deleted', '2', null, '', 'GoodService', 'updateGoodDeleted', 'good/list');
INSERT INTO `permission` VALUES ('41', '3109', '3100', '设置推荐', 'set_recomend', '2', null, '', 'GoodService', 'updateGoodRecomend', 'good/list');
INSERT INTO `permission` VALUES ('42', '3200', '3000', '分类参数', 'attr', '1', null, '', '', '', 'good/attr');
INSERT INTO `permission` VALUES ('43', '3201', '3200', '查看列表', 'get_list', '2', null, '', 'CategoryAttrService', 'getAttributes', 'good/attr');
INSERT INTO `permission` VALUES ('44', '3202', '3200', '查看详情', 'get_detail', '2', null, '', 'CategoryAttrService', 'getAttributeById', 'good/attr');
INSERT INTO `permission` VALUES ('45', '3203', '3200', '添加参数', 'add', '2', null, '', 'CategoryAttrService', 'createAttribute', 'good/attr');
INSERT INTO `permission` VALUES ('46', '3204', '3200', '删除参数', 'del', '2', null, '', 'CategoryAttrService', 'deleteAttribute', 'good/attr');
INSERT INTO `permission` VALUES ('47', '3205', '3200', '更新参数', 'update', '2', null, '', 'CategoryAttrService', 'updateAttribute', 'good/attr');
INSERT INTO `permission` VALUES ('48', '3300', '3000', '商品分类', 'cat', '1', null, '', '', '', 'good/cat');
INSERT INTO `permission` VALUES ('49', '3301', '3300', '查看列表', 'get_list', '2', null, '', 'CategoryService', 'getAllCategories', 'good/cat');
INSERT INTO `permission` VALUES ('50', '3302', '3300', '查看详情', 'get_detail', '2', null, '', 'CategoryService', 'getCategoryById', 'good/cat');
INSERT INTO `permission` VALUES ('51', '3303', '3300', '添加分类', 'add', '2', null, '', 'CategoryService', 'createCategory', 'good/cat');
INSERT INTO `permission` VALUES ('52', '3304', '3300', '删除分类', 'del', '2', null, '', 'CategoryService', 'deleteCategory', 'good/cat');
INSERT INTO `permission` VALUES ('53', '3305', '3300', '更新分类', 'update', '2', null, '', 'CategoryService', 'updateCategory', 'good/cat');
INSERT INTO `permission` VALUES ('54', '3306', '3300', '设置状态', 'set_deleted', '2', null, '', 'CategoryService', 'updateCategoryDeleted', 'good/cat');
INSERT INTO `permission` VALUES ('55', '3400', '3000', '轮播图片', 'banner', '1', null, '', '', '', 'good/banner');
INSERT INTO `permission` VALUES ('56', '3401', '3400', '查看列表', 'get_list', '2', null, '', 'BannerService', 'getAllBanners', 'good/banner');
INSERT INTO `permission` VALUES ('57', '3402', '3400', '查看详情', 'get_detail', '2', null, '', 'BannerService', 'getBannerById', 'good/banner');
INSERT INTO `permission` VALUES ('58', '3403', '3400', '添加图片', 'add', '2', null, '', 'BannerService', 'createBanner', 'good/banner');
INSERT INTO `permission` VALUES ('59', '3404', '3400', '删除图片', 'del', '2', null, '', 'BannerService', 'deleteBanner', 'good/banner');
INSERT INTO `permission` VALUES ('60', '3405', '3400', '更新图片', 'update', '2', null, '', 'BannerService', 'updateBanner', 'good/banner');
INSERT INTO `permission` VALUES ('61', '3406', '3400', '设置状态', 'set_deleted', '2', null, '', 'BannerService', 'updateBannerDeleted', 'good/banner');
INSERT INTO `permission` VALUES ('62', '4000', '0', '订单管理', 'order', '0', '4', 'fa fa-file-text', '', '', '');
INSERT INTO `permission` VALUES ('63', '4100', '4000', '订单列表', 'list', '1', null, '', '', '', 'order/list');
INSERT INTO `permission` VALUES ('64', '4101', '4100', '查看列表', 'get_list', '2', null, '', 'OrderService', 'getAllOrders', 'order/list');
INSERT INTO `permission` VALUES ('65', '4102', '4100', '查看详情', 'get_detail', '2', null, '', 'OrderService', 'getOrderById', 'order/list');
INSERT INTO `permission` VALUES ('66', '4103', '4100', '添加订单', 'add', '2', null, '', 'OrderService', 'createOrder', 'order/list');
INSERT INTO `permission` VALUES ('67', '4104', '4100', '更新订单', 'update', '2', null, '', 'OrderService', 'updateOrder', 'order/list');
INSERT INTO `permission` VALUES ('68', '4105', '4100', '修改价格', 'set_price', '2', null, '', 'OrderService', 'updateOrderPrice', 'order/list');
INSERT INTO `permission` VALUES ('69', '4106', '4100', '订单发货', 'set_delivery', '2', null, '', 'OrderService', 'updateOrderDelivery', 'order/list');
INSERT INTO `permission` VALUES ('70', '4107', '4100', '关闭订单', 'close', '2', null, '', 'OrderService', 'closeOrder', 'order/list');
INSERT INTO `permission` VALUES ('71', '4200', '4000', '评价列表', 'comment', '1', null, '', '', '', 'order/comment');
INSERT INTO `permission` VALUES ('72', '4201', '4200', '查看列表', 'get_list', '2', null, '', 'CommentService', 'getAllComments', 'order/comment');
INSERT INTO `permission` VALUES ('73', '4202', '4200', '查看详情', 'get_detail', '2', null, '', 'CommentService', 'getCommentById', 'order/comment');
INSERT INTO `permission` VALUES ('74', '4203', '4200', '添加评价', 'add', '2', null, '', 'CommentService', 'createComment', 'order/comment');
INSERT INTO `permission` VALUES ('75', '4204', '4200', '删除评价', 'del', '2', null, '', 'CommentService', 'deleteComment', 'order/comment');
INSERT INTO `permission` VALUES ('76', '4205', '4200', '更新评价', 'update', '2', null, '', 'CommentService', 'updateComment', 'order/comment');
INSERT INTO `permission` VALUES ('77', '4206', '4200', '设置状态', 'set_deleted', '2', null, '', 'CommentService', 'updateCommentDeleted', 'order/comment');
INSERT INTO `permission` VALUES ('78', '5000', '0', '数据统计', 'summary', '0', '5', 'fa fa-pie-chart', '', '', '');
INSERT INTO `permission` VALUES ('79', '5100', '5000', '用户来源', 'userfrom', '1', null, '', '', '', 'reports/userfrom');
INSERT INTO `permission` VALUES ('80', '5101', '5100', '查看报表', 'get_detail', '2', null, '', 'ReportsService', 'getReports', 'reports/userfrom');
INSERT INTO `permission` VALUES ('81', '6000', '0', '系统配置', 'system', '0', '6', 'fa fa-cog', '', '', '');
INSERT INTO `permission` VALUES ('82', '6100', '6000', '公共配置', 'config', '1', null, '', '', '', 'system/config');
INSERT INTO `permission` VALUES ('83', '6101', '6100', '查看配置', 'get_detail', '2', null, '', 'ConfigService', 'getConfigById', 'system/config');
INSERT INTO `permission` VALUES ('84', '6102', '6100', '修改配置', 'update', '2', null, '', 'ConfigService', 'updateConfig', 'system/config');
INSERT INTO `permission` VALUES ('85', '6200', '6000', '门店配置', 'store', '1', null, '', '', '', 'system/store');
INSERT INTO `permission` VALUES ('86', '6201', '6200', '查看列表', 'get_list', '2', null, '', 'ConfigStoreService', 'getAllConfigStores', 'system/store');
INSERT INTO `permission` VALUES ('87', '6202', '6200', '查看详情', 'get_detail', '2', null, '', 'ConfigStoreService', 'getConfigStoreById', 'system/store');
INSERT INTO `permission` VALUES ('88', '6203', '6200', '添加门店', 'add', '2', null, '', 'ConfigStoreService', 'createConfigStore', 'system/store');
INSERT INTO `permission` VALUES ('89', '6204', '6200', '删除门店', 'del', '2', null, '', 'ConfigStoreService', 'deleteConfigStore', 'system/store');
INSERT INTO `permission` VALUES ('90', '6205', '6200', '更新门店', 'update', '2', null, '', 'ConfigStoreService', 'updateConfigStore', 'system/store');
INSERT INTO `permission` VALUES ('91', '6206', '6200', '设置状态', 'set_deleted', '2', null, '', 'ConfigStoreService', 'updateConfigStoreDeleted', 'system/store');
INSERT INTO `permission` VALUES ('92', '6300', '6000', '支付方式', 'pay', '1', null, '', '', '', 'system/pay');
INSERT INTO `permission` VALUES ('93', '6301', '6300', '查看列表', 'get_list', '2', null, '', 'ConfigPayService', 'getAllConfigPays', 'system/pay');
INSERT INTO `permission` VALUES ('94', '6302', '6300', '查看详情', 'get_detail', '2', null, '', 'ConfigPayService', 'getConfigPayById', 'system/pay');
INSERT INTO `permission` VALUES ('95', '6303', '6300', '添加支付方式', 'add', '2', null, '', 'ConfigPayService', 'createConfigPay', 'system/pay');
INSERT INTO `permission` VALUES ('96', '6304', '6300', '删除支付方式', 'del', '2', null, '', 'ConfigPayService', 'deleteConfigPay', 'system/pay');
INSERT INTO `permission` VALUES ('97', '6305', '6300', '更新支付方式', 'update', '2', null, '', 'ConfigPayService', 'updateConfigPay', 'system/pay');
INSERT INTO `permission` VALUES ('98', '6306', '6300', '设置状态', 'set_deleted', '2', null, '', 'ConfigPayService', 'updateConfigPayDeleted', 'system/pay');
INSERT INTO `permission` VALUES ('99', '6400', '6000', '运费模板', 'freight', '1', null, '', '', '', 'system/freight');
INSERT INTO `permission` VALUES ('100', '6401', '6400', '查看列表', 'get_list', '2', null, '', 'FreightService', 'getAllFreights', 'system/freight');
INSERT INTO `permission` VALUES ('101', '6402', '6400', '查看详情', 'get_detail', '2', null, '', 'FreightService', 'getFreightById', 'system/freight');
INSERT INTO `permission` VALUES ('102', '6403', '6400', '添加模板', 'add', '2', null, '', 'FreightService', 'createFreight', 'system/freight');
INSERT INTO `permission` VALUES ('103', '6404', '6400', '删除模板', 'del', '2', null, '', 'FreightService', 'deleteFreight', 'system/freight');
INSERT INTO `permission` VALUES ('104', '6405', '6400', '更新模板', 'update', '2', null, '', 'FreightService', 'updateFreight', 'system/freight');
INSERT INTO `permission` VALUES ('105', '6406', '6400', '设置状态', 'set_deleted', '2', null, '', 'FreightService', 'updateFreightDeleted', 'system/freight');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '角色名称',
  `ps_ids` varchar(512) NOT NULL DEFAULT '' COMMENT '权限ids,1,2,5',
  `ps_ca` text COMMENT '控制器-操作,控制器-操作,控制器-操作',
  `desc` text,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('38', '测试', '1000,1100,1101,1102,1103,1104,1105,1106,1107,1200,1201,1202,1203,1204,1205,1206,1300,1301,1302,2000,2100,2101,2102,2103,2104,2105,2106,2107,2200,2201,3000,3100,3101,3102,3103,3104,3105,3106,3107,3108,3200,3201,3202,3203,3204,3205,3300,3301,3302,3303,3304,3305,3306,3400,3401,3402,3403,3404,3405,3406,4000,4100,4101,4102,4103,4104,4105,4106,4107,4200,4201,4202,4203,4204,4205,4206,5000,5100,5101,6000,6100,6101,6102,6200,6201,6202,6203,6204,6205,6206,6300,6301,6302,6303,6304,6305,6306', '测试', '测试');

-- ----------------------------
-- Table structure for token
-- ----------------------------
DROP TABLE IF EXISTS `token`;
CREATE TABLE `token` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uid` int(10) NOT NULL DEFAULT '0',
  `access_token` varchar(255) NOT NULL COMMENT '授权token',
  `refresh_token` varchar(255) NOT NULL COMMENT '刷新token',
  `expires_in` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '过期时间',
  `grand_type` varchar(8) NOT NULL COMMENT '授权类型：password,refresh',
  `client` varchar(5) NOT NULL COMMENT '客户端类型：admin-管理后台，wap-移动端，pc-电脑端',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of token
-- ----------------------------
INSERT INTO `token` VALUES ('7', '1', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTY1MDc2OTg4NywiZXhwIjoxNjUwODU2Mjg3fQ.oVG2BXt9TNWDri8N_sSvKrjlSNzeUTYfLL1t1Xs6VIc', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTY1MDc2OTg4NywiZXhwIjoxNjUxOTc5NDg3fQ.e2NJB5a8UePZv7Km5WKoYWsdfmsWCU4UCBTB2Y9iRuQ', '86400', 'password', 'wap');
INSERT INTO `token` VALUES ('6', '500', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjowLCJpYXQiOjE2NTA3NzY4MTUsImV4cCI6MTY1MDg2MzIxNX0.1A_5NteIsWcSSVTVhXLVmdWgfWgm_0-y87HjzyBBJBQ', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjowLCJpYXQiOjE2NTA3NzY4MTUsImV4cCI6MTY1MTk4NjQxNX0.TioLI22ycgxkaMiopLWeMHux_lySYZuGz4HEHUS16c8', '86400', 'refresh', 'admin');

-- ----------------------------
-- Procedure structure for getCatChildren
-- ----------------------------
DROP PROCEDURE IF EXISTS `getCatChildren`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getCatChildren`(IN `cid` int)
BEGIN
	#Routine body goes here...
	#声明两个临时变量
	DECLARE temp VARCHAR(1000);
	DECLARE tempChd VARCHAR(1000);
	#给声明的临时变量赋值
	SET temp = '$';
	SET tempChd = CAST(cid AS CHAR);
  WHILE tempChd is not null DO
		#如果tempChd不等于cid,目的去除最大目录
    #IF tempChd<>CAST(cid AS CHAR) THEN
			#如果temp等于$，直接把除最外层的cid赋给temp
			IF temp='$' THEN
				SET temp = tempChd;
			#否则就用逗号拼接cid，然后赋值给temp
			ELSE
				SET temp = CONCAT(temp,',',tempChd);
			END IF;
		#END IF;
		SELECT GROUP_CONCAT(id) INTO tempChd FROM category WHERE FIND_IN_SET(pid,tempChd)>0;
	END WHILE;
	SELECT temp;
END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for getCatParents
-- ----------------------------
DROP PROCEDURE IF EXISTS `getCatParents`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getCatParents`(IN `cid` int)
BEGIN
	#Routine body goes here...
	#声明两个临时变量
	DECLARE temp VARCHAR(1000);
	DECLARE tempChd VARCHAR(1000);
	#给声明的临时变量赋值
	SET temp = '$';
	SET tempChd = CAST(cid AS CHAR);
  WHILE tempChd >0 DO
		#如果tempChd不等于cid,目的去除最大目录
    #IF tempChd<>CAST(cid AS CHAR) THEN
			#如果temp等于$，直接把除最外层的cid赋给temp
			IF temp='$' THEN
				SET temp = tempChd;
			#否则就用逗号拼接cid，然后赋值给temp
			ELSE
				SET temp = CONCAT(temp,',',tempChd);
			END IF;
		#END IF;
		SELECT GROUP_CONCAT(pid) INTO tempChd FROM category WHERE FIND_IN_SET(id,tempChd)>0;
	END WHILE;
	SELECT temp;
END
;;
DELIMITER ;
