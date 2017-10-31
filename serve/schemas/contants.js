/**
 * 蚂蚁信用分级
 */
const ANT_CREDIT = {
    '0': {text: '普通', range: '-600'},
    'A': {text: '良好（600分以上）', range: '+600'},
    'B': {text: '优秀（650以上）', range: '+650'},
    'C': {text: '极好（700分以上）', range: '+700'},
    'D': {text: '750分以上', range: '+750'},
    'E': {text: '800分以上', range: '+800'},
    'F': {text: '850分以上', range: '+850'}
};


/**
 * 会员等级
 */
const MEMBER_LEVEL = {
    '0': '普通用户',
    '1': '大众会员',
    '2': '黄金会员',
    '3': '钻石会员'
};

/**
 * 过期时间
 */
const EXPIRATION = {
    'A': '不限',
    'B': '半个月',
    'C': '三天',
    'D': '当天'
};


module.exports = {
    ANT_CREDIT,
    MEMBER_LEVEL,
    EXPIRATION
};