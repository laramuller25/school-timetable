import React from "react";
import { supabase } from "./supabaseClient";

export default function TestSupabase() {
  const testInsert = async () => {
    const { data, error } = await supabase
      .from("teachers")
      .insert([{ name: "Test Teacher" }])
      .select();

    if (error) {
      alert("Error: " + error.message);
      console.error(error);
    } else {
      alert("Inserted! Check console for data.");
      console.log(data);
    }
  };

  const testSelect = async () => {
    const { data, error } = await supabase.from("teachers").select("*");
    if (error) {
      alert("Error: " + error.message);
      console.error(error);
    } else {
      alert("Select success! Check console for data.");
      console.log(data);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button onClick={testInsert} style={{ marginRight: "10px" }}>
        Insert Test Teacher
      </button>
      <button onClick={testSelect}>Select Teachers</button>
    </div>
  );
}
