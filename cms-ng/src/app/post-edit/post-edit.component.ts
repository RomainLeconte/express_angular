import { Component, OnInit, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, FormGroupDirective } from "@angular/forms";
import { BlogpostService } from "../blogpost.service";
import { ActivatedRoute } from "@angular/router";
import { Blogpost } from "../models/blogpost";

@Component({
  selector: "app-post-edit",
  templateUrl: "./post-edit.component.html",
  styleUrls: ["./post-edit.component.css"]
})
export class PostEditComponent implements OnInit {
  editForm: FormGroup;
  postId: string;
  post: Blogpost;

  constructor(
    private formBuilder: FormBuilder,
    private blogposteService: BlogpostService,
    private element: ElementRef,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.postId = this.activateRoute.snapshot.paramMap.get("id");
    this.blogposteService.getBlogPostId(this.postId).subscribe(
      data => {
        this.post = data;
      },
      error => console.log(error.message)
    );
    this.createForm();
  }

  createForm() {
    this.editForm = this.formBuilder.group({
      title: "",
      subtitle: "",
      content: "",
      image: ""
    });
  }

  upload() {
    let inputElement: HTMLInputElement = this.element.nativeElement.querySelector('#image');
    let fileCount: number = inputElement.files.length;
    let formData = new FormData();
    if (fileCount > 0) {
      formData.append("image", inputElement.files.item(0));
      this.blogposteService.uploadImage(formData).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error.message);
        }
      );
    }
  }
  updatePost(formDirective: FormGroupDirective) {
    if (this.editForm.valid) {
      console.log("updatePost from post edit => ", this.editForm.value);
      this.blogposteService
        .updatePost(this.postId, this.editForm.value)
        .subscribe(
          data => this.handleSuccess(data, formDirective),
          error => this.handleError(error)
        );
    }
  }
  handleSuccess(data, formDirective) {
    console.log("ok => ", data, ' and => ', formDirective);
    this.editForm.reset();
    formDirective.resetForm();
    this.blogposteService.dispatchPostCreated(data._id);
  }

  handleError(error) {
    console.log("not ok => ", error.message);
  }
}
