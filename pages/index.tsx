import type { NextPage } from "next";
import FloatingBtn from "../components/floating-button";
import Item from "../components/item";
import Layout from "../components/layout";

const Home: NextPage = () => {
  return (
    <Layout title="Home" hasTabBar>
      <div className="flex flex-col py-10 divide-y-[1.5px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((id, key) => (
          <Item
            id={id}
            key={key}
            title="New iPhone 14"
            detail="black"
            price={95}
            hearts={1}
            comments={1}
          />
        ))}
        <FloatingBtn href="/items/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingBtn>
      </div>
    </Layout>
  );
};

export default Home;
