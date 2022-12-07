import { Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { backgroundColor, blue, BoxFlexCenterSpaceBetween, BoxHeader, strokeColor } from '@/styles'

interface ICardProps {
  title?: string | React.ReactNode
  children: React.ReactNode
  hasMore?: boolean
}

export const Card = ({ title, children, hasMore = true }: ICardProps) => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        padding: { xs: '14px', sm: '20px' },
        borderRadius: 1,
        backgroundColor: backgroundColor['primary'],
        border: `1px solid ${strokeColor['primary']}`,
        overflow: 'hidden',
      }}
    >
      {(title || hasMore) && (
        <BoxFlexCenterSpaceBetween sx={{ marginBottom: '24px' }}>
          {title && <BoxHeader>{title}</BoxHeader>}
          {hasMore && <Typography sx={{ color: blue['primary'] }}>{t('more')}</Typography>}
        </BoxFlexCenterSpaceBetween>
      )}
      {children}
    </Box>
  )
}
