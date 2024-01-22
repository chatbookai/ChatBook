// ** React Import
import { useEffect } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

import { getChatBookLanguage, setChatBookLanguage } from 'src/functions/ChatBook'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()

  // ** Vars
  const { layout } = settings

  const handleLangItemClick = (lang: 'en' | 'zh' | 'zh-TW' | 'Ru' | 'Fr' | 'De' | 'Sp' | 'Kr' ) => {
    i18n.changeLanguage(lang)
    setChatBookLanguage(lang)
  }

  // ** Change html `lang` attribute when changing locale
  useEffect(() => {
    const localLanguage = getChatBookLanguage()
    if(localLanguage!=i18n.language && localLanguage!='') {
      i18n.changeLanguage(localLanguage)
      setChatBookLanguage(localLanguage)
    }
    document.documentElement.setAttribute('lang', i18n.language)
  }, [i18n.language])

  return (
    <OptionsMenu
      icon={<Icon icon='mdi:translate' />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4, minWidth: 130 } } }}
      iconButtonProps={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) } }}
      options={[
        {
          text: 'English',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'en',
            onClick: () => {
              handleLangItemClick('en')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'Korean',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'Kr',
            onClick: () => {
              handleLangItemClick('Kr')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'French',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'Fr',
            onClick: () => {
              handleLangItemClick('Fr')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'German',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'De',
            onClick: () => {
              handleLangItemClick('De')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'Spanish',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'Sp',
            onClick: () => {
              handleLangItemClick('Sp')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'Russia',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'Ru',
            onClick: () => {
              handleLangItemClick('Ru')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: '简体中文',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'zh',
            onClick: () => {
              handleLangItemClick('zh')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: '繁體中文',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'zh-TW',
            onClick: () => {
              handleLangItemClick('zh-TW')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        }
      ]}
    />
  )
}

export default LanguageDropdown
