import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { Blogpost } from "./models/blogpost";
@Injectable({
  providedIn: "root"
})
export class BlogpostService {
  baseUrl: string = "http://localhost:3000/api/v1/blog-posts";

  private postCreated = new Subject<string>();

  constructor(private httpClient: HttpClient) {}

  creatPost(newPost: Blogpost) {
    return this.httpClient.post<Blogpost>(this.baseUrl, newPost);
  }

  uploadImage(formData: FormData) {
    return this.httpClient.post<any>(`${this.baseUrl}/images`, formData);
  }

  dispatchPostCreated(id: string) {
    this.postCreated.next(id);
  }

  handelPostCreated() {
    return this.postCreated.asObservable();
  }

  getBlogPosts(): Observable<Blogpost[]> {
    return this.httpClient.get<Blogpost[]>(`${this.baseUrl}/`);
  }

  getBlogPostId(id: string): Observable<Blogpost> {
    return this.httpClient.get<Blogpost>(`${this.baseUrl}/${id}`);
  }

  deleteBlogPostId(id: string): Observable<Blogpost> {
    return this.httpClient.delete<Blogpost>(`${this.baseUrl}/${id}`);
  }
  deleteBlogPosts(id: string[]) {
    const allIds = id.join(",");
    return this.httpClient.delete(`${this.baseUrl}/?ids=${allIds}`);
  }
}
