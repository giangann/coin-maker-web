import { FormLabel as MFormLabel, styled } from '@mui/material'

const FormLabel = styled(MFormLabel)(({ theme }) => ({
  color: theme.palette.grey[500],
  fontSize: 16,
  marginBottom: theme.spacing(0.5),
}))

export { FormLabel }
