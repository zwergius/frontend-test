import { gql, useQuery } from "urql";
import { Link } from "react-router-dom";

const query = gql`
  query Home {
    allPeople {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const HomePage = () => {
  const [{ data }] = useQuery({ query });
  console.log({ data });

  return (
    <div className="px-8 py-4 flex flex-col items-center">
      <h1 className="text-center mb-8">People</h1>
      <ul className="grid grid-cols-3 gap-8">
        {data?.allPeople.edges.map(({ node }) => (
          <li key={node.id}>
            <Link
              to={`/person/${node.id}`}
              className="aspect-square border rounded max-w-40 cursor-pointer flex flex-col justify-center h-full items-center hover:scale-105 transition-transform hover:underline"
            >
              <span>{node.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
