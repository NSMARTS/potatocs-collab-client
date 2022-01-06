// rounting info
import { NavigationItem } from '../interfaces/navigation-item.interface'
export const sidenavRouteInfo: NavigationItem[] = [

  // dashboard
  {
    type: 'link',
    label: 'Dashboard',
    route: '/main',
    icon: 'dashboard',
    isManager: false
  },

  // project
  {
    type: 'subheading',
    label: 'project',
    children: [
      {
        type: 'click',
        label: 'Create space',
        icon: 'create_new_folder'
      },
      {
        type: 'dropdown',
        label: 'Space',
        icon: 'library_books',
        isManager: false,
        children: [
          
        ]
      }
    ]
  },


  // Leave
  {
    type: 'subheading',
    label: 'Leave ',
    children: [
      {
        type: 'dropdown',
        label: 'Leave Management',
        icon: 'event_available',
        isManager: false,
        children: [
          {
            type: 'link',
            label: 'My Leave Status',
            route: '/leave/my-status',
            icon: 'update',
            isManager: false
          },
          {
            type: 'link',
            label: 'Request Leave',
            route: '/leave/request-leave-list',
            icon: 'update',
            isManager: false
          },
        ]
      },
      {
        type: 'dropdown',
        label: 'Employee Management',
        icon: 'groups',
        isManager: true,
        children: [  
          {
            type: 'link',
            label: 'Employee Leave Status',
            route: '/employee-mngmt/employee-leave-status',
            icon: 'update',
            isManager: true
          },
          {
            type: 'link',
            label: 'Employee List',
            route: '/employee-mngmt/employee-list',
            icon: 'update',
            isManager: true
          },
          {
            type: 'link',
            label: 'Employee Leave Request',
            route: '/approval-mngmt/pending-leave',
            icon: 'update',
            isManager: true
          },
          {
            type: 'link',
            label: 'Employee Register Request',
            route: '/employee-mngmt/pending-employee',
            icon: 'update',
            isManager: true
          },
        ]
      }
    ]
  },
];
