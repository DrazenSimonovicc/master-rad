export interface FacultyItemType {
  address: string;
  city: string;
  faculty_name: string;
  postal_code: number;
  university_name: string;
}

export interface PersonalItemType {
  first_name: string;
  last_name: string;
  index_number: string;
  title: string;
}

export interface FooterItemType {
  subject: string;
  theme: string;
  expand: {
    faculty: FacultyItemType;
    personal: PersonalItemType;
  };
}
