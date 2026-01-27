// Mock data for Unisphere

export const universities = [
  {
    id: "1",
    name: "University of Punjab",
    city: "Lahore",
    type: "Public",
    logo: "🎓",
    rating: 4.5,
    students: 35000,
    programs: 120,
    description: "The University of the Punjab, also referred to as Punjab University, is a public research university located in Lahore, Punjab, Pakistan.",
    minPercentage: 60,
    website: "https://pu.edu.pk",
    established: 1882
  },
  {
    id: "2",
    name: "LUMS",
    city: "Lahore",
    type: "Private",
    logo: "🏛️",
    rating: 4.8,
    students: 5000,
    programs: 45,
    description: "Lahore University of Management Sciences is a private research university located in Lahore, Punjab, Pakistan.",
    minPercentage: 85,
    website: "https://lums.edu.pk",
    established: 1984
  },
  {
    id: "3",
    name: "University of Sialkot",
    city: "Sialkot",
    type: "Private",
    logo: "📚",
    rating: 4.2,
    students: 8000,
    programs: 65,
    description: "University of Sialkot (USKT) is a private university located in Sialkot, Punjab, Pakistan.",
    minPercentage: 55,
    website: "https://uskt.edu.pk",
    established: 2016
  },
  {
    id: "4",
    name: "University of Engineering and Technology",
    city: "Lahore",
    type: "Public",
    logo: "⚙️",
    rating: 4.6,
    students: 15000,
    programs: 48,
    description: "University of Engineering and Technology, Lahore is a public university located in Lahore, Punjab, Pakistan specializing in science, technology, engineering, and mathematics subjects.",
    minPercentage: 70,
    website: "https://uet.edu.pk",
    established: 1921
  },
  {
    id: "5",
    name: "Government College University",
    city: "Lahore",
    type: "Public",
    logo: "🏫",
    rating: 4.4,
    students: 12000,
    programs: 75,
    description: "Government College University is a public research university in Lahore, Punjab, Pakistan.",
    minPercentage: 65,
    website: "https://gcu.edu.pk",
    established: 1864
  },
  {
    id: "6",
    name: "University of Gujrat",
    city: "Gujrat",
    type: "Public",
    logo: "🎯",
    rating: 4.0,
    students: 10000,
    programs: 55,
    description: "The University of Gujrat is a public university located in Gujrat, Punjab, Pakistan.",
    minPercentage: 55,
    website: "https://uog.edu.pk",
    established: 2004
  },
];

export const scholarships = [
  {
    id: "1",
    title: "Merit Scholarship 2025",
    universityId: "1",
    universityName: "University of Punjab",
    amount: "100% Tuition Fee",
    deadline: "2025-12-31",
    eligibility: "Minimum 85% marks in intermediate",
    type: "Merit Based",
    description: "Full tuition fee waiver for outstanding students with exceptional academic records."
  },
  {
    id: "2",
    title: "Need-Based Financial Aid",
    universityId: "2",
    universityName: "LUMS",
    amount: "50-100% Fee Coverage",
    deadline: "2025-11-30",
    eligibility: "Household income less than PKR 500,000",
    type: "Need Based",
    description: "Financial assistance for deserving students from low-income families."
  },
  {
    id: "3",
    title: "Sports Excellence Scholarship",
    universityId: "3",
    universityName: "University of Sialkot",
    amount: "50% Tuition Fee",
    deadline: "2026-01-15",
    eligibility: "National or provincial level sports achievement",
    type: "Sports",
    description: "Scholarship for students with outstanding sports achievements."
  },
  {
    id: "4",
    title: "Engineering Excellence Award",
    universityId: "4",
    universityName: "UET Lahore",
    amount: "75% Tuition Fee",
    deadline: "2025-12-20",
    eligibility: "Minimum 80% in FSc Pre-Engineering",
    type: "Merit Based",
    description: "Special scholarship for high-achieving engineering students."
  },
];

export const events = [
  {
    id: "1",
    title: "Open House 2025",
    universityId: "1",
    universityName: "University of Punjab",
    date: "2025-12-15",
    type: "Campus Tour",
    location: "Main Campus, Lahore",
    description: "Visit our campus, meet faculty, and explore facilities. Learn about admission requirements and campus life."
  },
  {
    id: "2",
    title: "Admission Information Session",
    universityId: "2",
    universityName: "LUMS",
    date: "2025-12-10",
    type: "Information Session",
    location: "LUMS Main Campus",
    description: "Join us to learn about LUMS programs, admission process, and financial aid opportunities."
  },
  {
    id: "3",
    title: "Engineering Expo 2025",
    universityId: "4",
    universityName: "UET Lahore",
    date: "2026-01-20",
    type: "Exhibition",
    location: "Engineering Department",
    description: "Annual exhibition showcasing student projects and innovations in engineering."
  },
];

export const newsItems = [
  {
    id: "1",
    title: "New Computer Science Building Inaugurated",
    universityId: "3",
    universityName: "University of Sialkot",
    date: "2025-11-15",
    category: "Infrastructure",
    image: "🏢",
    excerpt: "State-of-the-art computer science facility with modern labs and equipment opens for students.",
    content: "The University of Sialkot has inaugurated a new Computer Science building equipped with the latest technology and facilities."
  },
  {
    id: "2",
    title: "LUMS Ranked Among Top Asian Universities",
    universityId: "2",
    universityName: "LUMS",
    date: "2025-11-18",
    category: "Achievement",
    image: "🏆",
    excerpt: "LUMS secures position in top 100 Asian universities in latest QS ranking.",
    content: "Lahore University of Management Sciences has been recognized among the top universities in Asia."
  },
  {
    id: "3",
    title: "Spring 2026 Admissions Now Open",
    universityId: "1",
    universityName: "University of Punjab",
    date: "2025-11-20",
    category: "Admissions",
    image: "📝",
    excerpt: "Applications are now being accepted for Spring 2026 semester across all programs.",
    content: "The University of Punjab has opened admissions for the Spring 2026 semester with various undergraduate and graduate programs."
  },
];

export const programs = [
  {
    id: "1",
    name: "Computer Science",
    degree: "BS",
    duration: "4 Years",
    fee: "PKR 200,000/year",
    seats: 120,
    minPercentage: 60
  },
  {
    id: "2",
    name: "Business Administration",
    degree: "BBA",
    duration: "4 Years",
    fee: "PKR 180,000/year",
    seats: 100,
    minPercentage: 55
  },
  {
    id: "3",
    name: "Electrical Engineering",
    degree: "BE",
    duration: "4 Years",
    fee: "PKR 220,000/year",
    seats: 80,
    minPercentage: 70
  },
  {
    id: "4",
    name: "Data Science",
    degree: "BS",
    duration: "4 Years",
    fee: "PKR 210,000/year",
    seats: 60,
    minPercentage: 65
  },
];
