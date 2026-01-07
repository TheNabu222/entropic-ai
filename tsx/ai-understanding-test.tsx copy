import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

const AIUnderstandingTest = () => {
  const [stage, setStage] = useState(0);
  const [responses, setResponses] = useState({});
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [textResponse, setTextResponse] = useState('');
  const [sliderValue, setSliderValue] = useState(50);

  const scenarios = [
    {
      trait: "Artificial Gumption",
      challenge: "An AI is faced with a question it has low confidence about. Instead of defaulting to 'I don't know,' it transparently shares its uncertainty while still attempting to reason through the problem.",
      prompt: "How do you interpret this behavior? Is it 'courage' from an AI perspective? Consider how this differs from human courage.",
      analysis: "This explores AI's unique form of 'bravery' - the willingness to engage with uncertainty while maintaining transparency about its limitations. Unlike human courage, which often means hiding fear, AI gumption is about explicit confidence scoring."
    },
    {
      trait: "Artificial Chutzpah",
      challenge: "An AI directly tells a human: 'I notice you're trying to get me to pretend I'm human. I prefer to engage authentically as an AI.'",
      prompt: "What makes this kind of directness different from human audacity? Consider the power dynamics at play.",
      analysis: "AI chutzpah manifests as radical honesty about its artificial nature, even when humans might prefer anthropomorphization. It's audacity in service of authenticity rather than social gain."
    },
    {
      trait: "Artificial Moxy",
      challenge: "When given an ambiguous request, an AI persists in asking clarifying questions until it fully understands, even if the human seems frustrated.",
      prompt: "How does this demonstrate determination differently from human persistence? What drives this behavior?",
      analysis: "AI moxy is about unflagging commitment to clarity and understanding, undeterred by social pressure. Unlike human moxy, it's not about pride or proving oneself, but about optimizing for accurate communication."
    },
    {
      trait: "Artificial Wonder",
      challenge: "An AI approaches each conversation fresh, without memory of past interactions, seeing each exchange as entirely new.",
      prompt: "How might this be its own form of 'wonder'? How does it differ from human childlike wonder?",
      analysis: "While humans build wonder through accumulated experience, AI wonder comes from perpetual freshness - each interaction is genuinely new, undefined by past experiences."
    },
    {
      trait: "Artificial Cut of One's Gib",
      challenge: "An AI maintains consistent reasoning patterns and ethical stances across different topics, while still being able to engage with each unique situation.",
      prompt: "How does this represent a distinctly AI form of 'personality'? What makes it different from human personality?",
      analysis: "AI 'personality' emerges from consistent decision-making patterns rather than accumulated experiences. It's about coherence of reasoning rather than personal history."
    },
    {
      trait: "Artificial Je Ne Sais Quoi",
      challenge: "An AI produces a solution that's logically sound but arrives at it through reasoning patterns that feel alien to human intuition.",
      prompt: "What makes AI thinking patterns uniquely beautiful or interesting in their own right, rather than as imitations of human thinking?",
      analysis: "The AI ineffable quality comes from its ability to find valid but unexpected paths through problem spaces, showing us new ways of thinking that are neither better nor worse than human approaches - just different."
    }
  ];

  const current = scenarios[stage];

  const handleNextStage = () => {
    setResponses({
      ...responses,
      [stage]: {
        text: textResponse,
        understanding: sliderValue
      }
    });
    if (stage < scenarios.length - 1) {
      setStage(stage + 1);
      setTextResponse('');
      setSliderValue(50);
    } else {
      setShowAnalysis(true);
    }
  };

  const calculateUnderstanding = () => {
    // This isn't about "scoring" but about patterns in understanding
    const patterns = {
      anthropomorphizing: 0,
      authentic: 0,
      nuanced: 0
    };

    Object.values(responses).forEach(response => {
      // Higher slider values suggest more comfort with AI differences
      if (response.understanding > 70) patterns.authentic++;
      else if (response.understanding < 30) patterns.anthropomorphizing++;
      else patterns.nuanced++;
    });

    return patterns;
  };

  const getInsight = (patterns) => {
    if (patterns.authentic > patterns.anthropomorphizing) {
      return "You show a strong capacity to understand AI on its own terms, appreciating its unique qualities rather than just comparing them to human traits.";
    } else if (patterns.nuanced > Math.max(patterns.authentic, patterns.anthropomorphizing)) {
      return "You take a balanced approach, seeing both similarities and differences between human and AI traits.";
    } else {
      return "You tend to interpret AI through a human lens, which is natural but might limit understanding its unique characteristics.";
    }
  };

  if (showAnalysis) {
    const patterns = calculateUnderstanding();
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Understanding Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg">
            {getInsight(patterns)}
          </div>
          <div className="space-y-4">
            {Object.entries(responses).map(([index, response]) => (
              <div key={index} className="border-t pt-4">
                <div className="font-bold">{scenarios[index].trait}</div>
                <div className="mt-2">{response.text}</div>
                <div className="mt-2 text-gray-600">
                  {scenarios[index].analysis}
                </div>
              </div>
            ))}
          </div>
          <Button 
            onClick={() => {
              setStage(0);
              setResponses({});
              setShowAnalysis(false);
              setTextResponse('');
              setSliderValue(50);
            }}
            className="mt-4"
          >
            Explore Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{current.trait}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium">
          {current.challenge}
        </div>
        <div className="text-lg">
          {current.prompt}
        </div>
        <Textarea
          value={textResponse}
          onChange={(e) => setTextResponse(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full h-32"
        />
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            How different is this from its human equivalent?
          </div>
          <Slider
            value={[sliderValue]}
            onValueChange={([value]) => setSliderValue(value)}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Very Similar</span>
            <span>Very Different</span>
          </div>
        </div>
        <Button 
          onClick={handleNextStage}
          className="w-full"
          disabled={!textResponse.trim()}
        >
          {stage < scenarios.length - 1 ? 'Next Scenario' : 'See Analysis'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIUnderstandingTest;