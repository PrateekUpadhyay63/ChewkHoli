import { CoreMenu } from '@core/types'

// export const menu: CoreMenu[] = [
//   {
//     id: 1,
//     title: 'Dashboard',
//     translate: 'MENU.DASHBOARD',
//     type: 'item',
//     icon: 'grid',
//     url: 'dashboard'
//   },
//   {
//     id: 2,
//     title: 'User Management',
//     translate: 'MENU.USERMANAGEMENT',
//     type: 'item',
//     icon: 'user',
//     url: 'user-management'
//   },
//   {
//     id: 3,
//     title: 'Group Management',
//     translate: 'MENU.GROUPMANAGEMENT',
//     type: 'item',
//     icon: 'users',
//     url: 'group-management'
//   },
// {
//   id: 4,
//   title: 'System & Server',
//   translate: 'MENU.SYSTEMSERVER',
//   type: 'item',
//   icon: 'server',
//   url: 'system-server'
// },

//   {
//     id: 5,
//     title: 'Vehicles',
//     translate: 'MENU.VEHICLEMANAGEMENT',
//     type: 'item',
//     icon: 'truck',
//     url: 'device-management/vehicles'
//   },  
//   {
//     id: 6,
//     title: 'Camera',
//     translate: 'MENU.CAMERA',
//     type: 'item',
//     icon: 'video',
//     url: 'device-management/camera'
//   },
//   {
//     id: 7,
//     title: 'Color',
//     translate: 'MENU.CONTENTMANAGEMENT',
//     type: 'item',
//     icon: 'database',
//     url: 'content-management'
//   },
//   {
//     id: 8,
//     title: 'Location Management',
//     translate: 'MENU.LOCATIONMANAGEMENT',
//     type: 'item',
//     icon: 'map',
//     url: 'location-management'
//   },
//   {
//     id: 9,
//     title: 'Stream',
//     translate: 'MENU.STREAM',
//     type: 'item',
//     icon: 'video',
//     url: 'stream'
//   },
//   {
//     id: 10,
//     title: 'Settings',
//     translate: 'MENU.SETTING',
//     type: 'item',
//     icon: 'settings',
//     url: 'settings'
//   },
//   {
//     id: 11,
//     title: 'Roles & Permission Management',
//     translate: 'MENU.ROLESPERMISSIONMANAGEMENT',
//     type: 'item',
//     icon: 'lock',
//     url: 'roles-permission-management'
//   },
//   {
//     id: 12,
//     title: 'Integrated Organizations',
//     translate: 'MENU.INTEGRATEDORGNIZATIONS',
//     type: 'item',
//     icon: 'globe',
//     url: 'organizations'
//   },
//   {
//     id: 13,
//     title: 'Transfer Authority',
//     translate: 'MENU.TRANSFERAUTHORITY',
//     type: 'item',
//     icon: 'repeat',
//     url: 'transfer-authority'
//   },


// ]




export const menu: CoreMenu[] = [
  // Dashboard
  {
    id: 1,
    title: 'Dashboard',
    translate: 'MENU.DASHBOARD',
    type: 'item',
    icon: 'grid',
    url: 'dashboard'
  },
  {
    id: 2,
    title: 'Management',
    translate: 'MENU.MANAGEMENT',
    type: 'section',
    icon: 'grid',
    // url: 'dashboard',
    // badge: {
    //   title: '2',
    //   translate: 'MENU.DASHBOARD.BADGE',
    //   classes: 'badge-light-warning badge-pill',
    // },
    children: [
      {
        id: 3,
        title: 'Users',
        translate: 'MENU.USERMANAGEMENT',
        type: 'item',
        icon: 'user',
        url: 'user-management'
      },
      {
        // If role is not assigned will be display to all
        id: 4,
        title: 'Groups',
        translate: 'MENU.GROUPMANAGEMENT',
        type: 'item',
        icon: 'users',
        url: 'group-management'
      },

      // {
      //   id: 7,
      //   title: 'Location',
      //   translate: 'MENU.LOCATIONMANAGEMENT',
      //   type: 'item',
      //   icon: 'map',
      //   url: 'location-management'
      // },
    ]
  },

  {
    id: 5,
    title: 'Devices',
    translate: 'MENU.DEVICES',
    type: 'section',
    icon: 'grid',

    children: [
      {
        id: 6,
        title: 'Vehicle',
        translate: 'MENU.VEHICLEMANAGEMENT',
        type: 'item',
        icon: 'truck',
        url: 'device-management/vehicles'
      },

      {
        id: 7,
        title: 'IP Camera',
        translate: 'MENU.CAMERA',
        type: 'item',
        icon: 'camera',
        url: 'device-management/camera'

      }

    ]
  },

  {
    id: 8,
    title: 'Contents',
    translate: 'MENU.CONTENTS',
    type: 'section',
    icon: 'grid',

    children: [
      {
        id: 9,
        title: 'Location',
        translate: 'MENU.LOCATIONMANAGEMENT',
        type: 'item',
        icon: 'map-pin',
        url: 'location-management'
      },

      {
        id: 10,
        title: 'Stream',
        translate: 'MENU.STREAM',
        type: 'item',
        icon: 'video',
        url: 'stream'
      },

    ]
  },

  {
    id: 11,
    title: 'Settings',
    translate: 'MENU.PERMISSIONS',
    type: 'section',
    icon: 'grid',

    children: [
      {
        id: 12,
        title: 'Notifications',
        translate: 'MENU.NOTIFICATION',
        type: 'item',
        icon: 'alert-triangle',
        url: 'notifications'
      },
      {
        id: 13,
        title: 'Roles & Permission',
        translate: 'MENU.ROLESPERMISSIONMANAGEMENT',
        type: 'item',
        icon: 'shield',
        url: 'roles-permission-management'
      },
      {
        id: 14,
        title: 'Organizations',
        translate: 'MENU.INTEGRATEDORGNIZATIONS',
        type: 'item',
        icon: 'globe',
        url: 'organizations'
      },
      {
        id: 15,
        title: 'System & Server',
        translate: 'MENU.SYSTEMSERVER',
        type: 'item',
        icon: 'server',
        url: 'system-server'
      },
      {
        id: 16,
        title: 'Transfer Authority',
        translate: 'MENU.TRANSFERAUTHORITY',
        type: 'item',
        icon: 'repeat',
        url: 'transfer-authority'
      },
      {
        id: 17,
        title: 'Theme',
        translate: 'MENU.CONTENTMANAGEMENT',
        type: 'item',
        icon: 'droplet',
        url: 'Color'
      },
      {
        id: 18,
        title: 'Profile',
        translate: 'MENU.SETTING',
        type: 'item',
        icon: 'user',
        url: 'settings'
      },
      {
        id:19,
        title: 'Mobile App',
        translate: 'MENU.APPMANAGEMENT',
        type: 'item',
        icon: 'smartphone',
        url: 'app'
      }
    ]
  }]