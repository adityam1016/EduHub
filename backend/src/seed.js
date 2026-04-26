const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const Result = require('./models/Result');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eduhub';

// ─── Sample Questions Data ───

const techQuestions = [
  {
    questionText: 'What does HTML stand for?',
    options: [
      { text: 'Hyper Text Markup Language', isCorrect: true },
      { text: 'High Tech Modern Language', isCorrect: false },
      { text: 'Hyper Transfer Markup Language', isCorrect: false },
      { text: 'Home Tool Markup Language', isCorrect: false },
    ],
    points: 10,
    explanation: 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
  },
  {
    questionText: 'Which company developed the JavaScript programming language?',
    options: [
      { text: 'Microsoft', isCorrect: false },
      { text: 'Netscape', isCorrect: true },
      { text: 'Google', isCorrect: false },
      { text: 'Apple', isCorrect: false },
    ],
    points: 10,
    explanation: 'JavaScript was developed by Brendan Eich at Netscape Communications in 1995.',
  },
  {
    questionText: 'What does CSS stand for?',
    options: [
      { text: 'Computer Style Sheets', isCorrect: false },
      { text: 'Creative Style System', isCorrect: false },
      { text: 'Cascading Style Sheets', isCorrect: true },
      { text: 'Colorful Style Sheets', isCorrect: false },
    ],
    points: 10,
    explanation: 'CSS stands for Cascading Style Sheets, used to style and layout web pages.',
  },
  {
    questionText: 'Which of the following is NOT a programming language?',
    options: [
      { text: 'Python', isCorrect: false },
      { text: 'Java', isCorrect: false },
      { text: 'HTML', isCorrect: true },
      { text: 'C++', isCorrect: false },
    ],
    points: 10,
    explanation: 'HTML is a markup language, not a programming language. It structures content on the web.',
  },
  {
    questionText: 'What year was the first iPhone released?',
    options: [
      { text: '2005', isCorrect: false },
      { text: '2006', isCorrect: false },
      { text: '2007', isCorrect: true },
      { text: '2008', isCorrect: false },
    ],
    points: 10,
    explanation: 'The first iPhone was released by Apple on June 29, 2007.',
  },
  {
    questionText: 'What does API stand for?',
    options: [
      { text: 'Application Programming Interface', isCorrect: true },
      { text: 'Advanced Program Integration', isCorrect: false },
      { text: 'Automated Programming Instruction', isCorrect: false },
      { text: 'Application Process Integration', isCorrect: false },
    ],
    points: 10,
    explanation: 'API stands for Application Programming Interface — a set of protocols for building software.',
  },
  {
    questionText: 'Which database is a NoSQL database?',
    options: [
      { text: 'MySQL', isCorrect: false },
      { text: 'PostgreSQL', isCorrect: false },
      { text: 'MongoDB', isCorrect: true },
      { text: 'Oracle', isCorrect: false },
    ],
    points: 10,
    explanation: 'MongoDB is a popular NoSQL (document-oriented) database.',
  },
  {
    questionText: 'What does the "git push" command do?',
    options: [
      { text: 'Downloads changes from remote', isCorrect: false },
      { text: 'Creates a new branch', isCorrect: false },
      { text: 'Uploads local commits to remote', isCorrect: true },
      { text: 'Deletes a repository', isCorrect: false },
    ],
    points: 10,
    explanation: '"git push" uploads your local repository commits to a remote repository.',
  },
  {
    questionText: 'Which protocol is used to send emails?',
    options: [
      { text: 'HTTP', isCorrect: false },
      { text: 'FTP', isCorrect: false },
      { text: 'SMTP', isCorrect: true },
      { text: 'SSH', isCorrect: false },
    ],
    points: 10,
    explanation: 'SMTP (Simple Mail Transfer Protocol) is used for sending emails.',
  },
  {
    questionText: 'What is the latest major version of React (as of 2024)?',
    options: [
      { text: 'React 16', isCorrect: false },
      { text: 'React 17', isCorrect: false },
      { text: 'React 18', isCorrect: true },
      { text: 'React 15', isCorrect: false },
    ],
    points: 10,
    explanation: 'React 18 is the latest major version, introducing features like concurrent rendering.',
  },
];

const geographyQuestions = [
  {
    questionText: 'What is the largest country in the world by area?',
    options: [
      { text: 'China', isCorrect: false },
      { text: 'United States', isCorrect: false },
      { text: 'Russia', isCorrect: true },
      { text: 'Canada', isCorrect: false },
    ],
    points: 10,
    explanation: 'Russia is the largest country by area at approximately 17.1 million km².',
  },
  {
    questionText: 'Which river is the longest in the world?',
    options: [
      { text: 'Amazon', isCorrect: false },
      { text: 'Nile', isCorrect: true },
      { text: 'Mississippi', isCorrect: false },
      { text: 'Yangtze', isCorrect: false },
    ],
    points: 10,
    explanation: 'The Nile River in Africa is traditionally considered the longest river at about 6,650 km.',
  },
  {
    questionText: 'What is the capital of Australia?',
    options: [
      { text: 'Sydney', isCorrect: false },
      { text: 'Melbourne', isCorrect: false },
      { text: 'Canberra', isCorrect: true },
      { text: 'Brisbane', isCorrect: false },
    ],
    points: 10,
    explanation: 'Canberra is the capital city of Australia, not Sydney or Melbourne.',
  },
  {
    questionText: 'Which ocean is the largest?',
    options: [
      { text: 'Atlantic Ocean', isCorrect: false },
      { text: 'Indian Ocean', isCorrect: false },
      { text: 'Arctic Ocean', isCorrect: false },
      { text: 'Pacific Ocean', isCorrect: true },
    ],
    points: 10,
    explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth.',
  },
  {
    questionText: 'Mount Everest is located in which mountain range?',
    options: [
      { text: 'Andes', isCorrect: false },
      { text: 'Alps', isCorrect: false },
      { text: 'Himalayas', isCorrect: true },
      { text: 'Rockies', isCorrect: false },
    ],
    points: 10,
    explanation: 'Mount Everest (8,848.86 m) is located in the Himalayas on the Nepal-Tibet border.',
  },
  {
    questionText: 'Which African country was formerly known as Abyssinia?',
    options: [
      { text: 'Kenya', isCorrect: false },
      { text: 'Ethiopia', isCorrect: true },
      { text: 'Nigeria', isCorrect: false },
      { text: 'Ghana', isCorrect: false },
    ],
    points: 10,
    explanation: 'Ethiopia was historically known as Abyssinia until the 20th century.',
  },
  {
    questionText: 'What is the smallest country in the world?',
    options: [
      { text: 'Monaco', isCorrect: false },
      { text: 'Vatican City', isCorrect: true },
      { text: 'San Marino', isCorrect: false },
      { text: 'Liechtenstein', isCorrect: false },
    ],
    points: 10,
    explanation: 'Vatican City is the smallest country at just 0.44 km².',
  },
  {
    questionText: 'The Sahara Desert is located on which continent?',
    options: [
      { text: 'Asia', isCorrect: false },
      { text: 'Africa', isCorrect: true },
      { text: 'South America', isCorrect: false },
      { text: 'Australia', isCorrect: false },
    ],
    points: 10,
    explanation: 'The Sahara Desert covers much of North Africa and is the largest hot desert in the world.',
  },
  {
    questionText: 'Which country has the most natural lakes?',
    options: [
      { text: 'United States', isCorrect: false },
      { text: 'Russia', isCorrect: false },
      { text: 'Canada', isCorrect: true },
      { text: 'Finland', isCorrect: false },
    ],
    points: 10,
    explanation: 'Canada has more lakes than the rest of the world combined, with over 31,000 large lakes.',
  },
  {
    questionText: 'What is the capital of Japan?',
    options: [
      { text: 'Osaka', isCorrect: false },
      { text: 'Kyoto', isCorrect: false },
      { text: 'Tokyo', isCorrect: true },
      { text: 'Yokohama', isCorrect: false },
    ],
    points: 10,
    explanation: 'Tokyo has been the capital of Japan since 1868.',
  },
];

const literatureQuestions = [
  {
    questionText: 'Who wrote "Romeo and Juliet"?',
    options: [
      { text: 'Charles Dickens', isCorrect: false },
      { text: 'William Shakespeare', isCorrect: true },
      { text: 'Jane Austen', isCorrect: false },
      { text: 'Mark Twain', isCorrect: false },
    ],
    points: 10,
    explanation: 'William Shakespeare wrote "Romeo and Juliet" around 1594-1596.',
  },
  {
    questionText: 'In which novel does the character Jay Gatsby appear?',
    options: [
      { text: 'The Catcher in the Rye', isCorrect: false },
      { text: 'To Kill a Mockingbird', isCorrect: false },
      { text: 'The Great Gatsby', isCorrect: true },
      { text: '1984', isCorrect: false },
    ],
    points: 10,
    explanation: 'Jay Gatsby is the protagonist of F. Scott Fitzgerald\'s "The Great Gatsby" (1925).',
  },
  {
    questionText: 'Who wrote "Pride and Prejudice"?',
    options: [
      { text: 'Charlotte Brontë', isCorrect: false },
      { text: 'Emily Brontë', isCorrect: false },
      { text: 'Jane Austen', isCorrect: true },
      { text: 'Mary Shelley', isCorrect: false },
    ],
    points: 10,
    explanation: 'Jane Austen published "Pride and Prejudice" in 1813.',
  },
  {
    questionText: 'What is the first book in the Harry Potter series?',
    options: [
      { text: 'The Chamber of Secrets', isCorrect: false },
      { text: 'The Philosopher\'s Stone', isCorrect: true },
      { text: 'The Prisoner of Azkaban', isCorrect: false },
      { text: 'The Goblet of Fire', isCorrect: false },
    ],
    points: 10,
    explanation: '"Harry Potter and the Philosopher\'s Stone" (1997) is the first book in J.K. Rowling\'s series.',
  },
  {
    questionText: 'Who is the author of "1984"?',
    options: [
      { text: 'Aldous Huxley', isCorrect: false },
      { text: 'George Orwell', isCorrect: true },
      { text: 'Ray Bradbury', isCorrect: false },
      { text: 'H.G. Wells', isCorrect: false },
    ],
    points: 10,
    explanation: 'George Orwell (Eric Arthur Blair) published "1984" in 1949.',
  },
  {
    questionText: 'In Homer\'s "Odyssey", what is the name of Odysseus\'s wife?',
    options: [
      { text: 'Helen', isCorrect: false },
      { text: 'Athena', isCorrect: false },
      { text: 'Penelope', isCorrect: true },
      { text: 'Circe', isCorrect: false },
    ],
    points: 10,
    explanation: 'Penelope faithfully waited 20 years for Odysseus to return from the Trojan War.',
  },
  {
    questionText: 'Which Shakespeare play features the character Hamlet?',
    options: [
      { text: 'Macbeth', isCorrect: false },
      { text: 'Othello', isCorrect: false },
      { text: 'Hamlet', isCorrect: true },
      { text: 'King Lear', isCorrect: false },
    ],
    points: 10,
    explanation: '"Hamlet" (also called "The Tragedy of Hamlet, Prince of Denmark") features the character Hamlet.',
  },
  {
    questionText: 'Who wrote "Moby-Dick"?',
    options: [
      { text: 'Herman Melville', isCorrect: true },
      { text: 'Nathaniel Hawthorne', isCorrect: false },
      { text: 'Edgar Allan Poe', isCorrect: false },
      { text: 'Walt Whitman', isCorrect: false },
    ],
    points: 10,
    explanation: 'Herman Melville published "Moby-Dick" in 1851.',
  },
  {
    questionText: 'What literary genre does "The Lord of the Rings" belong to?',
    options: [
      { text: 'Science Fiction', isCorrect: false },
      { text: 'Historical Fiction', isCorrect: false },
      { text: 'High Fantasy', isCorrect: true },
      { text: 'Gothic Horror', isCorrect: false },
    ],
    points: 10,
    explanation: '"The Lord of the Rings" by J.R.R. Tolkien is a defining work of the high fantasy genre.',
  },
  {
    questionText: 'Which Russian author wrote "War and Peace"?',
    options: [
      { text: 'Fyodor Dostoevsky', isCorrect: false },
      { text: 'Leo Tolstoy', isCorrect: true },
      { text: 'Anton Chekhov', isCorrect: false },
      { text: 'Ivan Turgenev', isCorrect: false },
    ],
    points: 10,
    explanation: 'Leo Tolstoy published "War and Peace" between 1865 and 1869.',
  },
];

// ─── Seed Function ───
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    await Result.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@eduhub.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('👤 Admin user created: admin@eduhub.com / Admin@123');

    // Create student user
    const student = await User.create({
      name: 'Alex',
      email: 'alex@eduhub.com',
      password: 'Student@123',
      role: 'student',
    });
    console.log('👤 Student user created: alex@eduhub.com / Student@123');

    // Create Quiz 1: Tech & Innovation
    const quiz1 = await Quiz.create({
      title: 'Tech & Innovation',
      description: 'Test your knowledge of technology, programming, and digital innovation.',
      category: 'Tech & Innovation',
      difficulty: 'Medium',
      timeLimit: 600, // 10 minutes
      isPublished: true,
      createdBy: admin._id,
    });

    const q1Docs = await Question.insertMany(
      techQuestions.map((q) => ({ ...q, quizId: quiz1._id }))
    );
    quiz1.questions = q1Docs.map((q) => q._id);
    await quiz1.save();
    console.log('📝 Quiz created: Tech & Innovation (10 questions)');

    // Create Quiz 2: Global Geography
    const quiz2 = await Quiz.create({
      title: 'Global Geography',
      description: 'Explore countries, capitals, rivers, mountains, and geographical wonders.',
      category: 'Global Geography',
      difficulty: 'Easy',
      timeLimit: 480, // 8 minutes
      isPublished: true,
      createdBy: admin._id,
    });

    const q2Docs = await Question.insertMany(
      geographyQuestions.map((q) => ({ ...q, quizId: quiz2._id }))
    );
    quiz2.questions = q2Docs.map((q) => q._id);
    await quiz2.save();
    console.log('📝 Quiz created: Global Geography (10 questions)');

    // Create Quiz 3: Classic Literature
    const quiz3 = await Quiz.create({
      title: 'Classic Literature',
      description: 'Journey through the greatest works of literature from Shakespeare to Tolkien.',
      category: 'Classic Literature',
      difficulty: 'Hard',
      timeLimit: 900, // 15 minutes
      isPublished: true,
      createdBy: admin._id,
    });

    const q3Docs = await Question.insertMany(
      literatureQuestions.map((q) => ({ ...q, quizId: quiz3._id }))
    );
    quiz3.questions = q3Docs.map((q) => q._id);
    await quiz3.save();
    console.log('📝 Quiz created: Classic Literature (10 questions)');

    console.log('\n🎉 Seed complete! Database populated successfully.');
    console.log('\n📋 Summary:');
    console.log('   • 2 users (1 admin, 1 student)');
    console.log('   • 3 quizzes (30 questions total)');
    console.log('\n🔑 Login credentials:');
    console.log('   Admin:   admin@eduhub.com / Admin@123');
    console.log('   Student: alex@eduhub.com / Student@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
