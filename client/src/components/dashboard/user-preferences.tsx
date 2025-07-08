import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { insertUserPreferencesSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Loader2 } from "lucide-react";

export default function UserPreferences() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: preferences, isLoading } = useUserPreferences();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertUserPreferencesSchema.omit({ userId: true })),
    defaultValues: {
      qualifications: "",
      workExperience: "",
      jobPreferences: "",
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/user-preferences", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-preferences"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "User preferences saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save user preferences",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  // Update form values when preferences change - use useEffect to prevent infinite re-renders
  useEffect(() => {
    if (preferences && !isEditing) {
      form.reset({
        qualifications: preferences.qualifications || "",
        workExperience: preferences.workExperience || "",
        jobPreferences: preferences.jobPreferences || "",
      });
    }
  }, [preferences, isEditing]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-slate-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-24 bg-slate-200 rounded"></div>
            <div className="h-24 bg-slate-200 rounded"></div>
            <div className="h-24 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Preferences</CardTitle>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your qualifications..."
                        rows={4}
                        className="resize-none"
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Experience Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Summarize your work experience..."
                        rows={4}
                        className="resize-none"
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe your job preferences..."
                        rows={4}
                        className="resize-none"
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Save Preferences
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
