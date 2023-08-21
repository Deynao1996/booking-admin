import {
  PermIdentity,
  Dashboard as DashboardIcon,
  PeopleOutline,
  StoreMallDirectory,
  CreditCard,
  Analytics,
  NotificationsNone,
  SettingsSystemDaydream,
  PermDataSetting,
  Settings,
  Logout,
  Chair
} from '@mui/icons-material'

export const getSideData = (userId) => {
  return [
    {
      title: 'MAIN',
      items: [{ label: 'Dashboard', icon: <DashboardIcon />, to: '/' }]
    },
    {
      title: 'LISTS',
      items: [
        { label: 'Users', icon: <PeopleOutline />, to: 'table' },
        { label: 'Hotels', icon: <StoreMallDirectory />, to: 'table' },
        { label: 'Orders', icon: <CreditCard />, to: 'table' },
        { label: 'Rooms', icon: <Chair />, to: 'table' }
      ]
    },
    {
      title: 'USEFUL',
      items: [
        { label: 'Stats', icon: <Analytics />, disabled: true },
        { label: 'Notifications', icon: <NotificationsNone />, disabled: true }
      ]
    },
    {
      title: 'SERVICE',
      items: [
        {
          label: 'System Health',
          icon: <SettingsSystemDaydream />,
          disabled: true
        },
        { label: 'Logs', icon: <PermDataSetting />, disabled: true },
        { label: 'Settings', icon: <Settings />, disabled: true }
      ]
    },
    {
      title: 'USER',
      items: [
        { label: 'Profile', icon: <PermIdentity />, to: `users/${userId}` },
        { label: 'Logout', icon: <Logout />, to: '/login' }
      ]
    }
  ]
}
