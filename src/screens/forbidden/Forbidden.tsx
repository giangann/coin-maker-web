import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { BoxFlexCenter } from '@/styles'

export const Forbidden = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <BoxFlexCenter>
        <Typography sx={{ fontSize: 96, fontWeight: 700, mb: 4 }}>Forbidden</Typography>
      </BoxFlexCenter>
      <BoxFlexCenter>
        <Link to="/">Return Home page</Link>
      </BoxFlexCenter>
    </Box>
  )
}
