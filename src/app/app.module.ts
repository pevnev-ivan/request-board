import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './shared/components/header/header.component';
import { CardListComponent } from './shared/components/card-list/card-list.component';
import { CardComponent } from './shared/components/card/card.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AppComponent } from './app.component';
import { SearchboxComponent } from './shared/components/searchbox/searchbox.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AddTaskComponent } from './shared/components/add-task/add-task.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import '@angular/common/locales/global/ru';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GravatarModule } from 'ngx-gravatar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AddUserComponent } from './shared/components/add-user/add-user.component';
import { FilterTaskByNamePipe } from './pipes/filter-task-by-name.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EditTaskComponent } from './shared/components/edit-task/edit-task.component';
import { FilterTaskByPriorityPipe } from './pipes/filter-task-by-priority.pipe';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainPageComponent,
    CardComponent,
    CardListComponent,
    HeaderComponent,
    SearchboxComponent,
    SidebarComponent,
    NotFoundComponent,
    AddTaskComponent,
    AddUserComponent,
    FilterTaskByNamePipe,
    EditTaskComponent,
    FilterTaskByPriorityPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    GravatarModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
