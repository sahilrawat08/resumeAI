# Sample Data for ResumeAI Testing

## Sample Resume Text (TXT format)

```
John Doe
Software Engineer
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of experience in full-stack development. 
Proficient in React, Node.js, and MongoDB. Strong background in building scalable web 
applications and leading development teams.

TECHNICAL SKILLS
• Programming Languages: JavaScript, TypeScript, Python, Java
• Frontend: React, Vue.js, HTML5, CSS3, TailwindCSS
• Backend: Node.js, Express.js, Python, Django
• Databases: MongoDB, PostgreSQL, MySQL
• Cloud: AWS, Docker, Kubernetes
• Tools: Git, Jenkins, Jira, Figma

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc. | 2021 - Present
• Developed and maintained React-based web applications serving 100,000+ users
• Led a team of 4 developers in implementing microservices architecture
• Improved application performance by 40% through code optimization
• Collaborated with product managers to define technical requirements

Software Engineer | StartupXYZ | 2019 - 2021
• Built RESTful APIs using Node.js and Express.js
• Implemented automated testing reducing bugs by 60%
• Designed and developed responsive web interfaces
• Integrated third-party APIs and payment systems

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2015 - 2019

CERTIFICATIONS
• AWS Certified Developer Associate
• MongoDB Certified Developer
• React Professional Certification
```

## Sample Job Description

```
Job Title: Senior Full Stack Developer

Company: InnovateTech Solutions

Location: San Francisco, CA (Remote)

Job Description:

We are seeking a Senior Full Stack Developer to join our dynamic team. The ideal candidate will have extensive experience in modern web development technologies and a passion for building scalable applications.

Responsibilities:
• Design and develop full-stack web applications using React and Node.js
• Build and maintain RESTful APIs and microservices
• Work with MongoDB and PostgreSQL databases
• Implement automated testing and CI/CD pipelines
• Collaborate with cross-functional teams including designers and product managers
• Mentor junior developers and conduct code reviews
• Optimize application performance and scalability
• Work with cloud platforms like AWS and Docker

Requirements:
• 5+ years of experience in full-stack development
• Strong proficiency in JavaScript, TypeScript, React, and Node.js
• Experience with MongoDB, PostgreSQL, or similar databases
• Knowledge of RESTful API design and microservices architecture
• Experience with cloud platforms (AWS, Azure, or GCP)
• Familiarity with Docker and containerization
• Strong understanding of Git version control
• Experience with automated testing frameworks
• Excellent communication and collaboration skills
• Bachelor's degree in Computer Science or related field

Preferred Qualifications:
• Experience with GraphQL
• Knowledge of Kubernetes
• Experience with CI/CD tools like Jenkins or GitHub Actions
• Previous experience in a startup environment
• Open source contributions
• Experience with Agile/Scrum methodologies

Benefits:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements and remote work options
• Professional development opportunities
• 401(k) matching
• Unlimited PTO
```

## Expected Analysis Results

Based on the sample data above, the analysis should show:

### ATS Score: ~75-85%
- High keyword match (React, Node.js, MongoDB, JavaScript, TypeScript)
- Good skill alignment
- Strong action verb usage

### Matched Keywords:
- React, Node.js, MongoDB, JavaScript, TypeScript
- RESTful APIs, microservices, AWS, Docker
- Git, testing, scalability, performance

### Missing Keywords:
- PostgreSQL, GraphQL, Kubernetes
- CI/CD, Jenkins, GitHub Actions
- Agile/Scrum methodologies

### Suggestions:
- Add PostgreSQL experience if applicable
- Mention CI/CD pipeline experience
- Include GraphQL knowledge if available
- Add Kubernetes experience
- Highlight Agile/Scrum experience

## Test Files

### PDF Resume
Create a PDF version of the sample resume text above using any PDF generator.

### Test Scenarios

1. **High Match Scenario**: Use the sample resume with a job description that closely matches the skills
2. **Low Match Scenario**: Use the sample resume with a job description for a different role (e.g., Data Scientist)
3. **Partial Match Scenario**: Use the sample resume with a job description that has some overlapping skills

## API Testing Examples

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Analysis
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "PASTE_SAMPLE_RESUME_TEXT_HERE",
    "jobDescription": "PASTE_SAMPLE_JOB_DESCRIPTION_HERE",
    "fileName": "sample-resume.txt",
    "fileType": "txt"
  }'
```
