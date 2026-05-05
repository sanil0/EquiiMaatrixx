import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateContactDto {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

export interface ContactResponseDto {
  contactId: number;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  createdDate: string;
  isRead: boolean;
  response?: string;
  responseDate?: string;
}

export interface ContactSubmitResponse {
  success: boolean;
  message: string;
  contactId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = 'https://localhost:7132/api/contact';

  constructor(private http: HttpClient) { }

  submitContact(contact: CreateContactDto): Observable<ContactSubmitResponse> {
    return this.http.post<ContactSubmitResponse>(`${this.baseUrl}/submit`, contact);
  }

  getAllContacts(): Observable<ContactResponseDto[]> {
    return this.http.get<ContactResponseDto[]>(`${this.baseUrl}/list`);
  }

  markContactAsRead(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/${id}/mark-read`, {});
  }

  respondToContact(id: number, response: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/${id}/respond`, { response });
  }

  deleteContact(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
