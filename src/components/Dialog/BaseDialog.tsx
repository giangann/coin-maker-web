import { AppBar, Box, Button, Dialog, DialogProps, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

type BaseDialogProps = {
  open: boolean
  handleClose: () => void
  title?: string
  handleSubmit?: any
  submitAction?: string
  defaultAction?: boolean
} & DialogProps
export const BaseDialog: React.FC<BaseDialogProps> = ({
  title,
  open,
  handleClose,
  handleSubmit,
  submitAction,
  defaultAction = true,
  children,
  ...props
}: BaseDialogProps) => {
  const defaultSubmit = () => {
    toast.success('Submit')
    handleClose()
  }
  const { t } = useTranslation()
  return (
    <Dialog maxWidth="md" open={open} onClose={handleClose} {...props}>
      <AppBar position="relative" sx={{ padding: 2 }}>
        <Typography>{title ? title : t('title')}</Typography>
      </AppBar>
      <Box sx={{ padding: 2 }}>
        {children}

        {defaultAction ? (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} variant="outlined">
              {t('cancel')}
            </Button>
            <Button sx={{ ml: 1 }} onClick={handleSubmit || defaultSubmit} variant="contained">
              {submitAction || t('submit')}
            </Button>
          </Box>
        ) : undefined}
      </Box>
    </Dialog>
  )
}
