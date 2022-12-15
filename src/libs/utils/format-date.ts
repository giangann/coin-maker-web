import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export const changeTimeZone = (date: Date | string, timeZone: string) => {
  return utcToZonedTime(date, timeZone)
  // if (typeof date === 'string') {
  //   let newDate = new Date(date);
  //   return new Date(
  //     new Date(date).toLocaleString({ timeZone})
  //   );
  // }

  // return new Date(
  //   date.toDateString({ timeZone})
  // );
}

export const convertDatetimeTZ = (d: Date | string, timezone = 'UTC') => {
  let date = new Date(d)
  if (typeof d === 'string') {
    date = new Date(d.split(' ').join('T') + 'Z')
  }

  const utcDate = changeTimeZone(d, 'UTC')
  //@ts-ignorez
  const tzDate = changeTimeZone(date, timezone)
  const offset = utcDate.getTime() - tzDate.getTime()
  date.setTime(date.getTime() - offset)
  return tzDate
}
export const replaceDashesToSlashes = (d: any) => {
  if (typeof d === 'string') {
    d = d.replace(/-/g, '/')
    return d
  }
  return d
}
export const dateTimeWithoutSecond = (d: Date | string, formatDate = 'dd/MM/yyyy') => {
  d = replaceDashesToSlashes(d)
  return format(new Date(d), formatDate + ' HH:mm')
}

export const convertDatetimeTZWithoutSecond = (
  d: Date | string,
  timezone = 'Asia/Ho_Chi_Minh',
  formatDate = 'dd/MM/yyyy',
) => {
  if (!d) {
    return null
  }
  d = replaceDashesToSlashes(d)
  const date = new Date(d)
  const utcDate = changeTimeZone(d, 'UTC')
  //@ts-ignorez
  const tzDate = changeTimeZone(d, timezone)
  const offset = utcDate.getTime() - tzDate.getTime()
  date.setTime(date.getTime() - offset)
  return dateTimeWithoutSecond(date, formatDate)
}
