import type { APIRoute } from "astro";
import { app } from "@firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import type { Guest } from "@lib/types";
import { validateGuests } from "@lib/utils";
import { sendEmail } from "@lib/email/mailer";

export const POST: APIRoute = async ({ request, redirect }) => {
  const guests: Guest[] = await request.json();

  const { validatedGuests, validationErrors } = validateGuests(guests);

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

    const addGuestsPromises = validatedGuests.map(guest => 
      guestsRef.add(guest.guest)
    );
    await Promise.all(addGuestsPromises);

    // const sendEmailPromises = validatedGuests.map(validatedGuest => 
    //   sendEmail(
    //     validatedGuest.guest.email,
    //     validatedGuest.guest.first_name,
    //     validatedGuest.guest.last_name
    //   )
    // );
    // await Promise.all(sendEmailPromises);

  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }

  return redirect('/home', 307);
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
