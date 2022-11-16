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
        { label: 'Stats', icon: <Analytics /> },
        { label: 'Notifications', icon: <NotificationsNone /> }
      ]
    },
    {
      title: 'SERVICE',
      items: [
        { label: 'System Health', icon: <SettingsSystemDaydream /> },
        { label: 'Logs', icon: <PermDataSetting /> },
        { label: 'Settings', icon: <Settings /> }
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
