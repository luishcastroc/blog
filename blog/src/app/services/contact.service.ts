import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);

  /**
   * Sends contact form data to the server
   * @param formData The contact form data
   * @returns Observable of the HTTP request
   */
  sendContactEmail(formData: ContactFormData): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/send-email`, formData);
  }
}
