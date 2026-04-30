export interface Profile {
  id: string;
  name: string;
  gender: "male" | "female";
  gender_probability: number;
  country_name: string;
  age: number;
  age_group: string;
  country_id: string;
  country_probability: number;
  created_at: string;
}

export interface PaginatedResponse<T> {
  status: "success" | "error";
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  links: {
    self: string;
    next: string | null;
    prev: string | null;
  };
  data: T[];
}

export interface User {
  github_id: string;
  username: string;
  email: string;
  role: string;
}

export interface ProfileFilters {
  gender?: "male" | "female";
  age_group?: string;
  country_id?: string;
  min_age?: number;
  max_age?: number;
  min_gender_probability?: number;
  min_country_probability?: number;
  sort_by?: "age" | "created_at" | "gender_probability";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ApiError {
  status: "error";
  message: string;
}
