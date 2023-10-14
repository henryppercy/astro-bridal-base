import type { APIRoute } from "astro";
import { app } from "@firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import type { Guest } from "@lib/types";

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response("Missing id", {
      status: 422,
    });
  }

  try {
    const db = getFirestore(app);
    const guestsRef = db.collection("guests");
    const doc = await guestsRef.doc(id).get();
    const guest = doc.data() as Guest;

    if (!guest) {
      return new Response("Guest not found", {
        status: 404,
      });
    }

    return new Response(JSON.stringify(guest), {
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
