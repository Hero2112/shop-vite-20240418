import request from '/@/utils/request'

export function getList() {
  return request({
    // 正式项目请移除或更换为真实地址
    url: 'https://fc-mp-851edf02-46eb-43e6-828d-64c7e483ea41.next.bspapp.com/http/getShopDescription',
    method: 'get',
  })
}
