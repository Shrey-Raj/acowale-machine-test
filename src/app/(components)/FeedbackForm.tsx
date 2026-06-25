"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";      
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const categories = [
  "Product",
  "Feature request",
  "UI/UX",
  "Support",
  "Billing",
  "Other",
];

export function FeedbackForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    feedback: "",
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.category || !formData.feedback) {
      toast.error("Missing fields", {
        description: "Please select a category and write your feedback.",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formData.category,
          comments: formData.feedback,
          email: formData.email || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit feedback");
      }

      toast.success("Feedback submitted!", {
        description: "Thank you for your input.",
      });

      setFormData({ category: "", feedback: "", email: "" });
    } catch (error) {
      toast.error("Submission failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:pl-12">
      <form onSubmit={handleSubmit} className="space-y-10 relative">
        
        <div className="space-y-2">
          <label className="block text-sm tracking-wide text-neutral-300 font-light">
            What category matches your thoughts?
          </label>
          <Select onValueChange={handleCategoryChange} value={formData.category} >
            <SelectTrigger className="w-full bg-transparent border-0 border-b border-neutral-700 rounded-none px-0 py-3 text-white focus:ring-0 focus:border-white transition-colors h-auto text-base shadow-none">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-950 border border-neutral-800 text-white border-x-0">
              {categories.map((cat) => (
                <SelectItem
                    key={cat}
                    value={cat}
                    className="cursor-pointer">
                    {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="feedback"
            className="block text-sm tracking-wide text-neutral-300 font-light"
          >
            Share your thoughts
          </label>
          <Textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            placeholder="Hi, I'd love to ask you..."
            rows={2}
            className="w-full bg-transparent border-0 border-b border-neutral-700 rounded-none px-0 py-2 text-white placeholder-neutral-600 focus-visible:ring-0 focus-visible:border-white transition-colors resize-none text-base min-h-0 shadow-none"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm tracking-wide text-neutral-300 font-light"
          >
            What&apos;s your email?{" "}
            <span className="text-neutral-500 text-xs">(Optional)</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="marvin_mckinney@gmail.com"
            className="w-full bg-transparent border-0 border-b border-neutral-700 rounded-none px-0 py-2 text-white placeholder-neutral-600 focus-visible:ring-0 focus-visible:border-white transition-colors text-base shadow-none"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white text-black font-semibold flex flex-col items-center justify-center text-xs tracking-widest uppercase hover:bg-cyan-200 hover:cursor-pointer transition-transform hover:scale-105 duration-200 disabled:opacity-50 group"
          >
            <span>{loading ? "Sending" : "Send"}</span>
            <ArrowRight className="w-4 h-4 mt-1 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>
    </div>
  );
}