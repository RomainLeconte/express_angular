import { Component, OnInit } from "@angular/core";
import { User } from "../models/user";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"]
})
export class AuthComponent implements OnInit {
  user: User = { username: "", password: "" };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  login() {
    console.log("user", this.user);
    this.authService
      .login(this.user)
      .subscribe(
        data => this.handleSuccess(data),
        err => this.handleError(err)
      );
  }
  handleSuccess(data) {
    console.log("data log : ", data);
    this.router.navigate(["/admin"]);
  }

  handleError(err) {
    console.log("err => ", err.message);
  }
}
