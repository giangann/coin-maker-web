// @ts-nocheck
import { Avatar, Button, MenuItem, MenuList, Popover, styled, Typography } from '@mui/material'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { userAtomWithStorage, userProfileImage } from '@/libs/atoms'
import { useAuth } from '@/libs/hooks'
import { LoginDialog } from '@/screens'

export const ProfileHeader = (props: any) => {
  const { handleLogout } = props
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const { isAdmin } = useAuth()
  const [userStorage, setUserStorage] = useAtom(userAtomWithStorage)
  const [profileImage, setProfileImage] = useAtom(userProfileImage)
  const isLoggined = userStorage ? true : false
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const userProfileHeaderItems = [
    {
      icon: '',
      name: 'Profile',
      link: '/profile',
    },
    {
      icon: '',
      name: 'Logout',
      onChoose: () => {
        handleLogout()
      },
    },
  ]

  const adminProfileHeaderItems = [
    {
      icon: '',
      name: 'Dashboard',
      link: '/dashboard',
    },
    {
      icon: '',
      name: 'Profile',
      link: '/profile',
    },
    {
      icon: '',
      name: 'Logout',
      onChoose: () => {
        handleLogout()
        handleClose()
      },
    },
  ]

  const loginItems = [
    {
      icon: '',
      name: 'Login',
      onChoose: () => {
        setOpenLoginDialog(true)
      },
    },
  ]

  const profileHeaderItems = isLoggined
    ? isAdmin
      ? adminProfileHeaderItems
      : userProfileHeaderItems
    : loginItems

  const navigate = useNavigate()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <>
      <LanguageButton sx={{ minWidth: { xs: 52, sm: 64 } }} onClick={handleClick}>
        <Avatar
          sx={{ width: '32px', height: '32px' }}
          alt="Remy Sharp"
          src={isLoggined ? (profileImage as any) : '/assets/images/avatar3.webp'}
        />
      </LanguageButton>

      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <MenuList>
          {profileHeaderItems.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                if (item?.link as any) {
                  navigate(item.link as any)
                } else item?.onChoose?.()
                handleClose()
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  color: '#757575',
                }}
              >
                {item.name}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Popover>

      <LoginDialog open={openLoginDialog} handleClose={handleCloseLoginDialog} />
    </>
  )
}

const LanguageButton = styled(Button)(({ theme }) => ({
  '&:hover': {
    background: 'rgba(89, 195, 255, 0.1)',
  },
  fontSize: theme.spacing(1.75),
  fontWeight: 600,
  lineHeight: theme.spacing(3.5),
  textTransform: 'uppercase',
  color: theme.palette.grey[600],
  // margin: 30,
  padding: `0px ${theme.spacing(1)}`,
  '& span': {
    paddingBottom: '4px',
  },
}))
