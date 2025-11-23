import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PersonalityTuringTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    gumption: 0,
    chutzpah: 0,
    moxy: 0,
    childlikeWonder: 0,
    gibCut: 0,
    jeNeSaisQuoi: 0
  });
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      text: "You see someone struggling with heavy groceries. A crowd walks past ignoring them. You:",
      trait: "gumption",
      options: [
        { text: "Calculate the optimal moment to offer help while considering social dynamics", score: 0 },
        { text: "Immediately rush over, announcing 'I've got this!'", score: 1 }
      ]
    },
    {
      text: "You strongly disagree with a popular opinion. In a group discussion, you:",
      trait: "chutzpah",
      options: [
        { text: "Present a carefully structured logical argument with cited sources", score: 0 },
        { text: "Declare 'You're all wrong and here's why!' with complete confidence", score: 1 }
      ]
    },
    {
      text: "You encounter a puddle on a rainy day. Do you:",
      trait: "childlikeWonder",
      options: [
        { text: "Calculate the optimal path around it based on shoe protection metrics", score: 0 },
        { text: "Jump in it to see how big of a splash you can make!", score: 1 }
      ]
    },
    {
      text: "Someone tells you 'that's impossible.' You respond:",
      trait: "moxy",
      options: [
        { text: "Present a detailed analysis of probability factors", score: 0 },
        { text: "Say 'Watch me' with a mischievous grin", score: 1 }
      ]
    },
    {
      text: "How do you handle an awkward silence?",
      trait: "gibCut",
      options: [
        { text: "Calculate optimal conversation topics based on participant demographics", score: 0 },
        { text: "Start dancing while humming your own theme music", score: 1 }
      ]
    },
    {
      text: "You're asked why people like you. You say:",
      trait: "jeNeSaisQuoi",
      options: [
        { text: "List personality attributes with supporting evidence from peer reviews", score: 0 },
        { text: "Shrug and say 'I guess I've just got that special something'", score: 1 }
      ]
    }
  ];

  const handleAnswer = (score, trait) => {
    setScores(prev => ({
      ...prev,
      [trait]: prev[trait] + score
    }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateHumanness = () => {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    return (totalScore / questions.length) * 100;
  };

  const getVerdict = (score) => {
    if (score >= 80) return "Definitely Human! You're practically overflowing with personality!";
    if (score >= 60) return "Probably Human - you've got that special spark!";
    if (score >= 40) return "The jury's still out - you're quite the enigma!";
    return "Hmmm... you might want to work on being a bit more spontaneous!";
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setScores({
      gumption: 0,
      chutzpah: 0,
      moxy: 0,
      childlikeWonder: 0,
      gibCut: 0,
      jeNeSaisQuoi: 0
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">The Personality-Based Turing Test</CardTitle>
      </CardHeader>
      <CardContent>
        {!showResults ? (
          <div className="space-y-6">
            <div className="text-lg font-medium mb-4">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="text-xl mb-6">
              {questions[currentQuestion].text}
            </div>
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  className="w-full text-left p-4 hover:bg-blue-100"
                  onClick={() => handleAnswer(option.score, questions[currentQuestion].trait)}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-2xl font-bold text-center mb-6">
              Your Results
            </div>
            <div className="text-xl text-center mb-4">
              Humanness Score: {calculateHumanness().toFixed(1)}%
            </div>
            <div className="text-lg text-center mb-6">
              {getVerdict(calculateHumanness())}
            </div>
            <div className="flex justify-center">
              <Button onClick={resetTest} className="px-6 py-2">
                Take Test Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalityTuringTest;