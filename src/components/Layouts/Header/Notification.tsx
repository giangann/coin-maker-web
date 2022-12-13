import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  SxProps,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InView } from 'react-intersection-observer'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'

import BellIcon from '@/assets/svgs/bell_icon.svg'
import { NOTI_TYPE, STATUS_NOTIFICATION } from '@/constants'
import { usePaginationQuery } from '@/libs/hooks'
import { request } from '@/libs/request'
import { NotificationType } from '@/libs/types/notification'
import { formatTimeDiff } from '@/libs/utils'
import { Title } from '@/screens'
import { backgroundColor } from '@/styles/colors'
interface NotificationProps {}

const Notification: React.FC<NotificationProps> = () => {
  const { t } = useTranslation()
  const [notiFilter, setNotiFilter] = useState<'all' | 'unread'>('all')
  const [anchorNoti, setAnchorNoti] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorNoti)
  const navigate = useNavigate()

  const {
    paginationData: { data: notifications },
    refetch: refetchNotification,
    handleChangeParams,
    isLoading: isLoadingNotification,
  } = usePaginationQuery<NotificationType>(`notification/by-user`, { per_page: 20 })

  const { data: newCount, refetch: refecthNewCount } = useQuery(`notification/new-count`)
  const handleOpenNoti = async (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorNoti(event.currentTarget)
    if (newCount !== 0) {
      await request.post('notification/mark-as-seen')
      refecthNewCount()
    }
  }

  const handleClose = () => {
    setAnchorNoti(null)
  }

  const handleChangeFilter = (event: MouseEvent<HTMLElement>, filter: 'all' | 'unread') => {
    setNotiFilter(filter)
    // handleChangeParams({ filter: filter })
  }

  const markAllAsRead = async () => {
    await request.post('notification/mark-all-as-read')
    refetchNotification()
  }

  const [notiCount, setNotiCount] = useState<number>(0)
  const [isAvaiableRefetch, setIsAvaiableRefetch] = useState<boolean>(false)

  const _handleChangeParams = () => {
    if (notifications.length < 50 && isAvaiableRefetch) {
      handleChangeParams({ per_page: notifications.length + 10, filter: notiFilter })
      refetchNotification()
    }
  }

  const NotificationItem = useCallback(({ noti }: { noti: NotificationType }) => {
    return (
      <MenuItem
        sx={
          {
            // background:
            //   (noti.status === STATUS_NOTIFICATION['UNREAD'] ||
            //     noti.status === STATUS_NOTIFICATION['NEW']) &&
            //   '#EEE',
            minHeight: (theme: Theme) => theme.spacing(10),
            mb: 1,
            justifyContent: 'space-between',
            gap: 1,
          } as SxProps
        }
        style={{ whiteSpace: 'normal' }}
        onClick={() => markAsRead(noti)}
      >
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Title variant="body1">
            {/* {noti.content as string} */}
            <span style={{ fontWeight: '600', marginRight: 10 }}>{noti?.sender_name}</span>
            {createContentNoti(noti)}
          </Title>
          <Typography variant="body2" color="grey.500">
            {formatTimeDiff(noti.created_at)}
          </Typography>
        </Stack>
        {noti.status === STATUS_NOTIFICATION['UNREAD'] ||
        noti.status === STATUS_NOTIFICATION['NEW'] ? (
          <Badge
            color="primary"
            variant="dot"
            sx={{ width: '12px', height: '12px', position: 'relative', top: '8px' }}
          />
        ) : null}
      </MenuItem>
    )
  }, [])

  const createContentNoti = (noti: NotificationType) => {
    // for admin: user create or update form
    if (noti.type === NOTI_TYPE.CREATE) {
      return `create new exchange money request`
    }
    if (noti.type === NOTI_TYPE.UPDATE) {
      return `update exchange money request`
    }

    // for user: (2 situations)
    // 1: admin accept or reject application
    // 2: other user donate point
    if (noti.type === NOTI_TYPE.ACCEPT) {
      return `Admin accepted your exchange money request, please check your bank transaction`
    }
    if (noti.type === NOTI_TYPE.REJECTE) {
      return `Oops! Admin rejected your exchange money request, please try again`
    }
    if (noti.type === NOTI_TYPE.DONATE) {
      return `gived you point, please check it out`
    }
  }

  const markAsRead = async (noti: NotificationType) => {
    const res = await request.post(`notification/mark-as-read/${noti.id}`)

    if (noti.model_type === 'ScoreToMoneyForm') {
      navigate(`/form/${noti.model_id}`)
    }
    if (noti.model_type === 'Donate') {
      navigate(`/profile`)
    }

    refetchNotification()

    handleClose()
  }

  useEffect(() => {
    if (notiCount !== notifications.length) {
      setNotiCount(notifications.length)
      setIsAvaiableRefetch(true)
    } else {
      setIsAvaiableRefetch(false)
    }
  }, [notifications])

  return (
    <>
      <IconButton onClick={handleOpenNoti}>
        <Badge badgeContent={newCount as number} color="error">
          <img src={BellIcon} alt="bell" style={{ width: '28px', height: '28px', fill: '#fff' }} />
        </Badge>
      </IconButton>

      <Popover
        anchorEl={anchorNoti}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{ mt: '10px' }}
      >
        <Stack
          spacing={0.5}
          height="70vh"
          sx={{
            position: 'relative',
            width: {
              xs: '90vw',
              md: '360px',
            },
            maxWidth: '400px',
            backgroundColor: backgroundColor.main,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ p: (theme) => theme.spacing(3, 2, 0) }}
          >
            <Typography variant="h6">{t('notification.title')}</Typography>

            {/* <ToggleButtonGroup
              value={notiFilter}
              exclusive
              size="small"
              onChange={handleChangeFilter}
            >
              <ToggleButton value="all">
                <Typography
                  sx={{ fontSize: '14px', fontWeight: '700', textTransform: 'capitalize' }}
                >
                  {t('notification.all')}
                </Typography>
              </ToggleButton>

              <ToggleButton value="unread">
                <Typography
                  sx={{ fontSize: '14px', fontWeight: '700', textTransform: 'capitalize' }}
                >
                  {t('notification.unread')}
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup> */}
          </Stack>
          <Box
            width="100%"
            height="100%"
            sx={{ overflowY: 'auto', px: (theme) => theme.spacing(3, 2, 1) }}
          >
            {notifications.length ? (
              <MenuList dense>
                {notifications?.map((noti, index) =>
                  notifications.length - 1 === index ? (
                    <InView
                      key={noti.id}
                      onChange={(inView) => {
                        if (inView && !isLoadingNotification) {
                          _handleChangeParams()
                        }
                      }}
                    >
                      <NotificationItem noti={noti} key={noti.id} />
                    </InView>
                  ) : (
                    <NotificationItem noti={noti} key={noti.id} />
                  ),
                )}
              </MenuList>
            ) : (
              <Typography
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  fontWeight: '700',
                }}
              >
                {t('notification.no_notification')}
              </Typography>
            )}
          </Box>
          <Divider />
          <Button
            sx={{
              py: 0.5,
              width: '100%',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: backgroundColor.primary,
              },
              borderRadius: 'unset',
            }}
            onClick={markAllAsRead}
          >
            {t('notification.mark_all')}
          </Button>
        </Stack>
      </Popover>
    </>
  )
}

export { Notification }
