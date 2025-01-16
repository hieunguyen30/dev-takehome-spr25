"use client";
import Table from "@/components/tables/Table";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useState } from "react";

/**
 * Legacy front-end code from Crisis Corner's previous admin page!
 */
export default function ItemRequestsPage() {
  const [item, setItem] = useState<string>("");
  const [itemList, setItemList] = useState<string[]>([]);

  const handleAddItem = (): void => {
    if (item.trim()) {
      setItemList((prevList) => [...prevList, item.trim()]);
      setItem("");
    }
  };

  return (
    <div><Table /></div>
    // <div className="max-w-md mx-auto mt-8 flex flex-col items-center gap-6">
    //   <h2 className="font-bold">Approve Items</h2>

    //   <div className="flex flex-col w-full gap-4">
    //     <Input
    //       type="text"
    //       placeholder="Type an item"
    //       value={item}
    //       onChange={(e) => setItem(e.target.value)}
    //       label="Item"
    //     />
    //     <Button onClick={handleAddItem}>Approve</Button>
    //   </div>
    //   <div className="flex flex-col gap-3">
    //     <h3 className="underline">Currently approved items:</h3>
    //     {itemList.length > 0 ? (
    //       <ul className="list-disc pl-5">
    //         {itemList.map((listItem, index) => (
    //           <li key={index}>{listItem}</li>
    //         ))}
    //       </ul>
    //     ) : (
    //       "None :("
    //     )}
    //   </div>
    //   <div>
    //     <Table></Table>
    //   </div>
    // </div>
  );
}
