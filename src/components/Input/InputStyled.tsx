import { OutlinedInput, outlinedInputClasses, styled } from '@mui/material'

const InputStyled = styled(OutlinedInput)(({ theme }) => ({
  [`&.${outlinedInputClasses.disabled}`]: {
    backgroundColor: theme.palette.grey[300],
  },
}))

export { InputStyled }
