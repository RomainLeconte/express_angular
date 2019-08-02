import { Injectable } from "@angular/core";
import { User } from "./models/user";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  baseURL = "http://localhost:3000/auth";
  constructor(private http: HttpClient) {}
  login(user: User) {
    return this.http.post<User>(`${this.baseURL}/login`, user);
  }
}
