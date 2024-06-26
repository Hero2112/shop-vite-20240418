import request from '/@/utils/request'

export function getList() {
  return request({
    url: '/area/getList',
    method: 'get',
  })
}

export function doEdit(data: any) {
  return request({
    url: '/area/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/area/doDelete',
    method: 'post',
    data,
  })
}
