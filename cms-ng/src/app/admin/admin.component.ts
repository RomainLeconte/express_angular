import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Blogpost } from "../models/blogpost";
import { BlogpostService } from "../blogpost.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  //blogPostList$: Observable<Blogpost[]>;
  allPosts: Blogpost[];
  errorFromServer = "";

  constructor(
    private blogpostService: BlogpostService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(["/auth"]);
    }
    this.blogpostService.getBlogPosts().subscribe(data => this.refresh(data));
    this.blogpostService.handelPostCreated().subscribe(data => {
      console.log("admin => ", data);
      this.refresh(data);
    });
  }
  deletePosts(selected) {
    const id = selected.map(s => s.value);
    if (id.length === 1) {
      this.blogpostService
        .deleteBlogPostId(id[0])
        .subscribe(data => this.refresh(data), err => this.handleError(err));
    } else {
      return this.blogpostService
        .deleteBlogPosts(id)
        .subscribe(data => this.refresh(data), err => this.handleError(err));
    }
  }
  refresh(data) {
    console.log("data ", data);
    this.blogpostService.getBlogPosts().subscribe(data => {
      this.allPosts = data;
    });
  }
  handleError(err) {
    this.errorFromServer = `Error ${err.status} - ${err.statusText}`;
    console.log(err);
  }

  logout() {
    this.authService.logout().subscribe(
      data => {
        console.log(data);
        this.router.navigate(["/auth"]);
      },
      err => console.log(err)
    );
  }
}
