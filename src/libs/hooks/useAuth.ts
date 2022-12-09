import { useAtom } from 'jotai'

import { userAtomWithStorage, userProfileImage } from '../atoms/authAtom'
import { settingAtom } from '../atoms/settingAtom'

const useAuth = () => {
  const [userStorage] = useAtom(userAtomWithStorage)
  const [userAvatar] = useAtom(userProfileImage)
  const [setting] = useAtom(settingAtom)
  return { userStorage, userAvatar, setting }
}

export { useAuth }
