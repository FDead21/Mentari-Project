// app/contact/page.tsx

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

// This is a Next.js Server Action.
// This function will run securely on the server when the form is submitted.
async function addContact(formData: FormData) {
  'use server'; // This directive is required for Server Actions

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Use our Supabase client to insert the new contact
  const { error } = await supabase
    .from('contacts')
    .insert([{ name, email, message }]);

  if (error) {
    console.error('Error inserting contact:', error);
    // You could return an error message here
    return;
  }

  // Optional: Revalidate the path if you were displaying contacts on a page
  // revalidatePath('/admin/contacts'); 
  console.log('New contact submitted!');
  // Here you would typically redirect the user to a "thank you" page
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have a question or want a custom quote? Fill out the form below and {`We'll`} get back to you as soon as possible.
      </p>

      {/* The form calls our Server Action directly */}
      <form action={addContact} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}