import type { NextPage } from "next";
import Item from "../../components/item";
import Layout from "../../components/layout";

const Loved: NextPage = () => {
  return (
    <Layout canGoBack title="Love">
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
      </div>
    </Layout>
  );
};

export default Loved;
