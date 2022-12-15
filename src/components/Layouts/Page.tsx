import { Paper, PaperProps, Typography } from '@mui/material'
import React from 'react'

import { backgroundColor } from '@/styles'

type PageProps = {
  title?: string
  sxCustom?: any
} & PaperProps

export const Page = ({ title, children, sxCustom, ...props }: PageProps) => {
  return (
    <Paper
      sx={{
        padding: { xs: '16px 8px', sm: 3 },
        margin: '8px 0',
        borderRadius: 2,
        backgroundColor: backgroundColor['primary'],
        ...sxCustom,
      }}
      {...props}
    >
      {title && (
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            color: '#fff',
            mb: { xs: 2, sm: 'unset' },
          }}
          color="grey.900"
        >
          {title}
        </Typography>
      )}
      {children}
    </Paper>
  )
}
