"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  PlayCircle,
  FileQuestion,
  Sparkles,
  Code2,
  BrainCircuit,
  Cpu,
  Terminal,
  GitBranch,
  Layers,
  Coffee,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Server,
  FileCode,
  Database,
  Network,
  Cloud,
  ChevronRight,
  Target,
  Star,
} from "lucide-react";

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
};

const domains = [
  { id: 0, title: "Java", icon: Coffee, color: "from-orange-500 to-red-600", accent: "orange", activeClasses: "bg-orange-500/10 border-orange-500/50", description: "Core Java, JVM, Multithreading, and Spring Boot." },
  { id: 1, title: "Artificial Intelligence", icon: BrainCircuit, color: "from-violet-600 to-fuchsia-600", accent: "violet", activeClasses: "bg-violet-500/10 border-violet-500/50", description: "Neural Networks, NLP, Computer Vision, and AI ethics." },
  { id: 2, title: "Machine Learning", icon: Cpu, color: "from-blue-600 to-indigo-600", accent: "blue", activeClasses: "bg-blue-500/10 border-blue-500/50", description: "Supervised/Unsupervised learning, models & optimization." },
  { id: 3, title: "C & C++", icon: Terminal, color: "from-slate-500 to-slate-700", accent: "slate", activeClasses: "bg-slate-500/10 border-slate-500/50", description: "Pointers, memory management, OOP, and STL." },
  { id: 4, title: "DAA (Algorithms)", icon: GitBranch, color: "from-emerald-600 to-teal-600", accent: "emerald", activeClasses: "bg-emerald-500/10 border-emerald-500/50", description: "Design and Analysis of Algorithms, time complexity." },
  { id: 5, title: "DSA", icon: Layers, color: "from-rose-500 to-pink-600", accent: "rose", activeClasses: "bg-rose-500/10 border-rose-500/50", description: "Data Structures and Algorithms, arrays, trees, graphs." },
  { id: 6, title: "React", icon: Code2, color: "from-cyan-500 to-blue-600", accent: "cyan", activeClasses: "bg-cyan-500/10 border-cyan-500/50", description: "Hooks, Virtual DOM, state management, and routing." },
  { id: 7, title: "Node.js", icon: Server, color: "from-green-500 to-emerald-700", accent: "green", activeClasses: "bg-green-500/10 border-green-500/50", description: "Event loop, Express, REST APIs, and middleware." },
  { id: 8, title: "Python", icon: FileCode, color: "from-yellow-400 to-blue-600", accent: "yellow", activeClasses: "bg-yellow-500/10 border-yellow-500/50", description: "Data types, decorators, Django, and scripting." },
  { id: 9, title: "SQL", icon: Database, color: "from-blue-400 to-cyan-600", accent: "blue", activeClasses: "bg-blue-400/10 border-blue-400/50", description: "Queries, joins, indexing, and normalization." },
  { id: 10, title: "System Design", icon: Network, color: "from-indigo-500 to-purple-600", accent: "indigo", activeClasses: "bg-indigo-500/10 border-indigo-500/50", description: "Scalability, microservices, load balancing, caching." },
  { id: 11, title: "DevOps", icon: Cloud, color: "from-sky-500 to-blue-700", accent: "sky", activeClasses: "bg-sky-500/10 border-sky-500/50", description: "CI/CD, Docker, Kubernetes, and AWS basics." },
];

const difficulties = [
  { level: "Easy", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800", activeBg: "bg-emerald-500 text-white border-emerald-500" },
  { level: "Medium", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-800", activeBg: "bg-amber-500 text-white border-amber-500" },
  { level: "Hard", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/40", border: "border-rose-200 dark:border-rose-800", activeBg: "bg-rose-500 text-white border-rose-500" },
];

function generateQuestions(domain: string, _diff: string): Question[] {
  if (domain === "Java") {
    return [
      { question: "Which of these is a marker interface in Java?", options: ["Runnable", "Serializable", "Cloneable", "Both B and C"], answerIndex: 3 },
      { question: "What is the default value of a boolean variable in Java?", options: ["true", "false", "null", "0"], answerIndex: 1 },
      { question: "Which keyword is used to prevent method overriding?", options: ["static", "constant", "final", "abstract"], answerIndex: 2 },
      { question: "Which collection class allows you to associate its elements with key values?", options: ["java.util.Set", "java.util.List", "java.util.Map", "java.util.Collections"], answerIndex: 2 },
      { question: "Which method of the Class.class is used to determine the name of a class?", options: ["getClass()", "getName()", "intern()", "toString()"], answerIndex: 1 },
      { question: "What is the size of float variable in Java?", options: ["8 bit", "16 bit", "32 bit", "64 bit"], answerIndex: 2 },
      { question: "Which of the following is not an OOPS concept in Java?", options: ["Polymorphism", "Inheritance", "Compilation", "Encapsulation"], answerIndex: 2 },
      { question: "Which exception is thrown when java is out of memory?", options: ["MemoryError", "OutOfMemoryError", "MemoryOutOfBoundsException", "MemoryFullException"], answerIndex: 1 },
      { question: "What is the extension of java code files?", options: [".js", ".txt", ".class", ".java"], answerIndex: 3 },
      { question: "Who invented Java Programming?", options: ["Guido van Rossum", "James Gosling", "Dennis Ritchie", "Bjarne Stroustrup"], answerIndex: 1 },
    ];
  } else if (domain === "Machine Learning") {
    return [
      { question: "Which algorithm is best for categorical classification?", options: ["Linear Regression", "Random Forest", "K-Means", "PCA"], answerIndex: 1 },
      { question: "What is the term for a model performing well on training data but poorly on unseen data?", options: ["Underfitting", "Overfitting", "Bias", "Variance"], answerIndex: 1 },
      { question: "Which of the following is an unsupervised learning technique?", options: ["Decision Trees", "Logistic Regression", "Clustering", "SVM"], answerIndex: 2 },
      { question: "What does NLP stand for?", options: ["Natural Language Processing", "Neural Logic Programming", "New Linear Parsing", "Node Learning Protocol"], answerIndex: 0 },
      { question: "What is a Neural Network's building block called?", options: ["Node", "Neuron", "Perceptron", "All of the above"], answerIndex: 3 },
      { question: "Which activation function outputs values between 0 and 1?", options: ["ReLU", "Tanh", "Sigmoid", "Softmax"], answerIndex: 2 },
      { question: "What is the purpose of a loss function?", options: ["To measure the model's error", "To increase training speed", "To add more layers", "To clean the dataset"], answerIndex: 0 },
      { question: "What is 'k' in k-nearest neighbors?", options: ["A distance metric", "The number of clusters", "The number of nearest neighbors", "The learning rate"], answerIndex: 2 },
      { question: "Which scaling method rescales features to a [0, 1] range?", options: ["Standardization", "Min-Max Normalization", "Z-score Normalization", "Robust Scaling"], answerIndex: 1 },
      { question: "Which metric is used for regression problems?", options: ["Accuracy", "F1 Score", "Mean Squared Error", "Precision"], answerIndex: 2 },
    ];
  } else if (domain === "Artificial Intelligence") {
    return [
      { question: "What is the primary goal of Artificial Intelligence?", options: ["To replace humans", "To build machines that can perform tasks requiring human intelligence", "To program calculators", "To design web interfaces"], answerIndex: 1 },
      { question: "Who is known as the father of AI?", options: ["Alan Turing", "John McCarthy", "Geoffrey Hinton", "Marvin Minsky"], answerIndex: 1 },
      { question: "Which of the following is a type of AI?", options: ["Narrow AI", "General AI", "Super AI", "All of the above"], answerIndex: 3 },
      { question: "What test is used to determine a machine's ability to exhibit intelligent behavior?", options: ["Turing Test", "Einstein Test", "Intelligence Test", "Machine Test"], answerIndex: 0 },
      { question: "Which subfield of AI focuses on vision?", options: ["NLP", "Computer Vision", "Robotics", "Speech Recognition"], answerIndex: 1 },
      { question: "Expert Systems use which of the following to solve problems?", options: ["Neural Networks", "Rules Engine and Knowledge Base", "Genetic Algorithms", "Decision Trees"], answerIndex: 1 },
      { question: "Which search algorithm guarantees finding the shortest path in an unweighted graph?", options: ["DFS", "BFS", "A*", "Hill Climbing"], answerIndex: 1 },
      { question: "What is a heuristic function?", options: ["An exact math formula", "An estimated cost from a state to the goal", "A sorting algorithm", "A hardware component"], answerIndex: 1 },
      { question: "Which algorithm is used in game theory?", options: ["Minimax", "K-Means", "Dijkstra", "Apriori"], answerIndex: 0 },
      { question: "What does 'deep' in Deep Learning refer to?", options: ["Deep understanding of math", "Multiple hidden layers in the network", "Deep memory usage", "High complexity"], answerIndex: 1 },
    ];
  } else if (domain === "C & C++") {
    return [
      { question: "Who developed the C language?", options: ["Ken Thompson", "Dennis Ritchie", "Bjarne Stroustrup", "James Gosling"], answerIndex: 1 },
      { question: "What is the size of an int data type in 32-bit systems?", options: ["2 bytes", "4 bytes", "8 bytes", "Depends on compiler"], answerIndex: 1 },
      { question: "Which keyword is used to allocate dynamic memory in C++?", options: ["malloc", "calloc", "alloc", "new"], answerIndex: 3 },
      { question: "Which feature of OOP is demonstrated by function overloading?", options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], answerIndex: 1 },
      { question: "How do you access the value at the address stored in a pointer 'p'?", options: ["&p", "p", "*p", "->p"], answerIndex: 2 },
      { question: "What is a pure virtual function?", options: ["A function with no return type", "A function assigned to 0", "A function that returns 0", "An empty function body"], answerIndex: 1 },
      { question: "Which standard library stream is used for standard input?", options: ["cout", "cin", "cerr", "clog"], answerIndex: 1 },
      { question: "Which operator is used to resolve scope in C++?", options: ["::", "->", ".", ":"], answerIndex: 0 },
      { question: "In C, which function is used to free dynamically allocated memory?", options: ["delete", "free()", "remove()", "dealloc()"], answerIndex: 1 },
      { question: "What does STL stand for in C++?", options: ["Standard Template Library", "System Type Library", "Standard Type Language", "Syntax Tree Logic"], answerIndex: 0 },
    ];
  } else if (domain === "DAA (Algorithms)") {
    return [
      { question: "Which sorting algorithm has the best average-case time complexity?", options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], answerIndex: 2 },
      { question: "What is the worst-case time complexity of Quick Sort?", options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"], answerIndex: 2 },
      { question: "Which algorithm paradigm is used in Dijkstra's shortest path?", options: ["Divide and Conquer", "Dynamic Programming", "Greedy Algorithm", "Backtracking"], answerIndex: 2 },
      { question: "Which problem can be solved using Dynamic Programming?", options: ["Binary Search", "Fibonacci Series", "Bubble Sort", "Linear Search"], answerIndex: 1 },
      { question: "What is the primary difference between DP and Divide & Conquer?", options: ["DP uses recursion only", "DP handles overlapping subproblems", "D&C is always faster", "They are the same"], answerIndex: 1 },
      { question: "Which algorithm is used for finding the Minimum Spanning Tree?", options: ["Kruskal's Algorithm", "Floyd-Warshall", "Bellman-Ford", "DFS"], answerIndex: 0 },
      { question: "The Knapsack problem belongs to which category?", options: ["P", "NP-Complete", "NP-Hard", "Depends on variations"], answerIndex: 3 },
      { question: "Which notation defines an upper bound of an algorithm's time complexity?", options: ["Big-O", "Big-Omega", "Big-Theta", "Little-o"], answerIndex: 0 },
      { question: "What is the time complexity of Binary Search?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], answerIndex: 2 },
      { question: "Which algorithm is commonly used for string matching?", options: ["KMP Algorithm", "Prim's Algorithm", "Huffman Coding", "Ford-Fulkerson"], answerIndex: 0 },
    ];
  } else if (domain === "React") {
    return [
      { question: "What is the Virtual DOM?", options: ["A direct copy of the real DOM", "A lightweight JavaScript representation of the DOM", "A browser feature for rendering", "A new HTML standard"], answerIndex: 1 },
      { question: "Which hook is used to manage side effects in React?", options: ["useState", "useContext", "useEffect", "useReducer"], answerIndex: 2 },
      { question: "What is a Higher-Order Component (HOC)?", options: ["A component that renders other components", "A function that takes a component and returns a new component", "A component with higher z-index", "A strict mode component"], answerIndex: 1 },
      { question: "Which of the following is true about state in React?", options: ["State can be modified directly", "State is immutable and should be updated via setters", "State is shared globally by default", "State cannot hold objects"], answerIndex: 1 },
      { question: "What is the purpose of the 'key' prop in React lists?", options: ["To apply CSS classes", "To help React identify which items changed, are added, or removed", "To encrypt list data", "To sort the list"], answerIndex: 1 },
      { question: "How can you pass data from a child to a parent component?", options: ["Using Redux only", "Via props pointing to a parent callback function", "Using context API", "You cannot pass data upwards"], answerIndex: 1 },
      { question: "What does useMemo do?", options: ["Memoizes a callback function", "Memoizes a computed value to prevent expensive recalculations", "Stores data in localStorage", "Re-renders the component"], answerIndex: 1 },
      { question: "What is React Fiber?", options: ["A new React framework", "A UI library", "React's core reconciliation algorithm", "A state management tool"], answerIndex: 2 },
      { question: "Which of the following prevents unnecessary re-renders in functional components?", options: ["React.memo", "useEffect", "useRef", "React.Fragment"], answerIndex: 0 },
      { question: "What is context API used for?", options: ["Routing", "Managing local state", "Passing data deeply without prop drilling", "Server-side rendering"], answerIndex: 2 },
    ];
  } else if (domain === "Node.js") {
    return [
      { question: "What is Node.js?", options: ["A web framework", "A JavaScript runtime built on Chrome's V8 engine", "A database", "A frontend library"], answerIndex: 1 },
      { question: "Which core module is used to create a web server in Node.js?", options: ["fs", "url", "http", "path"], answerIndex: 2 },
      { question: "What is the role of the Event Loop in Node.js?", options: ["To block asynchronous operations", "To handle non-blocking I/O operations", "To compile JavaScript", "To connect to databases"], answerIndex: 1 },
      { question: "Which framework is most commonly used with Node.js for building APIs?", options: ["React", "Express", "Django", "Spring"], answerIndex: 1 },
      { question: "How do you export a module in Node.js (CommonJS)?", options: ["export default", "module.exports", "export module", "exports.default"], answerIndex: 1 },
      { question: "What is 'npm'?", options: ["Node Package Manager", "New Project Module", "Node Process Manager", "Non-Proprietary Modules"], answerIndex: 0 },
      { question: "Which of the following is true about Node.js streams?", options: ["They are used for small data only", "They process data piece by piece without keeping it all in memory", "They block the event loop", "They are only for video files"], answerIndex: 1 },
      { question: "What is middleware in Express.js?", options: ["A database layer", "Functions that have access to request and response objects", "A templating engine", "A load balancer"], answerIndex: 1 },
      { question: "Which object contains the parsed query string parameters in Express?", options: ["req.body", "req.params", "req.query", "req.data"], answerIndex: 2 },
      { question: "How does Node.js handle concurrency?", options: ["Multi-threading", "Multiple processes", "Single-threaded event loop", "Parallel execution"], answerIndex: 2 },
    ];
  } else if (domain === "Python") {
    return [
      { question: "What type of language is Python?", options: ["Compiled", "Interpreted", "Assembly", "Low-level"], answerIndex: 1 },
      { question: "Which of the following is a mutable data type in Python?", options: ["Tuple", "String", "List", "Integer"], answerIndex: 2 },
      { question: "What does the 'yield' keyword do?", options: ["Returns a value and ends the function", "Pauses execution and returns a generator", "Throws an exception", "Imports a module"], answerIndex: 1 },
      { question: "What is a decorator in Python?", options: ["A design pattern for UI", "A function that modifies the behavior of another function", "A class for data storage", "A syntax for loops"], answerIndex: 1 },
      { question: "Which method is called when an object is created?", options: ["__start__", "__init__", "__main__", "__create__"], answerIndex: 1 },
      { question: "What does the 'pass' statement do?", options: ["Exits the program", "Skips the current iteration", "Does nothing (null operation)", "Returns true"], answerIndex: 2 },
      { question: "How do you handle exceptions in Python?", options: ["try/catch", "try/except", "do/catch", "catch/finally"], answerIndex: 1 },
      { question: "What is PEP 8?", options: ["A Python package", "A web framework", "The Python style guide", "A built-in module"], answerIndex: 2 },
      { question: "Which of the following is used to create a virtual environment?", options: ["pip", "venv", "npm", "envir"], answerIndex: 1 },
      { question: "What is the output of 3 // 2 in Python 3?", options: ["1.5", "1", "2", "Error"], answerIndex: 1 },
    ];
  } else if (domain === "SQL") {
    return [
      { question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Logic", "Standard Query Language", "System Query Language"], answerIndex: 0 },
      { question: "Which clause is used to filter records?", options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"], answerIndex: 2 },
      { question: "What is a Primary Key?", options: ["A key that allows duplicates", "A unique identifier for each record in a table", "A key used for joins only", "A foreign key in another table"], answerIndex: 1 },
      { question: "Which JOIN returns all records when there is a match in either left or right table?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], answerIndex: 3 },
      { question: "What does the GROUP BY clause do?", options: ["Sorts the result set", "Groups rows that have the same values into summary rows", "Filters records", "Joins tables together"], answerIndex: 1 },
      { question: "Which of the following is an aggregate function?", options: ["SELECT", "UPPER()", "COUNT()", "TRIM()"], answerIndex: 2 },
      { question: "What is normalization?", options: ["Making tables larger", "Organizing data to reduce redundancy and improve integrity", "Deleting old records", "Converting data types"], answerIndex: 1 },
      { question: "Which command is used to remove a table from a database?", options: ["DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "TRUNCATE TABLE"], answerIndex: 2 },
      { question: "What is the difference between TRUNCATE and DELETE?", options: ["Truncate removes the table structure", "Delete is DDL, Truncate is DML", "Truncate cannot be rolled back easily and resets identity", "They are exactly the same"], answerIndex: 2 },
      { question: "What does ACID stand for in databases?", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Complete, Isolated, Data", "Auto, Commit, Insert, Delete", "Atomic, Caching, Indexing, Direct"], answerIndex: 0 },
    ];
  } else if (domain === "System Design") {
    return [
      { question: "What is horizontal scaling?", options: ["Adding more CPU/RAM to a single server", "Adding more servers to a pool of resources", "Upgrading the database schema", "Using a faster network"], answerIndex: 1 },
      { question: "What does a Load Balancer do?", options: ["Encrypts data", "Distributes incoming network traffic across multiple servers", "Stores cache", "Manages database connections"], answerIndex: 1 },
      { question: "What is the purpose of a Content Delivery Network (CDN)?", options: ["To host databases", "To deliver static assets faster by serving them from geographically closer nodes", "To compile code on the edge", "To replace backend servers"], answerIndex: 1 },
      { question: "What is caching used for?", options: ["Permanent data storage", "Storing frequently accessed data in memory for faster retrieval", "Encrypting passwords", "Routing traffic"], answerIndex: 1 },
      { question: "Which of the following is a NoSQL database type?", options: ["Relational", "Document-oriented", "Tabular", "Sequential"], answerIndex: 1 },
      { question: "What is a microservices architecture?", options: ["A monolithic application", "An app structured as a collection of loosely coupled services", "A single massive database", "A frontend framework"], answerIndex: 1 },
      { question: "What is CAP Theorem?", options: ["Consistency, Availability, Partition Tolerance", "Cache, API, Performance", "Compute, Access, Process", "Consistency, Accuracy, Performance"], answerIndex: 0 },
      { question: "What does Sharding refer to?", options: ["Deleting old data", "Partitioning a database horizontally across multiple servers", "Encrypting disks", "A type of load balancer"], answerIndex: 1 },
      { question: "Which communication protocol is often used for real-time bidirectional data flow?", options: ["HTTP/1.1", "FTP", "WebSockets", "SMTP"], answerIndex: 2 },
      { question: "What is a message queue useful for?", options: ["Storing static files", "Decoupling services and handling asynchronous processing", "Replacing databases", "Managing DNS"], answerIndex: 1 },
    ];
  } else if (domain === "DevOps") {
    return [
      { question: "What is the primary goal of CI/CD?", options: ["To write code faster", "To automate the integration and deployment of code changes", "To manage project tasks", "To secure servers"], answerIndex: 1 },
      { question: "What is Docker used for?", options: ["Virtualizing entire operating systems", "Containerizing applications and their dependencies", "Managing source code", "Monitoring logs"], answerIndex: 1 },
      { question: "What is Kubernetes?", options: ["A programming language", "A container orchestration platform", "A database management system", "A cloud provider"], answerIndex: 1 },
      { question: "Which of the following is an Infrastructure as Code (IaC) tool?", options: ["Terraform", "Jenkins", "Git", "Prometheus"], answerIndex: 0 },
      { question: "What is Jenkins?", options: ["A cloud provider", "An open-source automation server for CI/CD", "A container engine", "A load balancer"], answerIndex: 1 },
      { question: "What does 'Immutable Infrastructure' mean?", options: ["Servers that never crash", "Servers that are replaced rather than modified when changes are needed", "Hard drives that cannot be formatted", "Code that cannot be edited"], answerIndex: 1 },
      { question: "What is Prometheus primarily used for?", options: ["Code deployment", "Monitoring and alerting", "Container orchestration", "Version control"], answerIndex: 1 },
      { question: "Which of the following is a popular version control system?", options: ["Docker", "Git", "Ansible", "Kubernetes"], answerIndex: 1 },
      { question: "What does 'Blue-Green Deployment' achieve?", options: ["Reduces downtime and risk by running two identical environments", "Creates colorful UIs", "Deploys code randomly to different servers", "Only deploys during the night"], answerIndex: 0 },
      { question: "Which AWS service is commonly used for scalable object storage?", options: ["EC2", "RDS", "S3", "Lambda"], answerIndex: 2 },
    ];
  } else {
    // DSA
    return [
      { question: "Which data structure follows LIFO?", options: ["Queue", "Stack", "Tree", "Graph"], answerIndex: 1 },
      { question: "Which data structure is best for hierarchical data?", options: ["Array", "Linked List", "Tree", "Queue"], answerIndex: 2 },
      { question: "What is the time complexity of accessing an element in an array?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], answerIndex: 2 },
      { question: "Which data structure is used in Breadth-First Search (BFS)?", options: ["Stack", "Queue", "Priority Queue", "Heap"], answerIndex: 1 },
      { question: "In a binary search tree, where is the smallest element located?", options: ["Root", "Rightmost node", "Leftmost node", "Any leaf node"], answerIndex: 2 },
      { question: "What is the worst-case time complexity of searching in a Hash Table with many collisions?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], answerIndex: 2 },
      { question: "Which algorithm is used to reverse a Linked List?", options: ["Iterative pointer manipulation", "Binary Search", "Hashing", "Sorting"], answerIndex: 0 },
      { question: "What is a complete binary tree?", options: ["All levels are fully filled except possibly the last", "All nodes have 2 children", "Every node is a leaf", "A tree with 0 height"], answerIndex: 0 },
      { question: "Which structure is used for implementing LRU cache?", options: ["Array and Tree", "Queue and Stack", "Hash Map and Doubly Linked List", "Singly Linked List"], answerIndex: 2 },
      { question: "A graph with no cycles is called?", options: ["Cyclic graph", "Acyclic graph", "Complete graph", "Bipartite graph"], answerIndex: 1 },
    ];
  }
}

export default function MockInterviewsPage() {
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeDomain = selectedDomain !== null ? domains[selectedDomain] : null;
  const currentQ = questions[currentQIndex];

  const handleQuickPractice = () => {
    const ri = Math.floor(Math.random() * domains.length);
    const rd = Math.floor(Math.random() * difficulties.length);
    const dom = domains[ri]!;
    const diff = difficulties[rd]!.level;
    setSelectedDomain(ri);
    setSelectedDifficulty(diff);
    setQuestions(generateQuestions(dom.title, diff));
    setCurrentQIndex(0);
    setScore(0);
    setQuizFinished(false);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const handleDifficultySelect = (diff: string) => {
    setSelectedDifficulty(diff);
    if (selectedDomain !== null) {
      const dom = domains[selectedDomain]!;
      setQuestions(generateQuestions(dom.title, diff));
      setCurrentQIndex(0);
      setScore(0);
      setQuizFinished(false);
      setIsAnswered(false);
      setSelectedOption(null);
    }
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQ.answerIndex) setScore(p => p + 1);
    setTimeout(() => {
      setCurrentQIndex(prev => {
        if (prev < questions.length - 1) {
          setIsAnswered(false);
          setSelectedOption(null);
          return prev + 1;
        } else {
          setQuizFinished(true);
          return prev;
        }
      });
    }, 1300);
  };

  const scorePercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="min-h-full p-4 md:p-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-3">
            <MessageSquare className="w-3.5 h-3.5" /> AI Practice Arena
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Practice & Mock Interviews</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Select a domain and difficulty to start an adaptive multiple-choice quiz.
          </p>
        </div>
        <button
          onClick={handleQuickPractice}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all shrink-0"
        >
          <PlayCircle className="w-4 h-4" /> Quick Practice
        </button>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left — Domain Grid */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass rounded-2xl border border-border p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileQuestion className="w-3.5 h-3.5 text-primary" />
              </div>
              <h2 className="text-sm font-black text-foreground uppercase tracking-wide">1. Choose Domain</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {domains.map((domain, index) => {
                const isActive = selectedDomain === index;
                return (
                  <motion.div
                    key={domain.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedDomain(index); setSelectedDifficulty(null); }}
                    className={`cursor-pointer rounded-xl p-3.5 border transition-all duration-200 relative overflow-hidden group ${
                      isActive
                        ? `${domain.activeClasses} shadow-md`
                        : "bg-card border-border hover:border-primary/30 hover:bg-muted/30"
                    }`}
                  >
                    {/* Glow bg */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${domain.color} opacity-0 ${isActive ? "opacity-10" : "group-hover:opacity-5"} rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none transition-opacity`} />

                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center shadow-md shrink-0`}>
                        <domain.icon className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`font-bold text-sm leading-tight ${isActive ? "text-foreground" : "text-foreground"}`}>{domain.title}</h3>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{domain.description}</p>
                      </div>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-primary ml-auto shrink-0" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right — Quiz Panel */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <div className="glass rounded-2xl border border-border p-5 h-full flex flex-col min-h-[500px] relative overflow-hidden">
            {/* Domain glow */}
            {activeDomain && (
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${activeDomain.color} opacity-5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none`} />
            )}

            <div className="flex items-center gap-2 mb-5 relative z-10">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-3.5 h-3.5 text-primary" />
              </div>
              <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
                {activeDomain ? "2. Interactive Quiz" : "Select a Domain"}
              </h2>
              {selectedDifficulty && !quizFinished && (
                <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Q{currentQIndex + 1}/{questions.length}
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              {!activeDomain ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center opacity-60"
                >
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 border border-border">
                    <BrainCircuit className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">Choose a Domain</p>
                  <p className="text-xs text-muted-foreground">Pick an interview domain from the left panel to begin.</p>
                </motion.div>
              ) : quizFinished ? (
                // Results screen
                <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center gap-5"
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl relative ${
                    scorePercent >= 70
                      ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30"
                      : scorePercent >= 40
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30"
                      : "bg-gradient-to-br from-rose-400 to-pink-600 shadow-rose-500/30"
                  }`}>
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground mb-1">Quiz Complete!</h2>
                    <p className="text-muted-foreground text-sm mb-3">
                      Domain: <span className="font-bold text-foreground">{activeDomain.title}</span> · {selectedDifficulty}
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-xl font-black text-foreground">{score}</span>
                      <span className="text-muted-foreground font-semibold">/ {questions.length}</span>
                      <span className={`text-sm font-bold ml-1 ${scorePercent >= 70 ? "text-emerald-600 dark:text-emerald-400" : scorePercent >= 40 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                        ({scorePercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="w-full max-w-xs">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${scorePercent}%` }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${scorePercent >= 70 ? "bg-gradient-to-r from-emerald-400 to-teal-500" : scorePercent >= 40 ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-rose-400 to-pink-500"}`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 w-full max-w-xs">
                    <button
                      onClick={() => handleDifficultySelect(selectedDifficulty as string)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white font-bold text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/20 active:scale-[0.98]"
                    >
                      <RotateCcw className="w-4 h-4" /> Try Again
                    </button>
                    <button
                      onClick={() => { setSelectedDifficulty(null); setQuizFinished(false); }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-card text-muted-foreground font-bold text-sm border border-border hover:text-foreground hover:border-primary/30 transition-all"
                    >
                      Change Difficulty
                    </button>
                    <button
                      onClick={() => { setSelectedDomain(null); setSelectedDifficulty(null); setQuizFinished(false); }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-card text-muted-foreground font-bold text-sm border border-border hover:text-foreground hover:border-primary/30 transition-all"
                    >
                      Choose New Domain
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col relative z-10">
                  {/* Domain header */}
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/60">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${activeDomain.color} flex items-center justify-center shadow-lg shrink-0`}>
                      <activeDomain.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground">{activeDomain.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedDifficulty ? `${selectedDifficulty} Level · ${questions.length} Questions` : "Select difficulty to start"}
                      </p>
                    </div>
                  </div>

                  {/* Difficulty selector */}
                  <div className="flex gap-2 mb-5">
                    {difficulties.map((diff) => {
                      const isActive = selectedDifficulty === diff.level;
                      return (
                        <button
                          key={diff.level}
                          onClick={() => handleDifficultySelect(diff.level)}
                          className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all ${
                            isActive
                              ? diff.activeBg
                              : `bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground`
                          }`}
                        >
                          {diff.level}
                        </button>
                      );
                    })}
                  </div>

                  {/* No difficulty yet */}
                  {!selectedDifficulty && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                      <Target className="w-12 h-12 text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground font-medium">Select a difficulty level above to start the quiz.</p>
                    </div>
                  )}

                  {/* Active quiz */}
                  {selectedDifficulty && !quizFinished && currentQ && (
                    <div className="flex-1 flex flex-col">
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[11px] font-bold text-muted-foreground">Question {currentQIndex + 1} of {questions.length}</span>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                            Score: {score}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            animate={{ width: `${((currentQIndex) / questions.length) * 100}%` }}
                            className={`h-full rounded-full bg-gradient-to-r ${activeDomain.color}`}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                          />
                        </div>
                      </div>

                      {/* Question */}
                      <AnimatePresence mode="wait">
                        <motion.h4
                          key={currentQIndex}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="text-base font-bold text-foreground mb-5 leading-relaxed"
                        >
                          {currentQ.question}
                        </motion.h4>
                      </AnimatePresence>

                      {/* Options */}
                      <div className="space-y-2.5">
                        {currentQ.options.map((opt, i) => {
                          const isSelected = selectedOption === i;
                          const isCorrect = i === currentQ.answerIndex;
                          let cls = "bg-card border-border text-foreground hover:border-primary/40 hover:bg-primary/5 cursor-pointer";
                          let iconEl: React.ReactNode = null;

                          if (isAnswered) {
                            if (isCorrect) {
                              cls = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 cursor-default";
                              iconEl = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
                            } else if (isSelected) {
                              cls = "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 cursor-default";
                              iconEl = <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
                            } else {
                              cls = "bg-muted/30 border-border/50 text-muted-foreground opacity-50 cursor-default";
                            }
                          }

                          return (
                            <motion.button
                              key={i}
                              whileHover={!isAnswered ? { scale: 1.01 } : {}}
                              whileTap={!isAnswered ? { scale: 0.99 } : {}}
                              onClick={() => handleOptionClick(i)}
                              disabled={isAnswered}
                              className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${cls}`}
                            >
                              <span className="text-sm font-medium leading-snug">{opt}</span>
                              {iconEl}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
