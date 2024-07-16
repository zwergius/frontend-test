import { useState } from "react";
import { gql, useQuery } from "urql";
import { useParams } from "react-router-dom";

const personQuery = gql`
  query Person($personId: ID!) {
    person(id: $personId) {
      birthYear
      filmConnection {
        films {
          producers
          id
          planetConnection {
            planets {
              surfaceWater
            }
          }
          title
          releaseDate
        }
      }
      name
      species {
        averageHeight
      }
    }
  }
`;

const PersonPage = () => {
  const { personId } = useParams();
  const [{ data, fetching, error }] = useQuery({
    query: personQuery,
    variables: { personId },
  });
  const [filmIndex, setFilmIndex] = useState(0);

  if (fetching) return <p>Loading...</p>;

  const { person } = data;
  const { films } = person.filmConnection;
  const visibleFilm = films[filmIndex];
  const planetsWithoutWater = visibleFilm.planetConnection.planets.filter(
    ({ surfaceWater }) => !Boolean(surfaceWater)
  ).length;
  const producers = films
    .flatMap(({ producers }) => producers)
    .reduce((dictionary, producer) => {
      dictionary[producer] = (dictionary[producer] || 0) + 1;
      return dictionary;
    }, {});

  function decreaseFilmIndex() {
    let index = filmIndex - 1;
    if (filmIndex === 0) {
      index = films.length - 1;
    }
    setFilmIndex(index);
  }

  function increaseFilmIndex() {
    let index = filmIndex + 1;
    if (filmIndex === films.length - 1) {
      index = 0;
    }
    setFilmIndex(index);
  }

  return (
    <div className="px-8 py-4 flex flex-col items-center gap-8">
      {error && <p>Oh no... {error.message}</p>}
      {data && <h1 className="text-center mb-8 text-2xl">{person.name}</h1>}
      <div>
        <p>Producers (times worked together):</p>
        <ul className="pl-2">
          {Object.entries(producers).map(([name, count]) => (
            <li key={name}>{`${name} (${count})`}</li>
          ))}
        </ul>
      </div>
      <p>{`Birth Year: ${person.birthYear}`}</p>
      {person.species?.avarageHeight && (
        <p>{`Avarage Height: ${person.species.avarageHeight}`}</p>
      )}
      <div className="w-64">
        <h2 className="text-xl text-center">Films</h2>
        <div className="aspect-video border rounded p-4 flex flex-col items-center mb-2">
          <h3 className="text-lg">{visibleFilm.title}</h3>
          <h4 className="mb-4">{visibleFilm.releaseDate}</h4>
          <p className="text-xs">{`Planets without water: ${planetsWithoutWater}`}</p>
        </div>
        <div className="flex justify-between">
          <button
            className="border rounded py-1 px-2"
            onClick={decreaseFilmIndex}
            type="button"
          >
            Prev
          </button>
          <button
            className="border rounded py-1 px-2"
            onClick={increaseFilmIndex}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
