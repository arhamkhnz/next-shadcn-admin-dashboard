/* eslint-disable complexity */

"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEmailMarketingStore } from "@/stores/admin-dashboard/email-marketing-store";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Template name must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  content: z.string().min(10, {
    message: "Template content must be at least 10 characters.",
  }),
});

interface TemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: any;
}

export function TemplateEditor({ open, onOpenChange, template }: TemplateEditorProps) {
  const { createTemplate, updateTemplate } = useEmailMarketingStore();
  const [previewContent, setPreviewContent] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name ?? "",
      category: template?.category ?? "",
      content: template?.content ?? "",
    },
  });

  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name ?? "",
        category: template.category ?? "",
        content: template.content ?? "",
      });
    }
  }, [template, form]);

  useEffect(() => {
    const content = form.watch("content");
    setPreviewContent(content);
  }, [form.watch("content")]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (template) {
        await updateTemplate({
          id: template.id,
          name: values.name,
          category: values.category,
          content: values.content,
        });
        toast.success("Template updated successfully!");
      } else {
        await createTemplate({
          name: values.name,
          category: values.category,
          content: values.content,
        });
        toast.success("Template created successfully!");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save template. Please try again.");
      console.error("Error saving template:", error);
    }
  }

  const templateCategories = [
    { value: "marketing", label: "Marketing" },
    { value: "transactional", label: "Transactional" },
    { value: "onboarding", label: "Onboarding" },
    { value: "event", label: "Event" },
    { value: "engagement", label: "Engagement" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{template ? "Edit" : "Create"} Template</DialogTitle>
          <DialogDescription>
            {template ? "Make changes to your email template." : "Create a new email template for reuse in campaigns."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Welcome Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templateCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your template content here..."
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <FormLabel>Preview</FormLabel>
                  <div className="bg-muted min-h-[300px] rounded-lg border p-4">
                    {previewContent ? (
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: previewContent.replace(/\n/g, "<br />") }} />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Template preview will appear here</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{template ? "Update" : "Create"} Template</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
