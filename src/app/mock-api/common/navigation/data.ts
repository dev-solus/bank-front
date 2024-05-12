/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [

    {
        id: 'User',
        title: 'Utilisateur',
        subtitle: 'Gestion des utilisateurs',
        icon: 'heroicons_outline:cog',
        type: 'basic',
        link: '/admin/user',
    },
    {
        id: 'account',
        title: 'Compte bancaire',
        subtitle: 'Gestion des comptes bancaires',
        icon: 'heroicons_outline:cog',
        type: 'basic',
        link: '/admin/account',
    },

    {
        id: 'settings',
        title: 'Settings',
        type: 'collapsable',
        icon: 'heroicons_outline:cog',
        subtitle: 'Admin Paramètres',
        // link: '',
        children: [
            {
                id: 'Role',
                title: 'Role',
                type: 'basic',
                link: '/admin/role',
            },
        ]
    },



];
export const compactNavigation: FuseNavigationItem[] = [...defaultNavigation];
export const futuristicNavigation: FuseNavigationItem[] = [...defaultNavigation];
export const horizontalNavigation: FuseNavigationItem[] = [
    // {
    //     id: 'example',
    //     title: 'Profil',
    //     type: 'basic',
    //     icon: 'heroicons_outline:chart-pie',
    //     link: '/example'
    // },
];
