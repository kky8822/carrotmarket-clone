import useSWR from "swr";
import Item from "@components/item";
import { Product, Record } from "@prisma/client";

interface RecordWithLength extends Record {
  length: number;
}

interface ProductWithRecord extends Product {
  records: RecordWithLength;
}

interface RecordWithProduct extends Record {
  product: ProductWithRecord;
}

interface RecordResponse {
  records: RecordWithProduct[];
}

interface ProductListProps {
  kind: "Purchase" | "Sale" | "Fav";
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<RecordResponse>(`/api/users/me/records?kind=${kind}`);
  return (
    <div className="flex flex-col py-10 divide-y-[1.5px]">
      {data?.records.map((record) => (
        <Item
          key={record.id}
          id={record.product.id}
          title={record.product.name}
          price={record.product.price}
          hearts={record.product.records.length}
          comments={1}
        />
      ))}
    </div>
  );
}
