import { atom } from 'jotai'

import { SettingType } from '../types/setting'

const settingAtom = atom<SettingType | null>(null)

export { settingAtom }
