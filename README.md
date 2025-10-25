# Proctor AI - Your Personal AI Mock Interviewer
<div align="center">Stop rehearsing lines, start having conversations. Proctor AI is a cutting-edge platform where you practice mock interviews with a realistic, conversational AI that adapts to your responses, just like a human interviewer. Built for developers by a developer, it's the tool I needed to conquer interview anxiety.
</div>

## <div align="center"></div>🔴 Live Demo

https://proctor-ai-gold.vercel.app/

*Proctor AI* tackles a common pain point: the lack of realistic, interactive interview practice. This full-stack application simulates technical interviews using *Google Gemini* for conversational AI, real-time voice interaction via the *Web Speech API*, and provides detailed performance feedback. It's designed to help you communicate your technical knowledge effectively under pressure.

## ✨ Key Features

- 🗣️**Dynamic Conversational AI**: Engages in natural, unscripted interviews, asking relevant follow-up questions based on your spoken answers.

- 🛠️ **Tailored Practice Sessions**: Customize interviews by tech stack, experience level, and duration to precisely match target roles.

- 🎙️ **Seamless Voice Interaction**: Real-time Speech-to-Text & Text-to-Speech using robust browser APIs and manual controls for a smooth experience.

- 📝 **Insightful AI Feedback**: Receive a detailed, asynchronous report analyzing technical accuracy, problem-solving, and communication clarity.

- 📜 **Performance History**: Track progress and revisit past interview feedback via a personalized dashboard.

- 🔐 **Secure & Stateful**: JWT-based authentication protects user data and maintains session state across the platform.

## 🚀 Technical Architecture & Decisions
Proctor AI employs a modern, decoupled architecture designed for real-time interaction and scalability.

| Component | Technology Choice | Rationale |
|---|---|---|
| Frontend | Next.js (TypeScript), React, Tailwind CSS | Optimal performance (SSR/SSG), type safety, rapid UI development, excellent developer experience. |
| Backend | Java 21+, Spring Boot 3 | Robustness, scalability, strong typing, mature ecosystem ideal for complex business logic & security. |
| Database | PostgreSQL | Reliability, ACID compliance, powerful querying capabilities for structured user & session data. |
| Real-time API | WebSockets (STOMP over SockJS) with Spring for WebSocket | Low-latency, bidirectional communication essential for the live conversational engine. |
| AI Engine | Google Gemini API | Powerful conversational capabilities, prompt flexibility, JSON mode for structured feedback. |
| Deployment | Docker, Render (Backend), Vercel (Frontend) | Modern, cost-effective (free tier), CI/CD-friendly cloud platforms suitable for full-stack apps. |
| Security | Spring Security (JWT) | Stateless, standard-based authentication suitable for distributed systems. |
| Voice I/O | Browser Web Speech API | Native browser capability for STT/TTS, eliminating external dependencies for core voice features. |

## 💡 Challenges & Learnings
Building Proctor AI involved tackling several interesting technical challenges:

- **Real-time Synchronization**: Ensuring low latency between user speech, AI processing, and AI speech required careful management of WebSocket connections and asynchronous processing.

- **Production Race Conditions**: Debugging subtle differences between development (Strict Mode) and production builds, especially regarding useEffect timing for WebSocket connections. The final solution involved separating connection and Reference hooks.

- **Web Speech API Reliability**: Handling the quirks and browser inconsistencies of the experimental Speech Recognition API required robust error handling and manual user controls (start/stop).

- **Prompt Engineering**: Iteratively refining prompts for the Gemini API to elicit consistent, relevant questions and structured JSON feedback was key to the AI's effectiveness.

## ⚙️ Getting Started Locally

### Prerequisites
- Java JDK 17+ (e.g., OpenJDK 21)
- Apache Maven
- Node.js (v18+) & npm/pnpm
- PostgreSQL Instance (Local or Cloud - e.g., Supabase free tier)
- Google Gemini API Key

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/Animesh606/Proctor-AI.git
cd Proctor-AI/backend

# Create a PostgreSQL database (e.g., named 'Proctorai')

# Configure database, Gemini key, and frontend URL in:
# `src/main/resources/application.properties`

# Build and run
mvn spring-boot:run
```
*(Backend runs on http://localhost:8080)*

### 2. Frontend Setup
```bash
# Navigate to the frontend directory in a new terminal
cd ../frontend

# Install dependencies
npm install

# Create `.env.local` file in 'frontend' root
# Add: NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# Run the development server
npm run dev
```
*(Frontend runs on http://localhost:3000)*

## 🔮 Future Scope
- **Coding Integration**: Add a shared code editor for technical coding rounds.

- **Video Recording & Analysis**: Allow users to record their video feed and use AI to analyze body language and engagement.

- **Performance Metrics**: Track user progress over time with charts and statistics.

## 📜 License
This project is licensed under the MIT License.

## 👨‍💻 Author
A personal portfolio project by Animesh Bag.

LinkedIn: https://www.linkedin.com/in/animesh-bag-6300561a0/

GitHub: https://github.com/Animesh606