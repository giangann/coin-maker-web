import { createTheme, ThemeProvider } from '@mui/material/styles'

import { Card } from '@/components'
import { ScoreToMoneyForm } from '@/components/Form'

export const lightTheme = createTheme({
  palette: {
    text: {
      primary: '#fff',
    },
  },
})

export const ScoreToMoneyEditForm = () => {
  return (
    <Card title="Form detail" hasMore={false}>
      <ThemeProvider theme={lightTheme}>
        <ScoreToMoneyForm themeStyle="light" />
      </ThemeProvider>
    </Card>
  )
}
