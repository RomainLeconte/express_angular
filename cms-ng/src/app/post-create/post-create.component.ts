import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormGroupDirective } from "@angular/forms";
import { BlogpostService } from "../blogpost.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  creationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private blogposteService: BlogpostService
  ) {}

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.creationForm = this.formBuilder.group({
      title: "",
      subtitle: "",
      content: ""
    });
  }

  creatPost(formDirective: FormGroupDirective) {
    if (this.creationForm.valid) {
      console.log(this.creationForm);
      this.blogposteService
        .creatPost(this.creationForm.value)
        .subscribe(
          data => this.handleSuccess(data, formDirective),
          error => this.handleError(error)
        );
    }
  }

  handleSuccess(data, formDirective) {
    console.log("post create", data);
    this.creationForm.reset();
    formDirective.resetForm();
    this.blogposteService.dispatchPostCreated(data._id);
  }

  handleError(error) {
    console.log(`post can be create : ${error.message}`);
  }
}
