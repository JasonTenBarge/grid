import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridComponent } from './grid/grid.component';
import { GridTesterComponent } from './grid-tester/grid-tester.component';

const routes: Routes = [
  { path: 'grid', component: GridComponent },
  { path: '', component: GridTesterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
