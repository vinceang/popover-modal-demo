export interface Person {
  id: number;
  name: string;
  role: string;
  email: string;
  department: string;
  location: string;
  bio: string;
}

export const PEOPLE: Person[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Frontend Engineer',
    email: 'alice@example.com',
    department: 'Engineering',
    location: 'San Francisco, CA',
    bio: 'Specializes in Angular and React. 8 years of experience building scalable web applications.',
  },
  {
    id: 2,
    name: 'Bob Martinez',
    role: 'Product Manager',
    email: 'bob@example.com',
    department: 'Product',
    location: 'New York, NY',
    bio: 'Led product strategy for three successful SaaS launches. Passionate about user-centered design.',
  },
  {
    id: 3,
    name: 'Carol Nguyen',
    role: 'UX Designer',
    email: 'carol@example.com',
    department: 'Design',
    location: 'Austin, TX',
    bio: 'Design systems expert. Previously at Google and Figma. Advocates for accessibility-first design.',
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Backend Engineer',
    email: 'david@example.com',
    department: 'Engineering',
    location: 'Seattle, WA',
    bio: 'Distributed systems specialist. Built microservices handling 10M+ requests/day.',
  },
  {
    id: 5,
    name: 'Elena Petrova',
    role: 'Data Scientist',
    email: 'elena@example.com',
    department: 'Data',
    location: 'Chicago, IL',
    bio: 'ML researcher turned applied scientist. Published 12 papers on NLP and recommendation systems.',
  },
];
