
export interface DataUser {
  userId: number;
  profileId: number;
  name: string;
  lastName: string;
  email: string;
  username: string;
  profile: string;
  state: string;
  stateId: number;
}

export interface UserForm {
  profileId: number | null;
  name: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  stateId: number;
}  

export interface UsersFilters {
  name: string;
  lastName: string;
  email: string;
  profile: number | null;
  state: number | null
}