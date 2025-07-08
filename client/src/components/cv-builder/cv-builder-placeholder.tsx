import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Bell, Upload, Wand2, Palette, TrendingUp } from "lucide-react";

export default function CVBuilderPlaceholder() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">AI CV Builder</h1>
        <p className="text-slate-600">Create and customize your CV with AI assistance</p>
      </div>

      {/* Coming Soon Placeholder */}
      <Card className="shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">AI CV Builder Coming Soon</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Our AI-powered CV builder will help you create professional, tailored resumes based on job requirements and your experience. 
            Features will include automatic formatting, keyword optimization, and industry-specific templates.
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-center space-y-3 md:space-y-0 md:space-x-4">
            <Button disabled>
              <Bell className="h-4 w-4 mr-2" />
              Notify Me When Available
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Existing CV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <Wand2 className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">AI-Powered Content</h4>
            <p className="text-slate-600 text-sm">
              Automatically generate job-specific content based on your experience and target positions.
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
              <Palette className="h-6 w-6 text-accent" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Professional Templates</h4>
            <p className="text-slate-600 text-sm">
              Choose from industry-specific templates designed to pass ATS systems and impress recruiters.
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Optimization Score</h4>
            <p className="text-slate-600 text-sm">
              Get real-time feedback and suggestions to improve your CV's effectiveness and keyword density.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
