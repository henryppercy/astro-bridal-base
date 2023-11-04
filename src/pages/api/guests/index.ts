import type { APIRoute } from "astro";
import { app } from "@firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import type { Guest, IndexedValidationError } from "@lib/types";
import { generateGuestArray } from "@lib/utils";
import { guestSchema } from "@lib/schema/guestSchema";

export const POST: APIRoute = async ({ request, redirect  }) => {
  const formData = await request.formData();

  const guests: Guest[] = generateGuestArray(formData);

  const validatedGuests: Guest[] = [];
  const validationErrors: IndexedValidationError[] = [];

  for (const [index, guestData] of guests.entries()) {
    const validatedGuest = guestSchema.safeParse(guestData);
  
    if (validatedGuest.success) {
      validatedGuests.push(validatedGuest.data);
    } else {
      validationErrors.push({ index, error: validatedGuest.error });
    }
  }

  if (validationErrors.length > 0) {
    return new Response(JSON.stringify(validationErrors), {
      status: 422,
      headers: {
        "content-type": "application/json"
      }
    });
  }

  try {
    const db = getFirestore(app);
    const guestsRef = db.collection("guests");
    const addGuestsPromises = validatedGuests.map(guest => guestsRef.add(guest));
    await Promise.all(addGuestsPromises);

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}

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
