"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import hitUrl from "./hitUrl";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

const items = [
  {
    id: "Day+1",
    label: "Day 1",
  },
  {
    id: "Day+2",
    label: "Day 2",
  },
  {
    id: "Day+3",
    label: "Day 3",
  },
] as const;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "invalid email address.",
  }),
  days: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  food: z.enum(["None", "Vegetarian", "Vegan"], {
    required_error: "You need to select a notification type.",
  }),
});

function MyForm() {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      days: [],
      food: "None",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const baseUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLScu981W5xKq08M5shI9-mr9CvHaBvK4j4ZSnXVWaE9Cg_uZjg/formResponse?";
    const params: string[] = [];

    params.push(`entry.2092238618=${encodeURIComponent(data.name)}`);
    params.push(`entry.1556369182=${encodeURIComponent(data.email)}`);

    // Handling days as an array
    data.days.forEach((day, index) => {
      params.push(`entry.1753222212=Day+${index + 1}`);
    });

    params.push(`entry.588393791=${encodeURIComponent(data.food)}`);
    params.push(`entry.2109138769=Yes`);

    const url = baseUrl + params.join("&");
    setLoading(true);
    console.log("Submitting form...")
    try {
      hitUrl(url);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
    setLoading(false);
    toast("Form submitted successfully!");
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input className="w-[600px]" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="w-[600px]" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="days"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  What days will you attend?
                </FormLabel>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="days"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="food"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base">Dietary restrictions</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="None" />
                    </FormControl>
                    <FormLabel className="font-normal">None</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Vegetarian" />
                    </FormControl>
                    <FormLabel className="font-normal">Vegetarian</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Vegan" />
                    </FormControl>
                    <FormLabel className="font-normal">Vegan</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default MyForm;
