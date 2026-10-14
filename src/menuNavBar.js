import { mdiAccount, mdiCog, mdiEmail, mdiLogout, mdiThemeLightDark } from '@mdi/js'

export default [
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: 'My Profile',
        to: '/profile',
      },
      {
        icon: mdiEmail,
        label: 'Messages',
        to: '/messages',
      },
      {
        icon: mdiCog,
        label: 'Settings',
        to: '/settings',
      },
      {
        isDivider: true,
      },
      {
        icon: mdiThemeLightDark,
        label: 'Light/Dark',
        isToggleLightDark: true,
      },
      {
        icon: mdiLogout,
        label: 'Log Out',
        isLogout: true,
      },
    ],
  },
  {
    icon: mdiLogout,
    label: 'Log out',
    isDesktopNoLabel: true,
    isLogout: true,
  },
]
