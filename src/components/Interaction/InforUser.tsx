import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'

interface IInforUser {
  user_name: string
  user_avatar: string
  time?: string
}

export const InforUser: React.FC<IInforUser> = ({ user_name, user_avatar, time }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '16px' }}>
      <Avatar
        src={user_avatar}
        sx={{
          width: {
            xs: 32,
            sm: 28,
          },
          height: {
            xs: 32,
            sm: 28,
          },
        }}
      />
      <Box>
        <Typography sx={{ fontWeight: 700 }}>{user_name}</Typography>
        {time && (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', fontWeight: 400 }}>
            {time}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
