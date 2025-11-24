import User from '../models/User';
import Department from '../models/Department';
import Employee from '../models/Employee';

/**
 * Seed the database with initial data
 */
export async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Seeding database...');

    // Check if data already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('ℹ️  Database already seeded. Skipping...');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@company.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });
    console.log('✅ Created admin user:', adminUser.email);

    // Create employee user for testing
    const employeeUser = await User.create({
      username: 'employee',
      email: process.env.EMPLOYEE_EMAIL || 'employee@company.com',
      password: process.env.EMPLOYEE_PASSWORD || 'employee123',
      role: 'employee'
    });
    console.log('✅ Created employee user:', employeeUser.email);

    // Create departments
    const departments = [
      { name: 'Engineering', description: 'Software development and technical operations' },
      { name: 'Marketing', description: 'Marketing and brand management' },
      { name: 'Sales', description: 'Sales and business development' },
      { name: 'Human Resources', description: 'HR and talent management' },
      { name: 'Finance', description: 'Financial planning and accounting' },
      { name: 'Operations', description: 'Business operations and logistics' },
    ];

    const createdDepartments = await Department.insertMany(departments);
    console.log(`✅ Created ${createdDepartments.length} departments`);

    // Create sample employees
    const employees = [
      {
        name: 'John Doe',
        age: 30,
        class: 'Senior' as const,
        subjects: ['React', 'Node.js', 'GraphQL'],
        attendance: 95,
        email: 'john.doe@company.com',
        phone: '+1-555-0101',
        department: 'Engineering',
        position: 'Senior Software Engineer',
        joinDate: new Date('2020-01-15'),
        salary: 120000,
        address: '123 Tech Street, San Francisco, CA 94105',
        status: 'Active' as const
      },
      {
        name: 'Jane Smith',
        age: 28,
        class: 'Mid-Level' as const,
        subjects: ['Marketing Strategy', 'Social Media', 'Content Creation'],
        attendance: 92,
        email: 'jane.smith@company.com',
        phone: '+1-555-0102',
        department: 'Marketing',
        position: 'Marketing Manager',
        joinDate: new Date('2021-03-20'),
        salary: 85000,
        address: '456 Market Ave, San Francisco, CA 94102',
        status: 'Active' as const
      },
      {
        name: 'Michael Johnson',
        age: 35,
        class: 'Lead' as const,
        subjects: ['Sales Strategy', 'Client Relations', 'Negotiations'],
        attendance: 88,
        email: 'michael.johnson@company.com',
        phone: '+1-555-0103',
        department: 'Sales',
        position: 'Sales Director',
        joinDate: new Date('2019-06-10'),
        salary: 135000,
        address: '789 Business Blvd, San Francisco, CA 94103',
        status: 'Active' as const
      },
      {
        name: 'Emily Davis',
        age: 32,
        class: 'Senior' as const,
        subjects: ['Recruitment', 'Employee Relations', 'Training'],
        attendance: 96,
        email: 'emily.davis@company.com',
        phone: '+1-555-0104',
        department: 'Human Resources',
        position: 'HR Manager',
        joinDate: new Date('2020-09-01'),
        salary: 95000,
        address: '321 People Place, San Francisco, CA 94104',
        status: 'Active' as const
      },
      {
        name: 'David Wilson',
        age: 40,
        class: 'Manager' as const,
        subjects: ['Financial Planning', 'Budgeting', 'Accounting'],
        attendance: 98,
        email: 'david.wilson@company.com',
        phone: '+1-555-0105',
        department: 'Finance',
        position: 'Finance Manager',
        joinDate: new Date('2018-02-15'),
        salary: 140000,
        address: '654 Money Lane, San Francisco, CA 94106',
        status: 'Active' as const
      },
      {
        name: 'Sarah Brown',
        age: 26,
        class: 'Junior' as const,
        subjects: ['Operations Management', 'Logistics', 'Supply Chain'],
        attendance: 90,
        email: 'sarah.brown@company.com',
        phone: '+1-555-0106',
        department: 'Operations',
        position: 'Operations Coordinator',
        joinDate: new Date('2022-04-01'),
        salary: 65000,
        address: '987 Ops Street, San Francisco, CA 94107',
        status: 'Active' as const
      },
      {
        name: 'Robert Martinez',
        age: 29,
        class: 'Mid-Level' as const,
        subjects: ['Full-Stack Development', 'Database Design', 'API Development'],
        attendance: 94,
        email: 'robert.martinez@company.com',
        phone: '+1-555-0107',
        department: 'Engineering',
        position: 'Full-Stack Developer',
        joinDate: new Date('2021-07-15'),
        salary: 95000,
        address: '147 Code Ave, San Francisco, CA 94108',
        status: 'Active' as const
      },
      {
        name: 'Lisa Anderson',
        age: 31,
        class: 'Senior' as const,
        subjects: ['Brand Management', 'Digital Marketing', 'SEO'],
        attendance: 91,
        email: 'lisa.anderson@company.com',
        phone: '+1-555-0108',
        department: 'Marketing',
        position: 'Senior Marketing Specialist',
        joinDate: new Date('2020-11-10'),
        salary: 88000,
        address: '258 Brand Blvd, San Francisco, CA 94109',
        status: 'Active' as const
      },
      {
        name: 'James Taylor',
        age: 27,
        class: 'Junior' as const,
        subjects: ['Sales Operations', 'CRM Management', 'Lead Generation'],
        attendance: 87,
        email: 'james.taylor@company.com',
        phone: '+1-555-0109',
        department: 'Sales',
        position: 'Sales Representative',
        joinDate: new Date('2022-01-20'),
        salary: 55000,
        address: '369 Sales Circle, San Francisco, CA 94110',
        status: 'Active' as const
      },
      {
        name: 'Amanda White',
        age: 33,
        class: 'Senior' as const,
        subjects: ['Cloud Architecture', 'DevOps', 'CI/CD'],
        attendance: 97,
        email: 'amanda.white@company.com',
        phone: '+1-555-0110',
        department: 'Engineering',
        position: 'DevOps Engineer',
        joinDate: new Date('2019-10-05'),
        salary: 130000,
        address: '741 Cloud Way, San Francisco, CA 94111',
        status: 'Active' as const
      }
    ];

    const createdEmployees = await Employee.insertMany(employees);
    console.log(`✅ Created ${createdEmployees.length} employees`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📧 Login credentials:');
    console.log(`   Admin: ${adminUser.email}`);
    console.log(`   Employee: ${employeeUser.email}`);
    console.log('\n⚠️  Use OTP-based login with these email addresses\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

