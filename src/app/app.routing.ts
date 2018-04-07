import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      // {
      //   path: 'claims',
      //   loadChildren: './views/claims/claims.module#ClaimsModule'
      // },
      {
        path: 'historical',
        // C:\Users\U1118608\Desktop\Angular5_CLI_Starter\src\app\views\claims\claims\claims.module.ts
        loadChildren: './views/historical/historical.module#HistoricalModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
