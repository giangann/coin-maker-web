import { Box, Stack, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs'
import { toast } from 'react-toastify'

import { Button } from '@/components/Button'
import { InforUser } from '@/components/Interaction'
import { TAG_POST } from '@/constants'
import { useAuth } from '@/libs/hooks'
import { queryClient } from '@/libs/react-query'
import { request } from '@/libs/request'
import { LoginDialog } from '@/screens/auth'
import {
  backgroundColor,
  BoxFlexCenter,
  BoxFlexCenterSpaceBetween,
  text as textColor,
} from '@/styles'

interface IPostForm {
  coin_id: string
}

export const PostForm: React.FC<IPostForm> = ({ coin_id }) => {
  const { userStorage, userAvatar } = useAuth()
  const { t } = useTranslation()
  const [text, setText] = useState<string>('')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [tagPost, setTagPost] = useState<number>(TAG_POST['UNSET'])

  const handleTextChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setText(e.target.value)
  }

  const handleSubmit = async () => {
    if (!userStorage) {
      handleOpenDialog()
      return
    }

    if (text.trim().length === 0) {
      toast.error(t('Please enter your post'))
      return
    }

    try {
      const res = await request.post('/post', {
        coin_id,
        content: text,
        image: 'no image',
        tag: tagPost === TAG_POST['UNSET'] ? null : tagPost,
      })

      if (res.status === 200) {
        toast.success('success')
        setText('')
        setTagPost(TAG_POST['UNSET'])
        queryClient.fetchQuery([`post/get-by-coin-id/${coin_id}?user_id=${userStorage?.id}`], {
          staleTime: 2000,
        })
      }
    } catch (error) {
      toast.error(error as string)
    }
  }

  const hanleEditTag = (tag: number) => {
    setTagPost(tag)
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
      <Stack
        sx={{ backgroundColor: backgroundColor['post'], padding: '20px', borderRadius: '8px' }}
      >
        <BoxFlexCenterSpaceBetween>
          <InforUser user_name={userStorage?.name || ''} user_avatar={userAvatar || ''} />
          <BoxFlexCenter gap="12px">
            <Button
              startIcon={<BsCaretUpFill size="14px" />}
              variant={tagPost === TAG_POST['BULLISH'] ? 'contained' : 'outlined'}
              size="small"
              color="success"
              sx={{ textTransform: 'capitalize' }}
              onClick={() =>
                hanleEditTag(
                  tagPost === TAG_POST['BULLISH'] ? TAG_POST['UNSET'] : TAG_POST['BULLISH'],
                )
              }
            >
              {t('bullish')}
            </Button>
            <Button
              startIcon={<BsCaretDownFill size="14px" />}
              variant={tagPost === TAG_POST['BEARISH'] ? 'contained' : 'outlined'}
              size="small"
              color="error"
              sx={{ textTransform: 'capitalize' }}
              onClick={() =>
                hanleEditTag(
                  tagPost === TAG_POST['BEARISH'] ? TAG_POST['UNSET'] : TAG_POST['BEARISH'],
                )
              }
            >
              {t('bearish')}
            </Button>
          </BoxFlexCenter>
        </BoxFlexCenterSpaceBetween>
        <input
          style={{
            padding: '20px',
            border: 'none',
            outline: 'none',
            borderRadius: '8px',
            marginTop: '16px',
            width: '100%',
            backgroundColor: '#323546',
            color: textColor['primary'],
          }}
          onChange={handleTextChange}
          value={text}
          placeholder="Write your review of Bitcoin"
        />
        <Box sx={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            sx={{ width: 'max-content', marginTop: '12px' }}
            onClick={handleSubmit}
            size={isMobile ? 'small' : 'medium'}
          >
            {t('post.name')}
          </Button>
        </Box>
      </Stack>

      <LoginDialog open={openLoginDialog} handleClose={handleCloseDialog} />
    </>
  )
}
