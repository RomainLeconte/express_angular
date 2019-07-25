import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { MaterialModule } from "./material.module";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BlogpostComponent } from "./blogpost/blogpost.component";
import { BlogpostListComponent } from "./blogpost-list/blogpost-list.component";
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { AdminComponent } from './admin/admin.component';
import { PostCreateComponent } from './post-create/post-create.component';

@NgModule({
  declarations: [AppComponent, BlogpostComponent, BlogpostListComponent, ErrorpageComponent, AdminComponent, PostCreateComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
