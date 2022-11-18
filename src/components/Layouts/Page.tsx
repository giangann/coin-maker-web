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
      // elevation={1}
      sx={{
        padding: '30px 20px',
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
            fontSize: { xs: '1rem', md: '1.5rem' },
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
