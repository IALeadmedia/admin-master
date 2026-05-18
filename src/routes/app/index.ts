import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../../pages/home/home'
import { appSetting } from '../../constants/app-setting/config.const'

export const Route = createFileRoute('/app/')({
  component: HomePage,
  head: () => ({
    meta: [{ title: `Home - ${appSetting.name}` }],
  }),
})