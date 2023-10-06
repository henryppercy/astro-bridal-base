import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import type { Guest } from "../../../lib/types";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const first_name = formData.get("first_name")?.toString().trim();
  const last_name = formData.get("last_name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const dietary_requirements = formData.get("dietary_requirements")?.toString().trim();
  
  if (!first_name || !last_name || !email) {
    return new Response("Missing required fields or invalid email", {
      status: 422,
    });
  }
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (email && !emailRegex.test(email)) {
    return new Response("Invalid email", {
      status: 422,
    });
  }

  const guest: Guest = {
    first_name,
    last_name,
    email,
    dietary_requirements
  };

  try {
    const db = getFirestore(app);
    const guestsRef = db.collection("guests");
    await guestsRef.add(guest);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", {
      status: 500,
    });
  }

  return redirect("/");
};

export const GET: APIRoute = async () => {
  try {
    const db = getFirestore(app);
    const guestsRef = db.collection("guests");
    const snapshot = await guestsRef.get();
    const guests: Guest[] = [];

    if (snapshot.empty) {
      return new Response("No guests found", {
        status: 404,
      });
    }

    snapshot.forEach((doc) => {
      guests.push(doc.data() as Guest);
    });

    return new Response(JSON.stringify(guests), {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", {
      status: 500,
    });
  }
}
