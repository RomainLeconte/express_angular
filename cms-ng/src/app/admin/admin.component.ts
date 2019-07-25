import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Blogpost } from "../models/blogpost";
import { BlogpostService } from "../blogpost.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  //blogPostList$: Observable<Blogpost[]>;
  allPosts: Blogpost[];

  constructor(private blogpostService: BlogpostService) {}

  ngOnInit() {
    //this.blogPostList$ = this.blogpostService.getBlogPosts();
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
    console.log(err);
  }
}
