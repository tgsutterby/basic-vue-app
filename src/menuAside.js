import { mdiMonitor, mdiViewList, mdiLogout } from '@mdi/js'

export const menuAsideMain = [
  {
    to: '/',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    label: 'Dropdown',
    icon: mdiViewList,
    menu: [
      {
        label: 'Item One',
      },
      {
        label: 'Item Two',
      },
    ],
  },
]

export const menuAsideBottom = [
  {
    label: 'Logout',
    icon: mdiLogout,
    color: 'info',
    isLogout: true,
  },
]
