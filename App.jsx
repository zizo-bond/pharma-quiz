// src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar'; // 1. استيراد المكون الجديد
import HomePage from './components/HomePage';
import TopicSelection from './components/TopicSelection';
import Quiz from './components/Quiz';
import './index.css';

function App() {
  const [view, setView] = useState('home'); // 'home', 'topics', 'quiz'
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/questions.json')
      .then(res => res.json())
      .then(data => {
        setAllQuizzes(data.quizzes);
        setIsLoading(false);
      })
      .catch(err => console.error("Failed to fetch quizzes:", err));
  }, []);

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setView('quiz');
  };

  const handleBackToTopics = () => {
    setSelectedQuiz(null);
    setView('topics');
  };

  // 2. دالة جديدة لتغيير العرض وتمريرها إلى Navbar
  const handleNavigation = (newView) => {
    // إذا كان المستخدم في اختبار، ونقر على "الاختبارات"، أعده إلى قائمة المواضيع
    if (view === 'quiz' && newView === 'topics') {
        setSelectedQuiz(null);
    }
    setView(newView);
  }

  // دالة لعرض المحتوى بناءً على الحالة
  const renderCurrentView = () => {
    if (isLoading) {
      return <div className="app-loader"><h1>Loading...</h1></div>;
    }

    switch (view) {
      case 'home':
        return <HomePage onStartClick={() => setView('topics')} />;
      case 'topics':
        return <TopicSelection quizzes={allQuizzes} onQuizSelect={handleQuizSelect} />;
      case 'quiz':
        return <Quiz selectedQuiz={selectedQuiz} onBackToTopics={handleBackToTopics} />;
      default:
        return <HomePage onStartClick={() => setView('topics')} />;
    }
  };

  // 3. تحديث هيكل العرض الرئيسي
  return (
    <div className="app-layout">
      <Navbar onNavigate={handleNavigation} />
      <main className="content-container">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;