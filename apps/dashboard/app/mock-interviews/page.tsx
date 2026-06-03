"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  PlayCircle,
  Video,
  FileQuestion,
  Sparkles,
  ChevronRight,
  Code2,
  BrainCircuit,
  Cpu,
  Terminal,
  GitBranch,
  Layers,
  Coffee,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Server,
  FileCode,
  Database,
  Network,
  Cloud
} from "lucide-react";

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
};

export default function MockInterviewsPage() {
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Quiz State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const domains = [
    { id: 0, title: "Java", icon: Coffee, color: "from-orange-500 to-red-600", activeClasses: "bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/10", btnHover: "hover:bg-orange-500/10 hover:border-orange-500/40", btnActive: "bg-orange-500/20 border-orange-500/60 text-orange-400", description: "Core Java, JVM, Multithreading, and Spring Boot." },
    { id: 1, title: "Artificial Intelligence", icon: BrainCircuit, color: "from-violet-600 to-fuchsia-600", activeClasses: "bg-violet-500/10 border-violet-500/50 shadow-lg shadow-violet-500/10", btnHover: "hover:bg-violet-500/10 hover:border-violet-500/40", btnActive: "bg-violet-500/20 border-violet-500/60 text-violet-400", description: "Neural Networks, NLP, Computer Vision, and AI ethics." },
    { id: 2, title: "Machine Learning", icon: Cpu, color: "from-blue-600 to-indigo-600", activeClasses: "bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10", btnHover: "hover:bg-blue-500/10 hover:border-blue-500/40", btnActive: "bg-blue-500/20 border-blue-500/60 text-blue-400", description: "Supervised/Unsupervised learning, models, and optimization." },
    { id: 3, title: "C & C++", icon: Terminal, color: "from-slate-600 to-slate-800", activeClasses: "bg-slate-500/10 border-slate-500/50 shadow-lg shadow-slate-500/10", btnHover: "hover:bg-slate-500/10 hover:border-slate-500/40", btnActive: "bg-slate-500/30 border-slate-500/60 text-slate-300", description: "Pointers, memory management, OOP, and STL." },
    { id: 4, title: "DAA (Algorithms)", icon: GitBranch, color: "from-emerald-600 to-teal-600", activeClasses: "bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10", btnHover: "hover:bg-emerald-500/10 hover:border-emerald-500/40", btnActive: "bg-emerald-500/20 border-emerald-500/60 text-emerald-400", description: "Design and Analysis of Algorithms, time complexity." },
    { id: 5, title: "DSA", icon: Layers, color: "from-rose-500 to-pink-600", activeClasses: "bg-rose-500/10 border-rose-500/50 shadow-lg shadow-rose-500/10", btnHover: "hover:bg-rose-500/10 hover:border-rose-500/40", btnActive: "bg-rose-500/20 border-rose-500/60 text-rose-400", description: "Data Structures and Algorithms, arrays, trees, graphs." },
    { id: 6, title: "React", icon: Code2, color: "from-cyan-500 to-blue-600", activeClasses: "bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10", btnHover: "hover:bg-cyan-500/10 hover:border-cyan-500/40", btnActive: "bg-cyan-500/20 border-cyan-500/60 text-cyan-400", description: "Hooks, Virtual DOM, state management, and routing." },
    { id: 7, title: "Node.js", icon: Server, color: "from-green-500 to-emerald-700", activeClasses: "bg-green-500/10 border-green-500/50 shadow-lg shadow-green-500/10", btnHover: "hover:bg-green-500/10 hover:border-green-500/40", btnActive: "bg-green-500/20 border-green-500/60 text-green-400", description: "Event loop, Express, REST APIs, and middleware." },
    { id: 8, title: "Python", icon: FileCode, color: "from-yellow-400 to-blue-600", activeClasses: "bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/10", btnHover: "hover:bg-yellow-500/10 hover:border-yellow-500/40", btnActive: "bg-yellow-500/20 border-yellow-500/60 text-yellow-400", description: "Data types, decorators, Django, and scripting." },
    { id: 9, title: "SQL", icon: Database, color: "from-blue-400 to-cyan-600", activeClasses: "bg-blue-400/10 border-blue-400/50 shadow-lg shadow-blue-400/10", btnHover: "hover:bg-blue-400/10 hover:border-blue-400/40", btnActive: "bg-blue-400/20 border-blue-400/60 text-blue-400", description: "Queries, joins, indexing, and normalization." },
    { id: 10, title: "System Design", icon: Network, color: "from-indigo-500 to-purple-600", activeClasses: "bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10", btnHover: "hover:bg-indigo-500/10 hover:border-indigo-500/40", btnActive: "bg-indigo-500/20 border-indigo-500/60 text-indigo-400", description: "Scalability, microservices, load balancing, caching." },
    { id: 11, title: "DevOps", icon: Cloud, color: "from-sky-500 to-blue-700", activeClasses: "bg-sky-500/10 border-sky-500/50 shadow-lg shadow-sky-500/10", btnHover: "hover:bg-sky-500/10 hover:border-sky-500/40", btnActive: "bg-sky-500/20 border-sky-500/60 text-sky-400", description: "CI/CD, Docker, Kubernetes, and AWS basics." },
  ];

  const difficulties = [
    { level: "Easy" },
    { level: "Medium" },
    { level: "Hard" },
  ];

  const generateQuestions = (domain: string, diff: string): Question[] => {
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
        { question: "Who invented Java Programming?", options: ["Guido van Rossum", "James Gosling", "Dennis Ritchie", "Bjarne Stroustrup"], answerIndex: 1 }
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
        { question: "Which metric is used for regression problems?", options: ["Accuracy", "F1 Score", "Mean Squared Error", "Precision"], answerIndex: 2 }
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
        { question: "What does 'deep' in Deep Learning refer to?", options: ["Deep understanding of math", "Multiple hidden layers in the network", "Deep memory usage", "High complexity"], answerIndex: 1 }
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
        { question: "What does STL stand for in C++?", options: ["Standard Template Library", "System Type Library", "Standard Type Language", "Syntax Tree Logic"], answerIndex: 0 }
      ];
    } else if (domain === "DAA (Algorithms)") {
      return [
        { question: "Which of the following sorting algorithms has the best average-case time complexity?", options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], answerIndex: 2 },
        { question: "What is the worst-case time complexity of Quick Sort?", options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"], answerIndex: 2 },
        { question: "Which algorithm paradigm is used in Dijkstra's shortest path?", options: ["Divide and Conquer", "Dynamic Programming", "Greedy Algorithm", "Backtracking"], answerIndex: 2 },
        { question: "Which problem can be solved using Dynamic Programming?", options: ["Binary Search", "Fibonacci Series", "Bubble Sort", "Linear Search"], answerIndex: 1 },
        { question: "What is the primary difference between DP and Divide & Conquer?", options: ["DP uses recursion only", "DP handles overlapping subproblems", "D&C is always faster", "They are the same"], answerIndex: 1 },
        { question: "Which algorithm is used for finding the Minimum Spanning Tree?", options: ["Kruskal's Algorithm", "Floyd-Warshall", "Bellman-Ford", "DFS"], answerIndex: 0 },
        { question: "The Knapsack problem belongs to which category?", options: ["P", "NP-Complete", "NP-Hard", "Depends on variations"], answerIndex: 3 },
        { question: "Which notation defines an upper bound of an algorithm's time complexity?", options: ["Big-O", "Big-Omega", "Big-Theta", "Little-o"], answerIndex: 0 },
        { question: "What is the time complexity of Binary Search?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], answerIndex: 2 },
        { question: "Which algorithm is commonly used for string matching?", options: ["KMP Algorithm", "Prim's Algorithm", "Huffman Coding", "Ford-Fulkerson"], answerIndex: 0 }
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
        { question: "What is context API used for?", options: ["Routing", "Managing local state", "Passing data deeply without prop drilling", "Server-side rendering"], answerIndex: 2 }
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
        { question: "How does Node.js handle concurrency?", options: ["Multi-threading", "Multiple processes", "Single-threaded event loop", "Parallel execution"], answerIndex: 2 }
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
        { question: "What is the output of 3 // 2 in Python 3?", options: ["1.5", "1", "2", "Error"], answerIndex: 1 }
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
        { question: "What does ACID stand for in databases?", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Complete, Isolated, Data", "Auto, Commit, Insert, Delete", "Atomic, Caching, Indexing, Direct"], answerIndex: 0 }
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
        { question: "What is a message queue useful for?", options: ["Storing static files", "Decoupling services and handling asynchronous processing", "Replacing databases", "Managing DNS"], answerIndex: 1 }
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
        { question: "Which AWS service is commonly used for scalable object storage?", options: ["EC2", "RDS", "S3", "Lambda"], answerIndex: 2 }
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
        { question: "A graph with no cycles is called?", options: ["Cyclic graph", "Acyclic graph", "Complete graph", "Bipartite graph"], answerIndex: 1 }
      ];
    }
  };

  const handleQuickPractice = () => {
    const randomDomainIndex = Math.floor(Math.random() * domains.length);
    const randomDifficultyIndex = Math.floor(Math.random() * difficulties.length);
    
    const domain = domains[randomDomainIndex];
    const difficultyObj = difficulties[randomDifficultyIndex];
    if (!domain || !difficultyObj) return;

    const difficulty = difficultyObj.level;
    
    setSelectedDomain(randomDomainIndex);
    setSelectedDifficulty(difficulty);
    setQuestions(generateQuestions(domain.title, difficulty));
    setCurrentQIndex(0);
    setScore(0);
    setQuizFinished(false);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const handleDifficultySelect = (diff: string) => {
    setSelectedDifficulty(diff);
    if (selectedDomain !== null) {
      const dom = domains[selectedDomain];
      if (dom) {
        setQuestions(generateQuestions(dom.title, diff));
        setCurrentQIndex(0);
        setScore(0);
        setQuizFinished(false);
        setIsAnswered(false);
        setSelectedOption(null);
      }
    }
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    const currentQ = questions[currentQIndex];
    if (!currentQ) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQ.answerIndex) {
      setScore((prev) => prev + 1);
    }

    // Auto-advance after 1.2 seconds so user can see the right/wrong answer
    setTimeout(() => {
      setCurrentQIndex((prevIndex) => {
        if (prevIndex < questions.length - 1) {
          setIsAnswered(false);
          setSelectedOption(null);
          return prevIndex + 1;
        } else {
          setQuizFinished(true);
          return prevIndex;
        }
      });
    }, 1200);
  };

  const activeDomain = selectedDomain !== null ? domains[selectedDomain] : null;
  const currentQ = questions[currentQIndex];

  return (
    <div className="p-8 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-violet-400" />
            <h1 className="text-2xl font-bold text-white">Practice & Mock Interviews</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Select a domain and difficulty to start an interactive multiple-choice quiz.
          </p>
        </div>

        <button 
          onClick={handleQuickPractice}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <PlayCircle className="w-4 h-4" /> Quick Practice
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 w-full">
        {/* Left Column: Domains Grid */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-violet-400" /> 1. Choose Domain
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {domains.map((domain, index) => (
                <div
                  key={domain.id}
                  onClick={() => {
                    setSelectedDomain(index);
                    setSelectedDifficulty(null);
                  }}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden group ${
                    selectedDomain === index
                      ? domain.activeClasses
                      : "bg-[#0e1424]/90 border-slate-800/60 hover:border-slate-600/50 hover:bg-slate-800/40"
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${domain.color} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-20`} />
                  
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <domain.icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <h3 className="text-white font-bold text-sm mb-1">{domain.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2 h-8">
                    {domain.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Difficulty & Quiz Area */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden flex flex-col h-full min-h-[400px]">
            {activeDomain && (
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${activeDomain.color} opacity-5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-colors duration-500`} />
            )}
            
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" /> {activeDomain ? "2. Interactive Quiz" : "Select a domain first"}
            </h2>

            {!activeDomain ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                 <BrainCircuit className="w-12 h-12 text-slate-500 mb-3" />
                 <p className="text-slate-400 text-sm">Choose an interview domain from the left to continue.</p>
               </div>
            ) : (
              <div className="flex-1 flex flex-col relative z-10">
                
                {/* Domain Header */}
                {!quizFinished && (
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-800/50">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeDomain.color} flex items-center justify-center shadow-lg`}>
                      <activeDomain.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{activeDomain.title}</h3>
                      <p className="text-slate-400 text-sm mt-0.5">
                        {selectedDifficulty ? "Quiz active" : "Select difficulty level"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Difficulty Selector Row (Always visible unless finished) */}
                {!quizFinished && (
                  <div className="flex gap-3 mb-6">
                    {difficulties.map((diff) => {
                      const isSelected = selectedDifficulty === diff.level;
                      const baseClass = "flex-1 py-2.5 px-3 rounded-xl border font-bold text-sm transition-all text-center cursor-pointer";
                      const unselectedClass = `text-slate-400 bg-slate-950/40 border-slate-800/60 ${activeDomain.btnHover} hover:text-slate-300`;

                      return (
                        <button
                          key={diff.level}
                          onClick={() => handleDifficultySelect(diff.level)}
                          className={`${baseClass} ${isSelected ? activeDomain.btnActive : unselectedClass}`}
                        >
                          {diff.level}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* State 1: Choose Difficulty (Wait for selection) */}
                {!selectedDifficulty && !quizFinished && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                    <CheckCircle2 className="w-12 h-12 text-slate-600 mb-3" />
                    <p className="text-slate-400 text-sm">Select a difficulty above to start the quiz.</p>
                  </div>
                )}

                {/* State 2: Active Quiz */}
                {selectedDifficulty && !quizFinished && currentQ && (
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Question {currentQIndex + 1} of {questions.length}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                        Score: {score}
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-white mb-6 leading-relaxed">
                      {currentQ.question}
                    </h4>

                    <div className="space-y-3 mb-6">
                      {currentQ.options.map((opt, i) => {
                        const isSelected = selectedOption === i;
                        const isCorrect = i === currentQ.answerIndex;
                        
                        let optStyle = "bg-slate-950/40 border-slate-700/60 text-slate-300 hover:border-violet-500/50 hover:bg-violet-500/5";
                        let Icon = null;

                        if (isAnswered) {
                          if (isCorrect) {
                            optStyle = "bg-emerald-500/10 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/10";
                            Icon = CheckCircle2;
                          } else if (isSelected && !isCorrect) {
                            optStyle = "bg-rose-500/10 border-rose-500/50 text-rose-300 shadow-md shadow-rose-500/10";
                            Icon = XCircle;
                          } else {
                            optStyle = "bg-slate-950/20 border-slate-800/40 text-slate-500 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => handleOptionClick(i)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${optStyle}`}
                          >
                            <span className="text-sm font-medium">{opt}</span>
                            {Icon && <Icon className="w-5 h-5" />}
                          </button>
                        );
                      })}
                    </div>


                  </div>
                )}

                {/* State 3: Quiz Finished */}
                {quizFinished && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h2>
                      <p className="text-slate-400">
                        You scored <strong className="text-emerald-400 text-lg">{score}</strong> out of {questions.length}.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-800/50 w-full flex flex-col gap-3">
                      <button 
                        onClick={() => handleDifficultySelect(selectedDifficulty as string)}
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-violet-600/20"
                      >
                        <RotateCcw className="w-4 h-4" /> Try Again
                      </button>
                      <button 
                        onClick={() => setSelectedDifficulty(null)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm px-5 py-3 rounded-xl transition-all"
                      >
                        Choose Different Difficulty
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
