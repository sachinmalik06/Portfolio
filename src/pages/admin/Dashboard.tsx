import { useExpertiseCards, useTimeline } from "@/hooks/use-cms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Layers, Clock, FileText, ArrowRight, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router";
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function Dashboard() {
  const { data: expertiseCards, isLoading: cardsLoading } = useExpertiseCards();
  const { data: timeline, isLoading: timelineLoading } = useTimeline();

  // Mock data for the chart
  const chartData = [
    { month: "Jan", visits: 186, engagement: 80 },
    { month: "Feb", visits: 305, engagement: 200 },
    { month: "Mar", visits: 237, engagement: 120 },
    { month: "Apr", visits: 73, engagement: 190 },
    { month: "May", visits: 209, engagement: 130 },
    { month: "Jun", visits: 214, engagement: 140 },
  ];

  const chartConfig = {
    visits: {
      label: "Visits",
      color: "hsl(var(--primary))",
    },
    engagement: {
      label: "Engagement",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your portfolio's performance and content.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/">
            <Button className="shadow-glow">
              View Live Site
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-white/5 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expertise Cards</CardTitle>
            <Layers className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cardsLoading ? "..." : (expertiseCards?.length || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Active service offerings</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-white/5 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Timeline Entries</CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{timelineLoading ? "..." : (timeline?.length || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Career milestones recorded</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pages</CardTitle>
            <FileText className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Managed content pages</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <Card className="col-span-1 lg:col-span-2 bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
            <CardDescription>Site activity over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-visits)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-visits)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-engagement)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-engagement)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="var(--color-visits)" 
                    fillOpacity={1} 
                    fill="url(#colorVisits)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="var(--color-engagement)" 
                    fillOpacity={1} 
                    fill="url(#colorEngagement)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link to="/admin/expertise">
              <Button variant="outline" className="w-full justify-start h-auto py-4 border-white/10 hover:bg-white/5 group">
                <div className="bg-primary/10 p-2 rounded mr-4 group-hover:bg-primary/20 transition-colors">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Manage Expertise</div>
                  <div className="text-xs text-muted-foreground">Add or edit services</div>
                </div>
              </Button>
            </Link>
            <Link to="/admin/timeline">
              <Button variant="outline" className="w-full justify-start h-auto py-4 border-white/10 hover:bg-white/5 group">
                <div className="bg-primary/10 p-2 rounded mr-4 group-hover:bg-primary/20 transition-colors">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Update Timeline</div>
                  <div className="text-xs text-muted-foreground">Add milestones</div>
                </div>
              </Button>
            </Link>
            <Link to="/admin/pages">
              <Button variant="outline" className="w-full justify-start h-auto py-4 border-white/10 hover:bg-white/5 group">
                <div className="bg-primary/10 p-2 rounded mr-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Edit Pages</div>
                  <div className="text-xs text-muted-foreground">Update content</div>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}