/*
 Navicat Premium Dump SQL

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 90300 (9.3.0)
 Source Host           : localhost:3306
 Source Schema         : cultural_museum

 Target Server Type    : MySQL
 Target Server Version : 90300 (9.3.0)
 File Encoding         : 65001

 Date: 19/03/2026 17:53:05
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '主键',
  `content` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '内容',
  `user_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '作者ID',
  `post_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '作品ID',
  `parent_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '父评论ID，为null表示顶级评论',
  `create_time` datetime NOT NULL COMMENT '发布时间',
  `modify_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_topic`(`post_id` ASC, `create_time` ASC) USING BTREE,
  INDEX `idx_parent`(`parent_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '评论表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES ('2032354458341965826', '1234576897', '2026152657965563906', '2031681928526442498', NULL, '2026-03-13 15:13:57', NULL);
INSERT INTO `comment` VALUES ('2032354776383455234', 'qwertyuio', '2026186367314202626', '2031681928526442498', '2032354458341965826', '2026-03-13 15:15:13', NULL);
INSERT INTO `comment` VALUES ('2032354832138338305', '你好', '2026186367314202626', '2031681928526442498', NULL, '2026-03-13 15:15:26', NULL);
INSERT INTO `comment` VALUES ('2032693816425107458', '好看！', '2026152657965563906', '2032355522839543810', NULL, '2026-03-14 13:42:26', NULL);
INSERT INTO `comment` VALUES ('2032694749850685442', '12123', '2026152657965563906', '2032355522839543810', '2032693816425107458', '2026-03-14 13:46:09', NULL);
INSERT INTO `comment` VALUES ('2032694816821137409', 'helloword', '2026152657965563906', '2032355522839543810', NULL, '2026-03-14 13:46:25', NULL);
INSERT INTO `comment` VALUES ('2032695737990959106', '111', '2026152657965563906', '2031676102684311554', NULL, '2026-03-14 13:50:04', NULL);
INSERT INTO `comment` VALUES ('2032695746622836737', '222', '2026152657965563906', '2031676102684311554', NULL, '2026-03-14 13:50:06', NULL);

-- ----------------------------
-- Table structure for cultures
-- ----------------------------
DROP TABLE IF EXISTS `cultures`;
CREATE TABLE `cultures`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `heat` int NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cultures
-- ----------------------------
INSERT INTO `cultures` VALUES (1, '汉族传统服饰', '全国', '民族服饰', '汉族传统服饰是中国汉族的传统服装，具有悠久的历史和丰富的文化内涵。', '汉族传统服饰，简称汉服，是从黄帝即位到公元17世纪中叶（明末清初），在汉族的主要居住区，以“华夏－汉”文化为背景和主导思想，以华夏礼仪文化为中心，通过自然演化而形成的具有独特汉民族风貌性格，明显区别于其他民族的传统服装和配饰体系。', 'https://images.unsplash.com/photo-1575141253649-653b8303e926?w=400&h=300&fit=crop', 98, '2026-02-27 12:00:31');
INSERT INTO `cultures` VALUES (2, '蒙古族马头琴艺术', '内蒙古自治区', '民族音乐', '马头琴是蒙古族最具代表性的传统乐器，其音色深沉而富有感染力。', '马头琴是一种两弦的弦乐器，有梯形的琴身和雕刻成马头形状的琴柄，为蒙古族人民喜爱的乐器。马头琴的历史悠久，从唐宋时期拉弦乐器奚琴发展演变而来。成吉思汗时（1155—1227）已流传民间。', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop', 95, '2026-02-27 12:00:31');
INSERT INTO `cultures` VALUES (3, '藏族唐卡艺术', '西藏自治区', '传统工艺', '唐卡是藏族文化中一种独特的绘画艺术形式，以宗教题材为主。', '唐卡（Thangka）也叫唐嘎，唐喀，系藏文音译，指用彩缎装裱后悬挂供奉的宗教卷轴画。唐卡是藏族文化中一种独具特色的绘画艺术形式，题材内容涉及藏族的历史、政治、文化和社会生活等诸多领域，传世唐卡大都是藏传佛教和苯教作品。', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop', 92, '2026-02-27 12:00:31');
INSERT INTO `cultures` VALUES (4, '苗族银饰工艺', '贵州省', '传统工艺', '苗族银饰以其精美的工艺和独特的造型而闻名，是苗族文化的重要组成部分。', '苗族银饰是苗族文化的重要组成部分，也是苗族人民审美观念的集中体现。苗族银饰工艺历史悠久，工艺精湛，品种繁多，包括头饰、颈饰、胸饰、手饰、脚饰等。苗族银饰的制作工艺主要包括熔银、锻打、錾刻、焊接、抛光等工序。', 'https://images.unsplash.com/photo-1566323066628-0b1c10d98e4b?w=400&h=300&fit=crop', 90, '2026-02-27 12:00:31');
INSERT INTO `cultures` VALUES (5, '维吾尔族木卡姆艺术', '新疆维吾尔自治区', '民族音乐', '木卡姆是维吾尔族的传统音乐形式，被誉为“维吾尔族音乐之母”。', '木卡姆是维吾尔族的传统音乐形式，是集歌、舞、乐于一体的大型综合艺术形式。维吾尔木卡姆是维吾尔族人民在漫长的历史发展过程中创造出来的宝贵文化遗产，被誉为“维吾尔族音乐之母”，是中华民族音乐宝库中的瑰宝。', 'https://images.unsplash.com/photo-1582114374894-6c75d2f2503d?w=400&h=300&fit=crop', 88, '2026-02-27 12:00:31');
INSERT INTO `cultures` VALUES (6, '汉族传统建筑', '全国', '代表建筑', '汉族传统建筑是中国古代建筑的主要代表，具有独特的建筑风格和文化内涵。', '汉族传统建筑是中国古代建筑的主要代表，具有独特的建筑风格和文化内涵。汉族传统建筑以木结构为主，注重对称美和和谐美，体现了中国传统文化中的“天人合一”思想。汉族传统建筑包括宫殿、寺庙、园林、民居等多种类型。', 'https://images.unsplash.com/photo-1594115509581-137f42c180f3?w=400&h=300&fit=crop', 85, '2026-02-27 12:00:31');
INSERT INTO `cultures` VALUES (7, '彝族火把节', '云南省', '民族节日', '火把节是彝族最重要的传统节日，以其盛大的规模和热烈的气氛而闻名。', '火把节是彝族、白族、纳西族、基诺族、拉祜族等民族的古老传统节日，有着深厚的民俗文化内涵，被称为“东方的狂欢节”。不同的民族举行火把节的时间也不同，大多是在农历的六月二十四，主要活动有斗牛、斗羊、斗鸡、赛马、摔跤、歌舞表演、选美等。', 'https://images.unsplash.com/photo-1566323066628-0b1c10d98e4b?w=400&h=300&fit=crop', 82, '2026-02-27 12:00:31');
INSERT INTO `cultures` VALUES (8, '满族旗袍', '东北地区', '民族服饰', '旗袍是满族的传统服饰，经过演变已成为中国女性的代表性服装之一。', '旗袍，中国和世界华人女性的传统服装，被誉为中国国粹和女性国服。虽然其定义和产生的时间至今还存有诸多争议，但它仍然是中国悠久的服饰文化中最绚烂的现象和形式之一。', 'https://images.unsplash.com/photo-1530650328176-893926c246ca?w=400&h=300&fit=crop', 80, '2026-02-27 12:00:31');
INSERT INTO `cultures` VALUES (9, '壮族铜鼓文化', '广西壮族自治区', '传统工艺', '铜鼓是壮族的传统乐器和礼器，具有重要的历史和文化价值。', '铜鼓是中国古代南方少数民族及东南亚地区最具代表性的文物，它集冶炼、铸造、雕刻、绘画、音乐、舞蹈于一体，是中国古代青铜文化中的一朵奇葩。铜鼓在壮族人民的生活中有着重要的地位，是壮族文化的重要象征。', 'https://images.unsplash.com/photo-1582114374894-6c75d2f2503d?w=400&h=300&fit=crop', 78, '2026-02-27 12:00:31');
INSERT INTO `cultures` VALUES (10, '藏族锅庄舞', '西藏自治区', '民族运动', '锅庄舞是藏族的传统舞蹈，通常在节日或庆典上表演。', '锅庄舞，又称为“果卓”、“歌庄”、“卓”等，藏语意为圆圈歌舞，是藏族三大民间舞蹈之一。锅庄舞分布于西藏昌都、那曲，四川阿坝、甘孜，云南迪庆及青海、甘肃的藏族聚居区。锅庄舞在吐蕃时期就已经存在，是藏族人民生活中不可或缺的一部分。', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop', 75, '2026-02-27 12:00:31');

-- ----------------------------
-- Table structure for ethnic_groups
-- ----------------------------
DROP TABLE IF EXISTS `ethnic_groups`;
CREATE TABLE `ethnic_groups`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `population` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `origin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `culture` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 58 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ethnic_groups
-- ----------------------------
INSERT INTO `ethnic_groups` VALUES (1, '汉族', '1220844520', '远古', '汉族是中国的主体民族。汉族人口为1220844520人，占91.6%(2010，未包括香港、澳门特别行政区和台湾省数据)，占全国人口总数的91.51%。汉族的远古先民大体以西起陇山、东至泰山的黄河中下游为活动地区。公元前21世纪后，中原地区相继出现了夏、商、西周几个王朝。他们虽都自认黄帝为其祖先，实际却来自不同的部落集团，经过漫长历史年代的接近、交往、斗争和融合，形成了共同族体。西周时已出现华、...', '../data_mz/image/汉族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (2, '蒙古族', '未知', '远古', '蒙古族有人口5981840人（2010年），主要居住在内蒙古自治区和新疆、辽宁、吉林、黑龙江、甘肃、青海、河北等省、自治区的各蒙古族自治州、县。此外，还有少数蒙古族聚居或散居在宁夏、河南、四川、云南、北京等省、市、自治区。蒙古族主要聚居区在内蒙古自治区，全区有蒙古和汉、回、满、达斡尔、鄂温克、鄂伦春、朝鲜等50多个民族，2005年全区总人口为2386万人，其中蒙古族421万人。内蒙古自治区位...', '../data_mz/image/蒙古族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (3, '满族', '未知', '远古', '满族人口总数为10387958人（2010年），在中国55个少数民族中居第二位。满族分布于全国各地，以辽宁、河北、黑龙江、吉林和内蒙古自治区、北京等省、自治区、直辖市为多，其他散居于新疆、甘肃、宁夏、山东、湖北、贵州等省区及西安、成都、广州、福州等大中城市。聚居于东北三省及河北省的满族，主要从事农业，这些地区盛产大豆、高粱、玉米、烟草、苹果和柞蚕等农产品和经济作物。山区特产人参、蘑菇、木耳等，...', '../data_mz/image/满族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (4, '藏族', '未知', '远古', '暂无数据', '../data_mz/image/藏族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (5, '回族', '未知', '远古', '回族是我国人口较多的一个少数民族，总人口10586087人（2010年，不包括台湾省），全国的31个省、自治区、直辖市均有分布。宁夏回族自治区是其主要聚居区，全区拥有回族人口186.25万，占全国回族总人口的18.9％。另外，回族人口在20万以上的地区还有：北京、河北、内蒙古、辽宁、安徽、山东、河南、云南、甘肃和新疆等。以东、中、西三大地区来看，回族人口在西部地区最多，占其总数的60.75%。其...', '../data_mz/image/回族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (6, '彝族', '未知', '远古', '暂无数据', '../data_mz/image/彝族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (7, '白族', '未知', '远古', '暂无数据', '../data_mz/image/白族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (8, '壮族', '未知', '远古', '壮族是我国少数民族中人口最多的一个民族，共有16926381人（2010年）。在全国的31个省、自治区、直辖市中均有分布，主要聚居在我国的南方，范围东起广东省连山壮族瑶族自治县，西至云南省文山壮族苗族自治州，北达贵州省黔东南苗族侗族自治州从江县，南抵北部湾。广西壮族自治区是壮族的主要分布区，共有1420.71万人，占壮族总人口的87.81％，主要聚居于南宁市、崇左市、百色市、河池市、柳州市、来宾...', '../data_mz/image/壮族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (9, '其他民族', '约1000万', '中国拥有56个民族，除了主要民族外，还有许多人口较少的民族。', '这些民族各自拥有独特的文化传统和生活方式，共同构成了中华民族多元的文化格局。', 'https://images.unsplash.com/photo-1537525430866-002ed271a505?w=200&h=150&fit=crop', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (10, '维吾尔族', '10069346', '远古', '暂无数据', '../data_mz/image/维吾尔族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (11, '苗族', '9426007', '远古', '我国境内的苗族人口为9426007人（2010年），在我国56个民族中仅次于汉、壮、满、回，位居第五位。苗族人口的分布特点是大散居、小聚居，全国各省、自治区、直辖市均有苗族分布。据全国第五次人口普查，贵州省苗族人口最多，有430万人，占全国苗族总人口近一半。其次是，湖南192万人，云南104万人，重庆50万人，广西46万，湖北21万人，四川15万人，广东12万，海南6万。这8省（区、市）的苗族人...', '../data_mz/image/苗族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (12, '布依族', '未知', '远古', '布依族总人口约2870034人（2010年），主要分布在贵州、云南、四川等省，其中以贵州省的布依族人口最多，占全国布依族人口的97%。主要聚居在黔南和黔西南两个布依族苗族自治州，以及安顺市、贵阳市、六盘水市，其余各市、州、地均有散居。布依语属汉藏语系壮侗语族壮傣语支，与壮语有密切的亲属关系。壮语北部方言和贵州望谟、册亨、独山、平塘、安龙、兴义等市县的布依语基本相同。由于布依族与汉族长期的文化接...', '../data_mz/image/布依族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (13, '朝鲜族', '1830929', '远古', '暂无数据', '../data_mz/image/朝鲜族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (14, '侗族', '2879974', '远古', '侗族总人口为2879974人（2010年），主要分布在贵州省的黔东南苗族侗族自治州、铜仁地区，湖南省的新晃侗族自治县、会同县、通道侗族自治县、芷江侗族自治县、靖州苗族侗族自治县，广西壮族自治区的三江侗族自治县、龙胜各族自治县、融水苗族自治县，湖北省恩施土家族苗族自治州等地。其中，黔东南苗族侗族自治州是我国侗族最大的聚居地，全州侗族人口有121万，占全国侗族总人口的40.8%；黔东南州的黎平县是我...', '../data_mz/image/侗族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (15, '瑶族', '未知', '远古', '暂无数据', '../data_mz/image/瑶族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (16, '土家族', '8353912', '远古', '暂无数据', '../data_mz/image/土家族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (17, '哈尼族', '未知', '远古', '暂无数据', '../data_mz/image/哈尼族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (18, '哈萨克族', '1462588', '远古', '暂无数据', '../data_mz/image/哈萨克族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (19, '傣族', '未知', '远古', '暂无数据', '../data_mz/image/傣族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (20, '黎族', '未知', '远古', '暂无数据', '../data_mz/image/黎族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (21, '僳僳族', '未知', '远古', '暂无数据', '../data_mz/image/Lisu.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (22, '佤族', '未知', '远古', '暂无数据', '../data_mz/image/佤族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (23, '畲族', '未知', '远古', '暂无数据', '../data_mz/image/畲族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (24, '高山族', '未知', '远古', '居住在台湾的少数民族，是我国统一多民族大家庭中不可分割的一部分，长期以来，他们和汉族人民一起，披荆斩棘，把台湾开辟成为美丽富饶的宝岛，并共同反抗外来侵略和历代统治阶级的压迫，对于共同缔造祖国的历史和文化作出了重要的贡献。对台湾的少数民族，我国政府以“高山族”为其正式族称，台湾当局则称其为“原住民”。据2004年台湾行政主管部门统计，台湾“原住民”共有452，579人，占台湾总人口的2%左右，主...', '../data_mz/image/高山族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (25, '拉祜族', '485966', '远古', '暂无数据', '../data_mz/image/拉祜族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (26, '水族', '未知', '远古', '水族总人口411847人（2010年），主要生息于黔桂交界的龙江、都柳江上游地带，贵州省黔南的三都水族自治县、荔波、独山、都匀等县市为主要居住区，黔东南的榕江、丹寨、雷山、从江、黎平等县为主要散居区，此外在广西北部的河池、南丹、环江、融水等县市以及云南省富源县也有水族村落分布。水族与周边的汉、苗、布依、侗、瑶、壮等民族友好相处，共建家园。水族自称“睢（sui3）”，因发祥于睢水流域而得名，故民...', '../data_mz/image/水族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (27, '东乡族', '未知', '远古', '暂无数据', '../data_mz/image/东乡族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (28, '纳西族', '326295', '远古', '暂无数据', '../data_mz/image/纳西族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (29, '景颇族', '147828', '远古', '暂无数据', '../data_mz/image/景颇族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (30, '柯尔克孜族', '未知', '远古', '暂无数据', '../data_mz/image/Kirgiz.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (31, '土族', '289565', '远古', '暂无数据', '../data_mz/image/土族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (32, '达斡尔族', '未知', '远古', '暂无数据', '../data_mz/image/达斡尔族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (33, '仫佬族', '未知', '远古', '仫佬族有216257人（2010年）。主要分布在广西壮族自治区，贵州省也有分布。在广西壮族自治区，多数聚居在罗城仫佬族自治县的东门、四把、黄金、龙岸、天河、小长安等地。少数散居在忻城、宜山、柳城、都安、环江、河池、融水、融安等县。在贵州省，主要居住在麻江、凯里、黄平、都匀、福泉等县。仫佬族中有罗、银、吴、谢、潘、梁、周、韦、张、黄、吕、包、覃、卢等姓，其中以罗、银、吴、谢、潘、梁等为大姓，人口最...', '../data_mz/image/仫佬族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (34, '羌族', '未知', '远古', '暂无数据', '../data_mz/image/羌族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (35, '布朗族', '119639', '远古', '暂无数据', '../data_mz/image/布朗族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (36, '撒拉族', '未知', '远古', '暂无数据', '../data_mz/image/撒拉族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (37, '毛南族', '未知', '远古', '暂无数据', '../data_mz/image/毛南族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (38, '仡佬族', '550746', '远古', '暂无数据', '../data_mz/image/仡佬族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (39, '锡伯族', '190481', '远古', '暂无数据', '../data_mz/image/锡伯族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (40, '阿昌族', '39555', '远古', '暂无数据', '../data_mz/image/阿昌族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (41, '普米族', '未知', '远古', '暂无数据', '../data_mz/image/普米族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (42, '塔吉克族', '51069', '远古', '暂无数据', '../data_mz/image/塔吉克族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (43, '怒族', '未知', '远古', '暂无数据', '../data_mz/image/怒族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (44, '乌孜别克族', '10569', '远古', '暂无数据', '../data_mz/image/Uzbek.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (45, '俄罗斯族', '未知', '远古', '暂无数据', '../data_mz/image/俄罗斯族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (46, '鄂温克族', '未知', '远古', '暂无数据', '../data_mz/image/鄂温克族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (47, '德昂族', '未知', '远古', '暂无数据', '../data_mz/image/德昂族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (48, '保安族', '未知', '远古', '暂无数据', '../data_mz/image/保安族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (49, '裕固族', '未知', '远古', '暂无数据', '../data_mz/image/裕固族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (50, '京族', '28199', '远古', '京族是中国55个少数民族中人数较少的一个民族，人口为28199人（2010年），主要分布在广西壮族自治区防城港市。其中东兴市约有1.2万人，主要聚居在东兴市江平镇的澫尾、山心、巫头三个海岛上，素有“京族三岛”之称。其他京族人口则与汉族、壮族杂居在东兴市江平、谭吉、红坎、恒望、竹山等地及防城港市的其它市县。钦州市也有少量京族人口分布。京族所在地区属亚热带气候，雨量充沛，终年不见冰雪，树木四季常青...', '../data_mz/image/京族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (51, '塔塔尔族', '未知', '远古', '暂无数据', '../data_mz/image/塔塔尔族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (52, '独龙族', '6930', '远古', '独龙族总人口为6930人（2010年），是我国人口较少的一个民族，也是云南省人口最少的民族。独龙族居住的独龙江河谷，南北长约150多公里，东岸是海拔5000多米的高黎贡山，西岸是海拔4000多米的担当力卡山。发源于西藏察隅县伯舒拉岭东南部的独龙江，由北向南从山谷中间穿流而过。河床落差大、流速快，水能资源极为丰富。这里由于受孟加拉湾暖湿气流的影响，雨量充沛，年均降雨量达3000～4000毫米，...', '../data_mz/image/独龙族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (53, '鄂伦春族', '8659', '远古', '暂无数据', '../data_mz/image/鄂伦春族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (54, '赫哲族', '未知', '远古', '暂无数据', '../data_mz/image/赫哲族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (55, '门巴族', '未知', '远古', '门巴族总人口共有10561人（2010年），主要分布在我国西藏自治区东南部的门隅和墨脱地区，错那县的勒布是门巴族的主要聚居区。“门巴”意思是“生活在门隅的人”。“门巴”既是自称，也是藏族和其他民族对他们的称呼。由于居住地域的差异以及历史上的民族迁徙，各地门巴族还有一些其它称呼，如自称“主巴”、“勒波”等。墨脱是门巴族另一重要聚居地。墨脱位于门隅的东北方向，古称“白玛岗”，藏语义为“隐藏着的莲花...', '../data_mz/image/门巴族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (56, '珞巴族', '未知', '远古', '暂无数据', '../data_mz/image/珞巴族.webp', '2026-02-27 12:00:31');
INSERT INTO `ethnic_groups` VALUES (57, '基诺族', '23143', '远古', '暂无数据', '../data_mz/image/基诺族.webp', '2026-02-27 12:00:31');

-- ----------------------------
-- Table structure for follow
-- ----------------------------
DROP TABLE IF EXISTS `follow`;
CREATE TABLE `follow`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `friend_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '好友ID',
  `user_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户ID',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '好友状态 0-待同意 1-已同意',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_friend`(`user_id` ASC, `friend_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_friend_id`(`friend_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '用户好友关系' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of follow
-- ----------------------------
INSERT INTO `follow` VALUES (12, '2026186367314202626', '2026152657965563906', 1, '2026-03-14 12:06:34', '2026-03-14 12:06:34');
INSERT INTO `follow` VALUES (13, '2026152657965563906', '2026186367314202626', 1, '2026-03-14 12:14:19', '2026-03-14 12:14:19');

-- ----------------------------
-- Table structure for interaction
-- ----------------------------
DROP TABLE IF EXISTS `interaction`;
CREATE TABLE `interaction`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户ID',
  `target_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '目标ID（作品ID）',
  `target_type` tinyint NOT NULL DEFAULT 1 COMMENT '目标类型：1-作品',
  `action_type` tinyint NOT NULL COMMENT '行为：1-点赞, 2-收藏, 3-分享',
  `create_time` datetime NOT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_target_action`(`user_id` ASC, `target_id` ASC, `action_type` ASC) USING BTREE,
  INDEX `idx_target`(`target_type` ASC, `target_id` ASC, `action_type` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '用户互动行为表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of interaction
-- ----------------------------
INSERT INTO `interaction` VALUES (3, '2026186367314202626', '2031681928526442498', 1, 2, '2026-03-13 15:15:39');
INSERT INTO `interaction` VALUES (4, '2026186367314202626', '2031676102684311554', 1, 2, '2026-03-13 15:15:41');
INSERT INTO `interaction` VALUES (5, '2026152657965563906', '2032355522839543810', 1, 1, '2026-03-14 13:37:01');
INSERT INTO `interaction` VALUES (6, '2026152657965563906', '2032355522839543810', 1, 2, '2026-03-14 13:37:06');
INSERT INTO `interaction` VALUES (7, '2026152657965563906', '2031681928526442498', 1, 2, '2026-03-14 13:37:20');
INSERT INTO `interaction` VALUES (8, '2026152657965563906', '2031681928526442498', 1, 1, '2026-03-14 13:37:21');

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '消息ID',
  `sender_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '发送者ID',
  `receiver_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '接收者ID',
  `content` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '内容',
  `create_time` datetime NOT NULL COMMENT '发送时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_receiver`(`receiver_id` ASC, `create_time` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '私信消息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES ('2028745064536104961', '2026186367314202626', '2026152657965563906', '1去1', '2026-03-03 16:11:30');
INSERT INTO `message` VALUES ('2028753925091438594', '2026152657965563906', '2026186367314202626', '1去241', '2026-03-03 16:46:43');
INSERT INTO `message` VALUES ('2028760828810952706', '2026152657965563906', '2026186367314202626', '你好，这是一条测试消息', '2026-03-03 17:14:09');
INSERT INTO `message` VALUES ('2031268527908204545', '2026152657965563906', '2026186367314202626', '你好', '2026-03-10 15:18:51');
INSERT INTO `message` VALUES ('2031268666257321985', '2026186367314202626', '2026152657965563906', '1111111111111', '2026-03-10 15:19:24');
INSERT INTO `message` VALUES ('2031278818578542594', '2026186367314202626', '2026152657965563906', '份的人', '2026-03-10 15:59:44');
INSERT INTO `message` VALUES ('2032019492982644738', '2026152657965563906', '2026186367314202626', 'hello、', '2026-03-12 17:02:55');
INSERT INTO `message` VALUES ('2033807595971960833', '2026152657965563906', '2026186367314202626', '你好', '2026-03-17 15:28:12');

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post`  (
  `id` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '主键',
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '标题',
  `content` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL COMMENT 'markdown或富文本内容',
  `file_url` varchar(512) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '主文件URL（图片/视频/音频）',
  `user_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '作者ID',
  `ethnic_group` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '所属民族',
  `region` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '地区（省市区）',
  `visibility` tinyint(1) NOT NULL DEFAULT 1 COMMENT '可见性：1-公开，2-仅好友',
  `comments` int NOT NULL DEFAULT 0 COMMENT '评论数',
  `collects` int NOT NULL DEFAULT 0 COMMENT '收藏数',
  `like_count` int NOT NULL DEFAULT 0 COMMENT '点赞数',
  `top` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否置顶，1-是，0-否',
  `create_time` datetime NOT NULL COMMENT '发布时间',
  `modify_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  UNIQUE INDEX `title`(`title` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `create_time`(`create_time` ASC) USING BTREE,
  INDEX `idx_ethnic_region`(`ethnic_group` ASC, `region` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '文化作品表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of post
-- ----------------------------
INSERT INTO `post` VALUES ('2028734288333119489', '', NULL, NULL, '2028422892600995842', '', '', 1, 0, 0, 0, b'0', '2026-03-03 15:28:41', NULL);
INSERT INTO `post` VALUES ('2028729785261338626', '245', NULL, NULL, '2028422892600995842', '', '', 1, 0, 0, 0, b'0', '2026-03-03 15:10:47', NULL);
INSERT INTO `post` VALUES ('2032717394524684290', 'Hello World', '你好，世界！', 'Https://teststorage1.oss-cn-beijing.aliyuncs.com/2026/03/2a98740c-951e-4240-8f48-6f578583ff02.jpeg', '2026152657965563906', '', '', 1, 0, 0, 0, b'0', '2026-03-14 15:16:08', NULL);
INSERT INTO `post` VALUES ('2032355522839543810', '你好，我是李四', '我喜或这个论坛', 'Https://teststorage1.oss-cn-beijing.aliyuncs.com/2026/03/70e5705a-3d66-4222-a308-7e3bf375f70d.jpg', '2026186367314202626', '汉', '大连市', 1, 3, 1, 1, b'0', '2026-03-13 15:18:11', NULL);
INSERT INTO `post` VALUES ('2031681928526442498', '测试233', '132354677', 'Https://teststorage1.oss-cn-beijing.aliyuncs.com/2026/03/6b098456-f14b-48e0-a8cc-717c8d0e1ddb.png', '2026152657965563906', '汉', '大连市', 1, 3, 2, 1, b'0', '2026-03-11 18:41:33', NULL);
INSERT INTO `post` VALUES ('2031676102684311554', '这是一个测试文章11111', '去微软推哦怕去微软推姐姐哦看来XZCZFGDHYTFYFUHRDEH,SaedrfcE4FW,SDXHEUIFUIHKWRFGIKWYEURSfs;redoufhwsaeui孙菲菲让我死哦分泸沽湖，\n如粪土热压罐肉片替换', 'Https://teststorage1.oss-cn-beijing.aliyuncs.com/2026/03/fd3838ed-4049-400b-9a2c-213d7856586c.webp', '2026152657965563906', '汉', '大连市', 1, 2, 1, 0, b'0', '2026-03-11 18:18:24', NULL);
INSERT INTO `post` VALUES ('2032714970858704898', '这是我的第二个作品', '123违法手段丰富', 'Https://teststorage1.oss-cn-beijing.aliyuncs.com/2026/03/516bae69-4c1e-4e75-b563-81fdf12f7281.png', '2026152657965563906', '', '', 2, 0, 0, 0, b'0', '2026-03-14 15:06:30', NULL);

-- ----------------------------
-- Table structure for post_tag
-- ----------------------------
DROP TABLE IF EXISTS `post_tag`;
CREATE TABLE `post_tag`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键',
  `tag_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '标签ID',
  `post_id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '作品ID',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `tag_id`(`tag_id` ASC) USING BTREE,
  INDEX `topic_id`(`post_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '作品-标签 中间表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of post_tag
-- ----------------------------
INSERT INTO `post_tag` VALUES (3, '2031676102780780546', '2031676102684311554');
INSERT INTO `post_tag` VALUES (4, '2031691553200062466', '2031681928526442498');
INSERT INTO `post_tag` VALUES (5, '2031691553200062466', '2032714970858704898');
INSERT INTO `post_tag` VALUES (6, '2031676102780780546', '2032714970858704898');

-- ----------------------------
-- Table structure for region_age_distribution
-- ----------------------------
DROP TABLE IF EXISTS `region_age_distribution`;
CREATE TABLE `region_age_distribution`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `region_id` int NULL DEFAULT NULL,
  `age_group` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `percentage` float NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `region_id`(`region_id` ASC) USING BTREE,
  CONSTRAINT `region_age_distribution_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of region_age_distribution
-- ----------------------------
INSERT INTO `region_age_distribution` VALUES (1, 1, '0-18岁', 18);
INSERT INTO `region_age_distribution` VALUES (2, 1, '19-35岁', 35);
INSERT INTO `region_age_distribution` VALUES (3, 1, '36-59岁', 32);
INSERT INTO `region_age_distribution` VALUES (4, 1, '60岁以上', 15);
INSERT INTO `region_age_distribution` VALUES (5, 2, '0-18岁', 16);
INSERT INTO `region_age_distribution` VALUES (6, 2, '19-35岁', 38);
INSERT INTO `region_age_distribution` VALUES (7, 2, '36-59岁', 31);
INSERT INTO `region_age_distribution` VALUES (8, 2, '60岁以上', 15);
INSERT INTO `region_age_distribution` VALUES (9, 3, '0-18岁', 20);
INSERT INTO `region_age_distribution` VALUES (10, 3, '19-35岁', 36);
INSERT INTO `region_age_distribution` VALUES (11, 3, '36-59岁', 30);
INSERT INTO `region_age_distribution` VALUES (12, 3, '60岁以上', 14);
INSERT INTO `region_age_distribution` VALUES (13, 4, '0-18岁', 22);
INSERT INTO `region_age_distribution` VALUES (14, 4, '19-35岁', 32);
INSERT INTO `region_age_distribution` VALUES (15, 4, '36-59岁', 28);
INSERT INTO `region_age_distribution` VALUES (16, 4, '60岁以上', 18);
INSERT INTO `region_age_distribution` VALUES (17, 5, '0-18岁', 19);
INSERT INTO `region_age_distribution` VALUES (18, 5, '19-35岁', 34);
INSERT INTO `region_age_distribution` VALUES (19, 5, '36-59岁', 31);
INSERT INTO `region_age_distribution` VALUES (20, 5, '60岁以上', 16);
INSERT INTO `region_age_distribution` VALUES (21, 6, '0-18岁', 20);
INSERT INTO `region_age_distribution` VALUES (22, 6, '19-35岁', 30);
INSERT INTO `region_age_distribution` VALUES (23, 6, '36-59岁', 32);
INSERT INTO `region_age_distribution` VALUES (24, 6, '60岁以上', 18);

-- ----------------------------
-- Table structure for region_cultures
-- ----------------------------
DROP TABLE IF EXISTS `region_cultures`;
CREATE TABLE `region_cultures`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `region_id` int NULL DEFAULT NULL,
  `culture_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `region_id`(`region_id` ASC) USING BTREE,
  CONSTRAINT `region_cultures_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of region_cultures
-- ----------------------------
INSERT INTO `region_cultures` VALUES (1, 1, '京剧');
INSERT INTO `region_cultures` VALUES (2, 1, '相声');
INSERT INTO `region_cultures` VALUES (3, 1, '故宫文化');
INSERT INTO `region_cultures` VALUES (4, 1, '胡同文化');
INSERT INTO `region_cultures` VALUES (5, 2, '海派文化');
INSERT INTO `region_cultures` VALUES (6, 2, '弄堂文化');
INSERT INTO `region_cultures` VALUES (7, 2, '上海滑稽戏');
INSERT INTO `region_cultures` VALUES (8, 2, '沪剧');
INSERT INTO `region_cultures` VALUES (9, 3, '岭南文化');
INSERT INTO `region_cultures` VALUES (10, 3, '广府文化');
INSERT INTO `region_cultures` VALUES (11, 3, '客家文化');
INSERT INTO `region_cultures` VALUES (12, 3, '潮汕文化');
INSERT INTO `region_cultures` VALUES (13, 4, '傣族文化');
INSERT INTO `region_cultures` VALUES (14, 4, '彝族文化');
INSERT INTO `region_cultures` VALUES (15, 4, '白族文化');
INSERT INTO `region_cultures` VALUES (16, 4, '纳西族东巴文化');
INSERT INTO `region_cultures` VALUES (17, 5, '蜀文化');
INSERT INTO `region_cultures` VALUES (18, 5, '巴文化');
INSERT INTO `region_cultures` VALUES (19, 5, '藏族文化');
INSERT INTO `region_cultures` VALUES (20, 5, '羌族文化');
INSERT INTO `region_cultures` VALUES (21, 6, '蒙古族文化');
INSERT INTO `region_cultures` VALUES (22, 6, '草原文化');
INSERT INTO `region_cultures` VALUES (23, 6, '长调民歌');
INSERT INTO `region_cultures` VALUES (24, 6, '马头琴艺术');
INSERT INTO `region_cultures` VALUES (25, 6, '呼麦');
INSERT INTO `region_cultures` VALUES (26, 6, '那达慕文化');

-- ----------------------------
-- Table structure for region_ethnic_distribution
-- ----------------------------
DROP TABLE IF EXISTS `region_ethnic_distribution`;
CREATE TABLE `region_ethnic_distribution`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `region_id` int NULL DEFAULT NULL,
  `ethnic_group` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `percentage` float NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `region_id`(`region_id` ASC) USING BTREE,
  CONSTRAINT `region_ethnic_distribution_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of region_ethnic_distribution
-- ----------------------------
INSERT INTO `region_ethnic_distribution` VALUES (1, 1, '汉族', 95);
INSERT INTO `region_ethnic_distribution` VALUES (2, 1, '满族', 2);
INSERT INTO `region_ethnic_distribution` VALUES (3, 1, '蒙古族', 1);
INSERT INTO `region_ethnic_distribution` VALUES (4, 1, '其他', 2);
INSERT INTO `region_ethnic_distribution` VALUES (5, 2, '汉族', 98);
INSERT INTO `region_ethnic_distribution` VALUES (6, 2, '回族', 0.5);
INSERT INTO `region_ethnic_distribution` VALUES (7, 2, '满族', 0.5);
INSERT INTO `region_ethnic_distribution` VALUES (8, 2, '其他', 1);
INSERT INTO `region_ethnic_distribution` VALUES (9, 3, '汉族', 90);
INSERT INTO `region_ethnic_distribution` VALUES (10, 3, '壮族', 3);
INSERT INTO `region_ethnic_distribution` VALUES (11, 3, '瑶族', 2);
INSERT INTO `region_ethnic_distribution` VALUES (12, 3, '其他', 5);
INSERT INTO `region_ethnic_distribution` VALUES (13, 4, '汉族', 66);
INSERT INTO `region_ethnic_distribution` VALUES (14, 4, '彝族', 11);
INSERT INTO `region_ethnic_distribution` VALUES (15, 4, '白族', 8);
INSERT INTO `region_ethnic_distribution` VALUES (16, 4, '哈尼族', 4);
INSERT INTO `region_ethnic_distribution` VALUES (17, 4, '傣族', 3);
INSERT INTO `region_ethnic_distribution` VALUES (18, 4, '其他', 8);
INSERT INTO `region_ethnic_distribution` VALUES (19, 5, '汉族', 93);
INSERT INTO `region_ethnic_distribution` VALUES (20, 5, '彝族', 2);
INSERT INTO `region_ethnic_distribution` VALUES (21, 5, '藏族', 2);
INSERT INTO `region_ethnic_distribution` VALUES (22, 5, '羌族', 1);
INSERT INTO `region_ethnic_distribution` VALUES (23, 5, '其他', 2);
INSERT INTO `region_ethnic_distribution` VALUES (24, 6, '汉族', 79);
INSERT INTO `region_ethnic_distribution` VALUES (25, 6, '蒙古族', 17);
INSERT INTO `region_ethnic_distribution` VALUES (26, 6, '回族', 1.8);
INSERT INTO `region_ethnic_distribution` VALUES (27, 6, '满族', 0.3);
INSERT INTO `region_ethnic_distribution` VALUES (28, 6, '达斡尔族', 0.3);
INSERT INTO `region_ethnic_distribution` VALUES (29, 6, '鄂温克族', 0.2);
INSERT INTO `region_ethnic_distribution` VALUES (30, 6, '鄂伦春族', 0.1);
INSERT INTO `region_ethnic_distribution` VALUES (31, 6, '其他', 1.3);

-- ----------------------------
-- Table structure for region_festivals
-- ----------------------------
DROP TABLE IF EXISTS `region_festivals`;
CREATE TABLE `region_festivals`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `region_id` int NULL DEFAULT NULL,
  `festival_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `region_id`(`region_id` ASC) USING BTREE,
  CONSTRAINT `region_festivals_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of region_festivals
-- ----------------------------
INSERT INTO `region_festivals` VALUES (1, 1, '春节');
INSERT INTO `region_festivals` VALUES (2, 1, '元宵节');
INSERT INTO `region_festivals` VALUES (3, 1, '端午节');
INSERT INTO `region_festivals` VALUES (4, 1, '中秋节');
INSERT INTO `region_festivals` VALUES (5, 2, '春节');
INSERT INTO `region_festivals` VALUES (6, 2, '元宵节');
INSERT INTO `region_festivals` VALUES (7, 2, '端午节');
INSERT INTO `region_festivals` VALUES (8, 2, '中秋节');
INSERT INTO `region_festivals` VALUES (9, 2, '上海桃花节');
INSERT INTO `region_festivals` VALUES (10, 3, '春节');
INSERT INTO `region_festivals` VALUES (11, 3, '元宵节');
INSERT INTO `region_festivals` VALUES (12, 3, '清明节');
INSERT INTO `region_festivals` VALUES (13, 3, '端午节');
INSERT INTO `region_festivals` VALUES (14, 3, '中秋节');
INSERT INTO `region_festivals` VALUES (15, 3, '龙舟节');
INSERT INTO `region_festivals` VALUES (16, 4, '泼水节');
INSERT INTO `region_festivals` VALUES (17, 4, '火把节');
INSERT INTO `region_festivals` VALUES (18, 4, '三月街');
INSERT INTO `region_festivals` VALUES (19, 4, '目瑙纵歌节');
INSERT INTO `region_festivals` VALUES (20, 5, '春节');
INSERT INTO `region_festivals` VALUES (21, 5, '元宵节');
INSERT INTO `region_festivals` VALUES (22, 5, '清明节');
INSERT INTO `region_festivals` VALUES (23, 5, '端午节');
INSERT INTO `region_festivals` VALUES (24, 5, '中秋节');
INSERT INTO `region_festivals` VALUES (25, 5, '火把节');
INSERT INTO `region_festivals` VALUES (26, 6, '那达慕大会');
INSERT INTO `region_festivals` VALUES (27, 6, '敖包节');
INSERT INTO `region_festivals` VALUES (28, 6, '祭敖包');
INSERT INTO `region_festivals` VALUES (29, 6, '春节');
INSERT INTO `region_festivals` VALUES (30, 6, '元宵节');
INSERT INTO `region_festivals` VALUES (31, 6, '端午节');

-- ----------------------------
-- Table structure for region_foods
-- ----------------------------
DROP TABLE IF EXISTS `region_foods`;
CREATE TABLE `region_foods`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `region_id` int NULL DEFAULT NULL,
  `food_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `region_id`(`region_id` ASC) USING BTREE,
  CONSTRAINT `region_foods_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of region_foods
-- ----------------------------
INSERT INTO `region_foods` VALUES (1, 1, '北京烤鸭');
INSERT INTO `region_foods` VALUES (2, 1, '炸酱面');
INSERT INTO `region_foods` VALUES (3, 1, '豆汁儿');
INSERT INTO `region_foods` VALUES (4, 1, '驴打滚');
INSERT INTO `region_foods` VALUES (5, 2, '小笼包');
INSERT INTO `region_foods` VALUES (6, 2, '生煎包');
INSERT INTO `region_foods` VALUES (7, 2, '糖醋排骨');
INSERT INTO `region_foods` VALUES (8, 2, '本帮菜');
INSERT INTO `region_foods` VALUES (9, 3, '粤菜');
INSERT INTO `region_foods` VALUES (10, 3, '早茶');
INSERT INTO `region_foods` VALUES (11, 3, '烧腊');
INSERT INTO `region_foods` VALUES (12, 3, '煲仔饭');
INSERT INTO `region_foods` VALUES (13, 4, '过桥米线');
INSERT INTO `region_foods` VALUES (14, 4, '汽锅鸡');
INSERT INTO `region_foods` VALUES (15, 4, '鲜花饼');
INSERT INTO `region_foods` VALUES (16, 4, '烧饵块');
INSERT INTO `region_foods` VALUES (17, 5, '川菜');
INSERT INTO `region_foods` VALUES (18, 5, '火锅');
INSERT INTO `region_foods` VALUES (19, 5, '串串香');
INSERT INTO `region_foods` VALUES (20, 5, '担担面');
INSERT INTO `region_foods` VALUES (21, 6, '手扒肉');
INSERT INTO `region_foods` VALUES (22, 6, '烤全羊');
INSERT INTO `region_foods` VALUES (23, 6, '奶豆腐');
INSERT INTO `region_foods` VALUES (24, 6, '奶茶');
INSERT INTO `region_foods` VALUES (25, 6, '炒米');
INSERT INTO `region_foods` VALUES (26, 6, '马奶酒');

-- ----------------------------
-- Table structure for region_images
-- ----------------------------
DROP TABLE IF EXISTS `region_images`;
CREATE TABLE `region_images`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `region_id` int NULL DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `region_id`(`region_id` ASC) USING BTREE,
  CONSTRAINT `region_images_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of region_images
-- ----------------------------
INSERT INTO `region_images` VALUES (1, 1, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (2, 1, 'https://images.unsplash.com/photo-1448906653440-6570498f1018?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (3, 1, 'https://images.unsplash.com/photo-1565638867759-d2e3395970b3?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (4, 2, 'https://images.unsplash.com/photo-1524654458049-e36be0721fa2?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (5, 2, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (6, 2, 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (7, 3, 'https://images.unsplash.com/photo-1559656292-9015100b5a11?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (8, 3, 'https://images.unsplash.com/photo-1594115509581-137f42c180f3?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (9, 3, 'https://images.unsplash.com/photo-1556821857-cea3f089310c?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (10, 4, 'https://images.unsplash.com/photo-1566323066628-0b1c10d98e4b?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (11, 4, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (12, 4, 'https://images.unsplash.com/photo-1575141253649-653b8303e926?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (13, 5, 'https://images.unsplash.com/photo-1537525430866-002ed271a505?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (14, 5, 'https://images.unsplash.com/photo-1582114374894-6c75d2f2503d?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (15, 5, 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (16, 6, 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (17, 6, 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=100&h=80&fit=crop');
INSERT INTO `region_images` VALUES (18, 6, 'https://images.unsplash.com/photo-1530650328176-893926c246ca?w=100&h=80&fit=crop');

-- ----------------------------
-- Table structure for region_stats
-- ----------------------------
DROP TABLE IF EXISTS `region_stats`;
CREATE TABLE `region_stats`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `region_id` int NULL DEFAULT NULL,
  `building_count` int NULL DEFAULT NULL,
  `costume_count` int NULL DEFAULT NULL,
  `music_count` int NULL DEFAULT NULL,
  `craft_count` int NULL DEFAULT NULL,
  `sport_count` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `region_id`(`region_id` ASC) USING BTREE,
  CONSTRAINT `region_stats_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of region_stats
-- ----------------------------
INSERT INTO `region_stats` VALUES (1, 1, 15, 8, 12, 20, 5);
INSERT INTO `region_stats` VALUES (2, 2, 12, 6, 8, 15, 4);
INSERT INTO `region_stats` VALUES (3, 3, 20, 15, 25, 30, 8);
INSERT INTO `region_stats` VALUES (4, 4, 25, 52, 48, 60, 20);
INSERT INTO `region_stats` VALUES (5, 5, 18, 14, 20, 35, 10);
INSERT INTO `region_stats` VALUES (6, 6, 25, 30, 40, 25, 15);

-- ----------------------------
-- Table structure for region_visitor_counts
-- ----------------------------
DROP TABLE IF EXISTS `region_visitor_counts`;
CREATE TABLE `region_visitor_counts`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `region_id` int NULL DEFAULT NULL,
  `month` int NULL DEFAULT NULL,
  `visitor_count` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `region_id`(`region_id` ASC) USING BTREE,
  CONSTRAINT `region_visitor_counts_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 73 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of region_visitor_counts
-- ----------------------------
INSERT INTO `region_visitor_counts` VALUES (1, 1, 1, 1200000);
INSERT INTO `region_visitor_counts` VALUES (2, 1, 2, 1100000);
INSERT INTO `region_visitor_counts` VALUES (3, 1, 3, 1300000);
INSERT INTO `region_visitor_counts` VALUES (4, 1, 4, 1500000);
INSERT INTO `region_visitor_counts` VALUES (5, 1, 5, 1800000);
INSERT INTO `region_visitor_counts` VALUES (6, 1, 6, 2000000);
INSERT INTO `region_visitor_counts` VALUES (7, 1, 7, 2200000);
INSERT INTO `region_visitor_counts` VALUES (8, 1, 8, 2100000);
INSERT INTO `region_visitor_counts` VALUES (9, 1, 9, 1900000);
INSERT INTO `region_visitor_counts` VALUES (10, 1, 10, 1600000);
INSERT INTO `region_visitor_counts` VALUES (11, 1, 11, 1400000);
INSERT INTO `region_visitor_counts` VALUES (12, 1, 12, 1300000);
INSERT INTO `region_visitor_counts` VALUES (13, 2, 1, 1500000);
INSERT INTO `region_visitor_counts` VALUES (14, 2, 2, 1400000);
INSERT INTO `region_visitor_counts` VALUES (15, 2, 3, 1600000);
INSERT INTO `region_visitor_counts` VALUES (16, 2, 4, 1800000);
INSERT INTO `region_visitor_counts` VALUES (17, 2, 5, 2100000);
INSERT INTO `region_visitor_counts` VALUES (18, 2, 6, 2300000);
INSERT INTO `region_visitor_counts` VALUES (19, 2, 7, 2500000);
INSERT INTO `region_visitor_counts` VALUES (20, 2, 8, 2400000);
INSERT INTO `region_visitor_counts` VALUES (21, 2, 9, 2200000);
INSERT INTO `region_visitor_counts` VALUES (22, 2, 10, 1900000);
INSERT INTO `region_visitor_counts` VALUES (23, 2, 11, 1700000);
INSERT INTO `region_visitor_counts` VALUES (24, 2, 12, 1600000);
INSERT INTO `region_visitor_counts` VALUES (25, 3, 1, 1800000);
INSERT INTO `region_visitor_counts` VALUES (26, 3, 2, 1700000);
INSERT INTO `region_visitor_counts` VALUES (27, 3, 3, 1900000);
INSERT INTO `region_visitor_counts` VALUES (28, 3, 4, 2200000);
INSERT INTO `region_visitor_counts` VALUES (29, 3, 5, 2500000);
INSERT INTO `region_visitor_counts` VALUES (30, 3, 6, 2800000);
INSERT INTO `region_visitor_counts` VALUES (31, 3, 7, 3000000);
INSERT INTO `region_visitor_counts` VALUES (32, 3, 8, 2900000);
INSERT INTO `region_visitor_counts` VALUES (33, 3, 9, 2600000);
INSERT INTO `region_visitor_counts` VALUES (34, 3, 10, 2300000);
INSERT INTO `region_visitor_counts` VALUES (35, 3, 11, 2000000);
INSERT INTO `region_visitor_counts` VALUES (36, 3, 12, 1900000);
INSERT INTO `region_visitor_counts` VALUES (37, 4, 1, 1000000);
INSERT INTO `region_visitor_counts` VALUES (38, 4, 2, 900000);
INSERT INTO `region_visitor_counts` VALUES (39, 4, 3, 1200000);
INSERT INTO `region_visitor_counts` VALUES (40, 4, 4, 1600000);
INSERT INTO `region_visitor_counts` VALUES (41, 4, 5, 2000000);
INSERT INTO `region_visitor_counts` VALUES (42, 4, 6, 2400000);
INSERT INTO `region_visitor_counts` VALUES (43, 4, 7, 2800000);
INSERT INTO `region_visitor_counts` VALUES (44, 4, 8, 2700000);
INSERT INTO `region_visitor_counts` VALUES (45, 4, 9, 2300000);
INSERT INTO `region_visitor_counts` VALUES (46, 4, 10, 1800000);
INSERT INTO `region_visitor_counts` VALUES (47, 4, 11, 1400000);
INSERT INTO `region_visitor_counts` VALUES (48, 4, 12, 1200000);
INSERT INTO `region_visitor_counts` VALUES (49, 5, 1, 1600000);
INSERT INTO `region_visitor_counts` VALUES (50, 5, 2, 1500000);
INSERT INTO `region_visitor_counts` VALUES (51, 5, 3, 1800000);
INSERT INTO `region_visitor_counts` VALUES (52, 5, 4, 2100000);
INSERT INTO `region_visitor_counts` VALUES (53, 5, 5, 2400000);
INSERT INTO `region_visitor_counts` VALUES (54, 5, 6, 2700000);
INSERT INTO `region_visitor_counts` VALUES (55, 5, 7, 2900000);
INSERT INTO `region_visitor_counts` VALUES (56, 5, 8, 2800000);
INSERT INTO `region_visitor_counts` VALUES (57, 5, 9, 2500000);
INSERT INTO `region_visitor_counts` VALUES (58, 5, 10, 2100000);
INSERT INTO `region_visitor_counts` VALUES (59, 5, 11, 1800000);
INSERT INTO `region_visitor_counts` VALUES (60, 5, 12, 1700000);
INSERT INTO `region_visitor_counts` VALUES (61, 6, 1, 800000);
INSERT INTO `region_visitor_counts` VALUES (62, 6, 2, 700000);
INSERT INTO `region_visitor_counts` VALUES (63, 6, 3, 1000000);
INSERT INTO `region_visitor_counts` VALUES (64, 6, 4, 1400000);
INSERT INTO `region_visitor_counts` VALUES (65, 6, 5, 1800000);
INSERT INTO `region_visitor_counts` VALUES (66, 6, 6, 2200000);
INSERT INTO `region_visitor_counts` VALUES (67, 6, 7, 2600000);
INSERT INTO `region_visitor_counts` VALUES (68, 6, 8, 2500000);
INSERT INTO `region_visitor_counts` VALUES (69, 6, 9, 2100000);
INSERT INTO `region_visitor_counts` VALUES (70, 6, 10, 1600000);
INSERT INTO `region_visitor_counts` VALUES (71, 6, 11, 1200000);
INSERT INTO `region_visitor_counts` VALUES (72, 6, 12, 900000);

-- ----------------------------
-- Table structure for regions
-- ----------------------------
DROP TABLE IF EXISTS `regions`;
CREATE TABLE `regions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `building_count` int NULL DEFAULT NULL,
  `clothing_count` int NULL DEFAULT NULL,
  `music_count` int NULL DEFAULT NULL,
  `craft_count` int NULL DEFAULT NULL,
  `sport_count` int NULL DEFAULT NULL,
  `main_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of regions
-- ----------------------------
INSERT INTO `regions` VALUES (1, '北京', '北京是中国的首都，拥有悠久的历史和丰富的文化遗产，是中国政治、文化和国际交往中心。', 15, 8, 12, 20, 5, '北京是中国的首都，拥有悠久的历史和丰富的文化遗产，是中国政治、文化和国际交往中心。', '2026-02-27 12:00:31');
INSERT INTO `regions` VALUES (2, '上海', '上海是中国的经济中心和国际化大都市，融合了中西方文化，拥有独特的海派文化特色。', 12, 6, 8, 15, 4, '上海是中国的经济中心和国际化大都市，融合了中西方文化，拥有独特的海派文化特色。', '2026-02-27 12:00:31');
INSERT INTO `regions` VALUES (3, '广东', '广东是中国南方的经济大省，拥有丰富的岭南文化遗产，是中国改革开放的前沿阵地。', 20, 15, 25, 30, 8, '广东是中国南方的经济大省，拥有丰富的岭南文化遗产，是中国改革开放的前沿阵地。', '2026-02-27 12:00:31');
INSERT INTO `regions` VALUES (4, '云南', '云南是中国少数民族最多的省份，拥有丰富多彩的民族文化和自然景观，是著名的旅游胜地。', 25, 52, 48, 60, 20, '云南是中国少数民族最多的省份，拥有丰富多彩的民族文化和自然景观，是著名的旅游胜地。', '2026-02-27 12:00:31');
INSERT INTO `regions` VALUES (5, '四川', '四川是中国西南地区的经济文化中心，拥有悠久的历史和丰富的文化遗产，以川菜和大熊猫闻名于世。', 18, 14, 20, 35, 10, '四川是中国西南地区的经济文化中心，拥有悠久的历史和丰富的文化遗产，以川菜和大熊猫闻名于世。', '2026-02-27 12:00:31');
INSERT INTO `regions` VALUES (6, '内蒙古', '内蒙古自治区是中国的少数民族自治区，以蒙古族为主，拥有辽阔的草原和丰富的民族文化，是著名的草原旅游胜地。', 25, 30, 40, 25, 15, '内蒙古自治区是中国的少数民族自治区，以蒙古族为主，拥有辽阔的草原和丰富的民族文化，是著名的草原旅游胜地。', '2026-02-27 12:00:31');

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags`  (
  `id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '标签ID',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '标签',
  `topic_count` int NOT NULL DEFAULT 0 COMMENT '关联作品数',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '标签表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of tags
-- ----------------------------
INSERT INTO `tags` VALUES ('2026515978883440641', 'dffefg', 1);
INSERT INTO `tags` VALUES ('2026515978946355201', 'fgrfgtht', 1);
INSERT INTO `tags` VALUES ('2031676102780780546', '汉服', 2);
INSERT INTO `tags` VALUES ('2031691553200062466', '12123', 2);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户ID',
  `username` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `nickname` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `password` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '密码',
  `avatar` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '头像',
  `banner` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '横幅',
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `mobile` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '手机',
  `bio` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '个人简介',
  `ethnic_group` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '民族',
  `province` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '省份',
  `city` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '城市',
  `interest_tags` json NULL COMMENT '兴趣标签',
  `security_question` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '安全问题',
  `security_answer` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '' COMMENT '安全问题答案',
  `create_time` datetime NOT NULL COMMENT '加入时间',
  `modify_time` datetime NULL DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_name`(`username` ASC) USING BTREE,
  INDEX `user_email`(`email` ASC) USING BTREE,
  INDEX `user_create_time`(`create_time` ASC) USING BTREE,
  INDEX `idx_ethnic`(`ethnic_group` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('2026152657965563906', 'zhangsan', 'Satou', '123456', 'Https://teststorage1.oss-cn-beijing.aliyuncs.com/2026/03/194aa008-471d-4bf1-8bf8-ba9287702df4.jpg', 'Https://teststorage1.oss-cn-beijing.aliyuncs.com/2026/03/43738411-7d36-4ed1-beb3-80436ddf821d.jpg', '12231234@qq.com', '13246576', '无', '汉', '辽宁省', '大连市', '[\"汉服\", \"qwrew\", \"12123\"]', '', '', '2026-02-24 12:30:12', '2026-03-17 11:31:24');
INSERT INTO `user` VALUES ('2026186367314202626', 'lisi', '李四', 'lisi', 'Https://teststorage1.oss-cn-beijing.aliyuncs.com/2026/03/71bcd20f-679b-4940-bc7f-2fdd66fc4efd.webp', NULL, '114514@qq.com', '123456789', '无', '蒙古族', '辽宁省', '大连市', '[\"12123\"]', '', '', '2026-02-24 14:44:09', '2026-03-14 12:15:05');

SET FOREIGN_KEY_CHECKS = 1;
