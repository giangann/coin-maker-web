import { Dialog, DialogContent, DialogTitle, Grid, styled, Typography } from '@mui/material'
import { gapi } from 'gapi-script'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import GoogleButton from 'react-google-button'
import { GoogleLogin } from 'react-google-login'
import { useTranslation } from 'react-i18next'

import { loginWithGG } from '@/libs/apis'
import { userAtomWithStorage, userProfileImage } from '@/libs/atoms/authAtom'
import { backgroundColor, WhiteTypograpy } from '@/styles'
type LoginDialogProps = {
  open: boolean
  handleClose: () => void
}
export const LoginDialog = ({ open, handleClose }: LoginDialogProps) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userStorage, setUserStorage] = useAtom(userAtomWithStorage)
  const [profileImage, setProfileImage] = useAtom(userProfileImage)
  const { t } = useTranslation()
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }
  const onSuccess = async (res: any) => {
    setProfileImage(res?.profileObj.imageUrl)
    const login = await loginWithGG('login-with-google', res?.profileObj).then((res) => {
      setUserStorage(res.data.data)
      localStorage.setItem('user-token', res.data.access_token)
    })

    handleClose()
    window.location.reload()
    // saveUserLocalStorage(res.profileObj)
  }

  // const setProfileObject = useMemo(
  //   () =>
  //     setUserStorage({
  //       ...userStorage,
  //       imageUrl: imageUrl,
  //     }),
  //   [imageUrl],
  // )

  // setProfileObject
  const onFailure = (err: any) => {}

  React.useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: '892961628161-ttu2f42daldnurgoednpa6fss17u0pr4.apps.googleusercontent.com',
        scope: '',
      })
    }
    gapi.load('client:auth2', initClient)
  })
  return (
    <Dialog open={open} onClose={handleClose}>
      <CustomDialogTitle>
        <WhiteTypograpy>{t('sign_in')} </WhiteTypograpy>
      </CustomDialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12} py={2}>
            <Typography sx={{ color: 'black' }}>{t('login.login_form_content')}</Typography>
          </Grid>
          <Grid item xs={6}>
            {/* <BootstrapButton sx={{ margin: 0 }}>
                <AlibabaText>
                </AlibabaText>
              </BootstrapButton> */}
            <GoogleLogin
              clientId="892961628161-ttu2f42daldnurgoednpa6fss17u0pr4.apps.googleusercontent.com"
              buttonText={t('login.sign_in_with_google')}
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
              // isSignedIn={true}
              render={(renderProps) => (
                <GoogleButton
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  style={{ width: '100%' }}
                >
                  {t('login.sign_in_with_google')}
                </GoogleButton>
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

const CustomDialogTitle = styled(DialogTitle)({
  backgroundColor: backgroundColor['primary'],
})
