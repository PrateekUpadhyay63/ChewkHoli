import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferAuthorityComponent } from './transfer-authority/transfer-authority.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'transfer-authority',
    pathMatch: 'full'
  },
  {
    path: 'transfer-authority',
    component: TransferAuthorityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferAuthorityRoutingModule { }
