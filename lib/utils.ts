/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  if (transactions) {
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });
  }
  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    })
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};

// export const authFormSchema = (type: string) => z.object({
//   // sign-up
//   firstName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
//   lastName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
//   address1: type === 'sign-in' ? z.string().optional() : z.string().max(50),
//   city: type === 'sign-in' ? z.string().optional() : z.string().max(50),
//   state: type === 'sign-in' ? z.string().optional() : z.string().min(2).max(2),
//   postalCode: type === 'sign-in' ? z.string().optional() : z.string().min(3).max(6),
//   dateOfBirth: type === 'sign-in' ? z.string().optional() : z.string().min(3),
//   ssn: type === 'sign-in' ? z.string().optional() : z.string().min(3),
//   // both sign-up and sign-in
//   email: z.string().email(),
//   password: z.string().min(8),
// })

export const authFormSchema = (type: string) => z.object({
  // sign-up only fields
  firstName: type === 'sign-in' ? z.string().optional() : z.string().min(3, "First Name must be at least 3 characters"),
  lastName: type === 'sign-in' ? z.string().optional() : z.string().min(3, "Last Name must be at least 3 characters"),
  address1: type === 'sign-in' ? z.string().optional() : z.string().max(50, "Address must be less than 50 characters"),
  city: type === 'sign-in' ? z.string().optional() : z.string().max(50, "City must be less than 50 characters"),
  
  // State must be exactly 2 letters (e.g., CA, TX) and contain only alphabetic characters
  state: type === 'sign-in' ? z.string().optional() : z.string()
    .length(2, "State must be 2 characters (e.g., CA)")
    .regex(/^[A-Za-z]{2}$/, "State must contain only letters (e.g., CA)"),

  postalCode: type === 'sign-in' ? z.string().optional() : z.string()
    .length(5, "Postal Code must be exactly 5 digits")
    .regex(/^\d{5}$/, "Postal Code must be a valid US ZIP Code"),
  
  // Validate date format and ensure it’s a valid, logical date
  dateOfBirth: type === 'sign-in' ? z.string().optional() : z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in the format YYYY-MM-DD")
    .refine((val) => {
      const [year, month, day] = val.split('-').map(Number);
      return (
        year <= new Date().getFullYear() && 
        month >= 1 && month <= 12 && 
        day >= 1 && day <= new Date(year, month, 0).getDate() 
      );
    }, "Please enter a valid date (YYYY-MM-DD)"),
  
  ssn: type === 'sign-in' ? z.string().optional() : z.string().length(4, "SSN must be the last 4 digits").regex(/^\d{4}$/, "SSN must be the last 4 digits"),

  // fields required for both sign-up and sign-in
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
});
