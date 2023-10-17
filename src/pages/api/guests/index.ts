import type { APIRoute } from "astro";
import { app } from "@firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import type { Guest } from "@lib/types";
import { generateGuestArray } from "@lib/utils";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  
  const guests: Guest[] = generateGuestArray(formData);

  try {
    const db = getFirestore(app);
    const guestsRef = db.collection("guests");
    guests.forEach(async (guest) => await guestsRef.add(guest));
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
