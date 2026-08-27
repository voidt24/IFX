import { APP_NAME } from "@/helpers/api.config";
import { fetchPersonData, PersonNotFoundError } from "@/helpers/fetchPersonData";
import ActorDetails from "@/views/ActorDetails";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

interface Params {
  params: { id: string };
}

// React request-memoization: generateMetadata and the page component both need
// this same call — cache() collapses them into a single TMDB request per render.
const getPerson = cache(async (id: string) => {
  if (!id || isNaN(Number(id))) notFound();

  try {
    return await fetchPersonData(id);
  } catch (error) {
    if (error instanceof PersonNotFoundError) notFound();
    throw error; // anything else bubbles up to error.tsx
  }
});

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const person = await getPerson(params.id);

  return {
    title: `${person.name} - ${APP_NAME}`,
    description: person.biography ? `${person.biography.slice(0, 155).trim()}...` : `${person.name} filmography and details on ${APP_NAME}`,
  };
}

const Actor = async ({ params }: Params) => {
  const person = await getPerson(params.id);

  return <ActorDetails person={person} />;
};

export default Actor;
