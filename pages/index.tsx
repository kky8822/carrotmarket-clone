import type { NextPage } from "next";
import FloatingBtn from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import { Product, Record } from "@prisma/client";
import client from "@libs/server/client";

interface RecordWithLength extends Record {
  length: number;
}
interface ProductWithRecord extends Product {
  records: RecordWithLength;
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithRecord[];
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductsResponse>("/api/products");

  return (
    <Layout title="Home" seoTitle="Home" hasTabBar>
      <div className="flex flex-col py-10 divide-y-[1.5px]">
        {data
          ? data?.products?.map((product) => (
              <Item
                id={product.id}
                key={product.id}
                image={product.image}
                title={product.name}
                price={product.price}
                hearts={product.records?.length}
                comments={1}
              />
            ))
          : "Loading..."}
      </div>
      <FloatingBtn href="/products/upload">
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
    </Layout>
  );
};

const Page: NextPage<{ products: ProductWithRecord[] }> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products": {
            ok: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  const products = await client.product.findMany({
    include: {
      records: {
        where: { kind: "Fav" },
      },
    },
  });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

export default Page;
