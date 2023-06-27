import moment from 'moment'

export const formatDateTime = (str: string) => {
  return (str && moment(str).format('YYYY/MM/DD HH:mm:ss')) || '-'
}
