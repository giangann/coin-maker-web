import { OutlinedInput, outlinedInputClasses, styled } from '@mui/material'

const InputStyled = styled(OutlinedInput)(({ theme }) => ({
  [`&.${outlinedInputClasses.disabled}`]: {
    backgroundColor: theme.palette.grey[300],
  },
  // '& fieldset::not()': {
  //   borderColor: 'red !important',
  // },
}))

export { InputStyled }
