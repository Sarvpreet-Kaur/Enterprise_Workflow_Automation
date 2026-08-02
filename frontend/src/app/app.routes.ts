import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { UserList } from './features/user-management/user-list/user-list';
import { WorkflowList } from './features/workflows/workflow-list/workflow-list';
import { RequestList } from './features/requests/request-list/request-list';
import { NotFound } from './shared/not-found/not-found';
import { authGuard } from './core/guards/auth-guard';
import { Layout } from './layouts/layout/layout';
import { TeamList } from './features/teams/team-list/team-list';
import { ApprovalList } from './features/approvals/approval-list/approval-list';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full', },
    { path: 'login', component: Login, },
    { path: '', component: Layout, canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
            { path: 'users', component: UserList , canActivate: [authGuard]},
            { path: 'workflows', component: WorkflowList,canActivate: [authGuard]},
            { path: 'requests', component: RequestList, canActivate: [authGuard]},
            { path: 'approvals', component: ApprovalList,canActivate: [authGuard]},
            { path: 'teams', component: TeamList,  canActivate: [authGuard]},
        ],
    },
    { path: '**',component: NotFound },
];
