// app/test/page.tsx
"use client";

import { Input } from "@/components/input/Inputs";
import SELECT from "@/components/select/Select";
import { ECardType } from "@/types/card.interface";
import { useState } from "react";

export default function TestPage() {
  const[data,setData]=useState('')
  return (
    <div>
      <Input type="password" onChange={(e) => console.log(e)} name={"i"} label='Test input' error={'123'}/>
      <SELECT
        options={[
          { label: "🟨 Yellow ", value: ECardType.YELLOW },
          { label: "🟥 Red ", value: ECardType.RED },
        ]}
        label="Card type"
        placeholder="Select"
        className="grid"
        // error={"error?.message"}
        name='ct'
        value={data}
        onChange={v=>setData(v)}
      />
    </div>
  );
}
