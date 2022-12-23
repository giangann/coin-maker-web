import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  return (
    <Card title={t('form.detail')} hasMore={false}>
      <ThemeProvider theme={lightTheme}>
        <ScoreToMoneyForm themeStyle="light" />
      </ThemeProvider>
    </Card>
  )
}
