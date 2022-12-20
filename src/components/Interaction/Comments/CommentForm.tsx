import { Box, Stack } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button } from '@/components/Button'
import { ButtonCustomDisableColor } from '@/components/Form'
import { useAuth } from '@/libs/hooks'
import { queryClient } from '@/libs/react-query'
import { request } from '@/libs/request'
import { LoginDialog } from '@/screens/auth'
import { text as textColor } from '@/styles'
interface ICommentForm {
  post_id: number | string
  coin_id: number | string
  user_name: string
}

export const CommentForm: React.FC<ICommentForm> = ({ post_id, coin_id, user_name }) => {
  const [text, setText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const isTextareaDisabled = text.length === 0
  const { t } = useTranslation()

  const { userStorage } = useAuth()

  const handleTextChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setText(e.target.value)
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()

    if (!userStorage) {
      handleOpenDialog()
      return
    }

    if (isTextareaDisabled) {
      toast.error('Please enter content')
      return
    }

    try {
      setIsLoading(true)
      const res = await request.post('/comment', {
        content: text,
        post_id,
      })
      setIsLoading(false)

      if (res.status === 200) {
        toast.success('success')
        queryClient.fetchQuery([`comment/get-by-post-id/${post_id}`], { staleTime: 2000 })
        queryClient.fetchQuery([`post/get-by-coin-id/${coin_id}?user_id=${userStorage?.id}`], {
          staleTime: 2000,
        })
        setText('')
      }
    } catch (error) {
      toast.error(error as string)
    }
  }

  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false)

  const handleCloseDialog = () => {
    setOpenLoginDialog(false)
  }

  const handleOpenDialog = () => {
    setOpenLoginDialog(true)
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          position: 'relative',
          padding: '8px',
          backgroundColor: '#323546',
          marginTop: '16px',
          borderRadius: '8px',
          minHeight: '72px',
        }}
      >
        <input
          style={{
            padding: '8px',
            border: 'none',
            outline: 'none',
            width: '100%',
            color: textColor['primary'],
            backgroundColor: 'inherit',
          }}
          type="text"
          onChange={handleTextChange}
          value={text}
          placeholder={`@${user_name}`}
        />
        <Stack
          direction="row"
          gap="12px"
          sx={{ position: 'absolute', bottom: '8px', right: '8px', zIndex: 9 }}
        >
          <Button
            variant="contained"
            sx={{ fontSize: '10px', textTransform: 'capitalize', cursor: 'pointer', color: '#fff' }}
            size="small"
          >
            {t('cancel')}
          </Button>
          <ButtonCustomDisableColor
            variant="contained"
            type="submit"
            sx={{ fontSize: '10px', textTransform: 'capitalize', cursor: 'pointer' }}
            size="small"
          >
            {isLoading ? <CircularProgress size={17.5} /> : t('reply')}
          </ButtonCustomDisableColor>
        </Stack>
      </Box>
      <LoginDialog open={openLoginDialog} handleClose={handleCloseDialog} />
    </>
  )
}
