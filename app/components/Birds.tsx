import type { Bird } from "@prisma/client";
import { DisplayBird } from "./DisplayBird";

export default function AllBirds({
  birds,
  isAuthorized = false,
}: {
  isAuthorized?: boolean;
  birds: Bird[];
}) {
  return (
    <article className="cards">
      {birds.map((bird) => (
        <DisplayBird key={bird.birdId} isAuthorized={isAuthorized} {...bird} />
      ))}
    </article>
  );
}
