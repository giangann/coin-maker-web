import { Avatar, Button, MenuItem, MenuList, Popover, styled, Typography } from '@mui/material'
import { useAtom } from 'jotai'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { userAtomWithStorage, userProfileImage } from '@/libs/atoms'

export const ProfileHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const [userStorage, setUserStorage] = useAtom(userAtomWithStorage)
  const [profileImage, setProfileImage] = useAtom(userProfileImage)
  const isLoggined = userStorage ? true : false

  const userProfileHeaderItems = [
    {
      icon: '',
      name: 'Profile',
      link: '/profile',
    },
  ]

  const adminProfileHeaderItems = [
    {
      icon: '',
      name: 'Dashboard',
    },
  ]

  const navigate = useNavigate()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <>
      <LanguageButton onClick={handleClick}>
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
          {userProfileHeaderItems.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleClose()
                navigate(item.link)
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
