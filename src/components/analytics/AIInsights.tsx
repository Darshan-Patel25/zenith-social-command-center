import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Users, Clock, Target, Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIInsight {
  id: string;
  type: 'performance' | 'audience' | 'content' | 'timing' | 'strategy';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendation?: string;
}

interface AIInsightsProps {
  analyticsData?: any;
  postsData?: any[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ analyticsData, postsData = [] }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <TrendingUp className="h-4 w-4" />;
      case 'audience':
        return <Users className="h-4 w-4" />;
      case 'timing':
        return <Clock className="h-4 w-4" />;
      case 'strategy':
        return <Target className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generateInsights = async () => {
    setIsGenerating(true);
    
    try {
      // Prepare data context for AI analysis
      const contextData = {
        totalPosts: postsData.length,
        platforms: [...new Set(postsData.map(p => p.platform))],
        avgEngagement: postsData.reduce((acc, post) => acc + (post.engagement || 0), 0) / postsData.length || 0,
        recentPosts: postsData.slice(-10),
        topPerformingPosts: postsData.sort((a, b) => (b.engagement || 0) - (a.engagement || 0)).slice(0, 5)
      };

      const prompt = `
        Analyze the following social media performance data and provide actionable insights:
        
        Total Posts: ${contextData.totalPosts}
        Platforms: ${contextData.platforms.join(', ')}
        Average Engagement: ${contextData.avgEngagement.toFixed(2)}
        
        Recent Posts Performance: ${JSON.stringify(contextData.recentPosts.map(p => ({
          content: p.content?.substring(0, 100),
          platform: p.platform,
          engagement: p.engagement || 0,
          created_at: p.created_at
        })))}
        
        Top Performing Posts: ${JSON.stringify(contextData.topPerformingPosts.map(p => ({
          content: p.content?.substring(0, 100),
          platform: p.platform,
          engagement: p.engagement || 0
        })))}
        
        Provide 5-7 specific, actionable insights in JSON format with the following structure:
        {
          "insights": [
            {
              "type": "performance|audience|content|timing|strategy",
              "title": "Short insight title",
              "description": "Detailed description of the insight",
              "impact": "high|medium|low",
              "actionable": true|false,
              "recommendation": "Specific actionable recommendation"
            }
          ]
        }
        
        Focus on content optimization, posting times, audience engagement patterns, and growth strategies.
      `;

      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: {
          prompt,
          platform: 'general',
          tone: 'professional',
          contentType: 'analysis',
          length: 'long'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.content) {
        try {
          // Try to parse JSON from the AI response
          const jsonMatch = data.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0]);
            if (parsedData.insights) {
              const insightsWithIds = parsedData.insights.map((insight: any, index: number) => ({
                ...insight,
                id: `insight-${index}-${Date.now()}`
              }));
              setInsights(insightsWithIds);
            } else {
              throw new Error('Invalid insights format');
            }
          } else {
            // Fallback: create insights from text response
            const fallbackInsights: AIInsight[] = [
              {
                id: 'fallback-1',
                type: 'content',
                title: 'AI Analysis Complete',
                description: data.content,
                impact: 'medium',
                actionable: true,
                recommendation: 'Review the analysis and implement suggested improvements.'
              }
            ];
            setInsights(fallbackInsights);
          }
        } catch (parseError) {
          // Fallback for non-JSON responses
          const fallbackInsights: AIInsight[] = [
            {
              id: 'fallback-1',
              type: 'strategy',
              title: 'AI Recommendations',
              description: data.content,
              impact: 'medium',
              actionable: true,
              recommendation: 'Consider implementing these AI-generated recommendations.'
            }
          ];
          setInsights(fallbackInsights);
        }

        toast({
          title: "Insights Generated",
          description: "AI has analyzed your performance data and generated insights.",
        });
      } else {
        throw new Error('No insights generated');
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI-Powered Insights
          </CardTitle>
          <Button 
            onClick={generateInsights}
            disabled={isGenerating || postsData.length === 0}
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Insights
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Get AI-powered insights about your social media performance
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {postsData.length === 0 
                ? "Create some posts first to get meaningful insights"
                : "Click 'Generate Insights' to analyze your content performance"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-medium">{insight.title}</h4>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact} impact
                    </Badge>
                    {insight.actionable && (
                      <Badge variant="outline">Actionable</Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {insight.description}
                </p>
                
                {insight.recommendation && (
                  <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded-r">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      💡 Recommendation:
                    </p>
                    <p className="text-sm text-blue-800">
                      {insight.recommendation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;