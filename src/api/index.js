import * as tradeMark from './product/tradeMark'
import * as attr from './product/attr'
import * as spu from './product/spu'
import * as role from './acl/role'
import * as menu from './acl/menu'

// 引入默认暴露对象的写法
import user from './acl/user'
import sku from './product/sku'

export default {
    tradeMark,
    attr,
    spu,
    sku,
    user,
    role,
    menu
}