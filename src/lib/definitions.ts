export interface SessionPayload {
  username: string
  [key: string]: unknown // Allow additional properties
}