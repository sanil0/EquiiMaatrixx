import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateFeedbackDto {
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  rating: number;
}

export interface FeedbackResponseDto {
  feedbackId: number;
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  rating: number;
  createdDate: string;
  isRead: boolean;
}

export interface FeedbackSubmitResponse {
  success: boolean;
  message: string;
  feedbackId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl = 'https://localhost:7132/api/feedback';

  constructor(private http: HttpClient) { }

  submitFeedback(feedback: CreateFeedbackDto): Observable<FeedbackSubmitResponse> {
    return this.http.post<FeedbackSubmitResponse>(`${this.baseUrl}/submit`, feedback);
  }

  getAllFeedback(): Observable<FeedbackResponseDto[]> {
    return this.http.get<FeedbackResponseDto[]>(`${this.baseUrl}/list`);
  }

  markFeedbackAsRead(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/${id}/mark-read`, {});
  }

  deleteFeedback(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
