import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import React, { MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BellIcon from '@/assets/svgs/bell_icon.svg'
import { backgroundColor } from '@/styles/colors'
interface NotificationProps {}

const Notification: React.FC<NotificationProps> = () => {
  const { t } = useTranslation()
  const [notiFilter, setNotiFilter] = useState<'all' | 'unread'>('all')
  const [anchorNoti, setAnchorNoti] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorNoti)

  const handleOpenNoti = async (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorNoti(event.currentTarget)
    // if (newCount !== 0) {
    //   await markAsSeenApi()
    //   refecthNewCount()
    // }
  }

  const handleClose = () => {
    setAnchorNoti(null)
  }

  const handleChangeFilter = (event: MouseEvent<HTMLElement>, filter: 'all' | 'unread') => {
    setNotiFilter(filter)
    // handleChangeParams({ filter: filter })
  }

  const maskAllAsRead = async () => {
    // await markAllAsReadApi()
    // refetchNotification()
    console.log('maskAllAsRead')
    // handleClose()
  }

  const newCount = 0

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

            <ToggleButtonGroup
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
            </ToggleButtonGroup>
          </Stack>
          <Box
            width="100%"
            height="100%"
            sx={{ overflowY: 'auto', px: (theme) => theme.spacing(3, 2, 1) }}
          >
            {/* {notifications.length ? (
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
            ) : ( */}
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
            {/* )} */}
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
            onClick={maskAllAsRead}
          >
            {t('notification.mark_all')}
          </Button>
        </Stack>
      </Popover>
    </>
  )
}

export { Notification }
